import { EnvelopeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

// One issue of the newsletter. Deliberately unstructured: write whatever the
// week's thinking is. The only required parts are a subject, a date and a body.
//
// Publishing the document is what sends it — see /api/sanity/webhook.
export const issue = defineType({
  name: "issue",
  title: "Newsletter Issue",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "subject",
      title: "Subject line",
      type: "string",
      description: "The inbox subject and the page title. Keep it plain.",
      validation: (r) => r.required().max(140),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "subject", maxLength: 96 },
      description: "The read-online URL: /newsletter/<slug>",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "preheader",
      title: "Preview text",
      type: "string",
      description: "Optional. The grey line inboxes show after the subject.",
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "issueDate",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "The issue",
      type: "array",
      description: "Write it however it wants to be written.",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
        }),
        defineArrayMember({
          type: "object",
          name: "codeBlock",
          title: "Code",
          fields: [
            defineField({ name: "language", type: "string" }),
            defineField({ name: "code", type: "text", rows: 10 }),
          ],
          preview: {
            select: { title: "language", subtitle: "code" },
            prepare({ title, subtitle }) {
              return { title: title || "code", subtitle: (subtitle || "").split("\n")[0] };
            },
          },
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "number",
      title: "Issue number",
      type: "number",
      description: "Optional. Shown as “Issue N” if set.",
    }),

    // --- Managed by the send pipeline. Don't edit by hand. ---
    defineField({
      name: "status",
      title: "Send status",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Not sent", value: "draft" },
          { title: "Sent", value: "sent" },
        ],
      },
      initialValue: "draft",
      description: "Set automatically when the issue is published and mailed out.",
    }),
    defineField({ name: "sentAt", title: "Sent at", type: "datetime", readOnly: true }),
    defineField({ name: "recipientCount", title: "Recipients", type: "number", readOnly: true }),
  ],
  orderings: [
    { title: "Newest", name: "dateDesc", by: [{ field: "issueDate", direction: "desc" }] },
  ],
  preview: {
    select: { title: "subject", status: "status", date: "issueDate", number: "number" },
    prepare({ title, status, date, number }) {
      const d = date ? new Date(date).toLocaleDateString() : "";
      return {
        title: number ? `#${number} — ${title}` : title || "Untitled issue",
        subtitle: `${status === "sent" ? "✅ Sent" : "✏️ Not sent"}${d ? ` · ${d}` : ""}`,
      };
    },
  },
});
