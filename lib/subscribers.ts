// Newsletter subscribers, stored as Sanity documents.
//
// Server-side only — imported by server actions, route handlers and the send
// script. Never import this from a Client Component.

import { randomUUID, createHash } from "node:crypto";
import { mutateClient as writeClient, hasWriteToken } from "./sanity/mutate";
import { fetchQuery } from "./sanity/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Typed as plain `string` on purpose: next-sanity infers query params from a
// string *literal*, and these one-line lookups trip that inference up.
const BY_ID_QUERY: string = `*[_id == $id][0]{ status, token }`;
const BY_TOKEN_QUERY: string = `*[_type == "subscriber" && token == $token][0]{ _id, email }`;
const SUBSCRIBED_QUERY: string =
  `*[_type == "subscriber" && status == "subscribed"] | order(createdAt asc){ email, token }`;
const COUNT_QUERY: string = `count(*[_type == "subscriber" && status == "subscribed"])`;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

// Deterministic document id from the email, so the same address can never be
// stored twice — Sanity enforces uniqueness on _id for free.
function docId(email: string): string {
  return `subscriber.${createHash("sha256").update(email).digest("hex").slice(0, 32)}`;
}

export type Subscriber = { email: string; token: string };

export type SubscribeResult =
  | { ok: true; status: "added" | "already" | "resubscribed"; token: string }
  | { ok: false; error: string };

// Idempotent: a new email is added, a returning unsubscribed one is reactivated,
// an already-active one is a friendly no-op. Returns the unsubscribe token so
// the caller can send a welcome email with a working one-click link.
export async function subscribe(emailRaw: string, source = "site"): Promise<SubscribeResult> {
  const email = emailRaw.trim().toLowerCase();
  if (!isValidEmail(email)) return { ok: false, error: "That email doesn't look right." };
  if (!hasWriteToken) return { ok: false, error: "The list isn't accepting signups right now." };

  const _id = docId(email);

  try {
    const existing = await fetchQuery<{ status?: string; token?: string } | null>(
      BY_ID_QUERY,
      { id: _id }
    );

    if (existing?.token) {
      if (existing.status === "subscribed") {
        return { ok: true, status: "already", token: existing.token };
      }
      await writeClient
        .patch(_id)
        .set({ status: "subscribed" })
        .unset(["unsubscribedAt"])
        .commit();
      return { ok: true, status: "resubscribed", token: existing.token };
    }

    const token = randomUUID();
    await writeClient.createIfNotExists({
      _id,
      _type: "subscriber",
      email,
      status: "subscribed",
      token,
      source,
      createdAt: new Date().toISOString(),
    });
    return { ok: true, status: "added", token };
  } catch (err) {
    // Log it — a signup that fails quietly is a subscriber lost for good.
    console.error("[newsletter] subscribe failed", err);
    return { ok: false, error: "Couldn't sign you up just now. Please try again." };
  }
}

// Everyone currently subscribed, for sending.
export async function listSubscribed(): Promise<Subscriber[]> {
  // Deliberately NOT swallowed: an empty list and a broken query look identical
  // to the caller, and "there are no subscribers" is the one lie that silently
  // stops a newsletter from ever going out.
  return fetchQuery<Subscriber[]>(SUBSCRIBED_QUERY);
}

export async function countSubscribed(): Promise<number> {
  return fetchQuery<number>(COUNT_QUERY);
}

// Returns the email that was unsubscribed (for a friendly confirmation), or null.
export async function unsubscribeByToken(token: string): Promise<string | null> {
  if (!token || !hasWriteToken) return null;
  try {
    const row = await fetchQuery<{ _id: string; email: string } | null>(
      BY_TOKEN_QUERY,
      { token }
    );
    if (!row) return null;
    await writeClient
      .patch(row._id)
      .set({ status: "unsubscribed", unsubscribedAt: new Date().toISOString() })
      .commit();
    return row.email;
  } catch (err) {
    console.error("[newsletter] unsubscribe failed", err);
    return null;
  }
}
