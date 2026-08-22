import { EnvelopeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

// One weekly issue of "AI, Actually Useful".
//
// The shape is deliberately rigid — five things used, one deep cut, one skip.
// A fixed skeleton is what makes a newsletter survivable: you fill slots, you
// don't invent a format every Sunday.
export const issue = defineType({
  name: "issue",
  title: "Newsletter Issue",
  type: "document",
  icon: EnvelopeIcon,
  groups: [
    { name: "meta", title: "Issue", default: true },
    { name: "body", title: "The five / deep cut / skip" },
    { name: "send", title: "Sending" },
  ],
  fields: [
    defineField({
      name: "number",
      title: "Issue number",
      type: "number",
      group: "meta",
      validation: (r) => r.required().integer().positive(),
    }),
    defineField({
      name: "subject",
      title: "Email subject line",
      type: "string",
      group: "meta",
      description: "What lands in the inbox. ~60 chars. Name the best thing in the issue.",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "meta",
      options: { source: "subject", maxLength: 96 },
      description: "Used for the read-online URL: /newsletter/<slug>",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "preheader",
      title: "Preview text",
      type: "string",
      group: "meta",
      description: "The grey line inboxes show after the subject.",
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "issueDate",
      title: "Issue date",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intro",
      title: "Opening note",
      type: "text",
      rows: 4,
      group: "meta",
      description: "Two or three sentences. What this week was actually like.",
    }),

    defineField({
      name: "tools",
      title: "Five things I actually used",
      type: "array",
      group: "body",
      description: "Only things you genuinely ran this week. No round-ups of things you read about.",
      of: [
        defineArrayMember({
          type: "object",
          name: "tool",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", type: "url" }),
            defineField({
              name: "whatFor",
              title: "What I used it for",
              type: "string",
              description: "The actual task, not the marketing description.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "verdict",
              type: "string",
              options: {
                list: [
                  { title: "Kept", value: "kept" },
                  { title: "Dropped", value: "dropped" },
                  { title: "Watching", value: "watching" },
                ],
                layout: "radio",
              },
              initialValue: "watching",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "note",
              title: "Why",
              type: "text",
              rows: 2,
              description: "One or two lines. The reason the verdict is the verdict.",
            }),
          ],
          preview: {
            select: { title: "name", verdict: "verdict", subtitle: "whatFor" },
            prepare({ title, verdict, subtitle }) {
              const mark = verdict === "kept" ? "✅" : verdict === "dropped" ? "❌" : "👀";
              return { title: `${mark} ${title || "Untitled"}`, subtitle };
            },
          },
        }),
      ],
      validation: (r) => r.max(6),
    }),

    defineField({
      name: "deepCut",
      title: "One deep cut",
      type: "object",
      group: "body",
      description: "A single tool, properly tested, with the config that made it work.",
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "url", type: "url" }),
        defineField({
          name: "body",
          title: "The write-up",
          type: "text",
          rows: 10,
          description: "Plain prose. Blank line between paragraphs.",
        }),
        defineField({
          name: "code",
          title: "The config / snippet",
          type: "text",
          rows: 8,
          description: "Optional. Rendered as a monospace block readers can copy.",
        }),
      ],
    }),

    defineField({
      name: "skip",
      title: "Skip this week",
      type: "object",
      group: "body",
      description: "The hyped thing that wasn't. Optional, but it's the trust-builder.",
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "url", type: "url" }),
        defineField({ name: "why", type: "text", rows: 3 }),
      ],
    }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "send",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Sent", value: "sent" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),
    defineField({
      name: "sentAt",
      title: "Sent at",
      type: "datetime",
      group: "send",
      readOnly: true,
    }),
    defineField({
      name: "recipientCount",
      title: "Recipients",
      type: "number",
      group: "send",
      readOnly: true,
    }),
  ],
  orderings: [
    { title: "Newest", name: "numberDesc", by: [{ field: "number", direction: "desc" }] },
  ],
  preview: {
    select: { title: "subject", number: "number", status: "status", date: "issueDate" },
    prepare({ title, number, status, date }) {
      const d = date ? new Date(date).toLocaleDateString() : "";
      return {
        title: `#${number ?? "?"} — ${title || "Untitled"}`,
        subtitle: `${status === "sent" ? "✅ Sent" : "✏️ Draft"}${d ? ` · ${d}` : ""}`,
      };
    },
  },
});
