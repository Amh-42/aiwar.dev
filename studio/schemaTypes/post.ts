import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

// A blog post. Same shape as the forbes.et / fact.et `post`, minus the parts a
// one-person site doesn't need (no author reference — it's always Anwar).
export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "topics",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "topic" }] })],
      validation: (r) => r.required().min(1).unique(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      description: "Used in cards, search results, SEO and social previews.",
      validation: (r) => r.required().max(280),
    }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      type: "boolean",
      description: "Pin to the top of the blog index.",
      initialValue: false,
    }),
    defineField({
      name: "body",
      type: "array",
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
            defineField({ name: "code", type: "text", rows: 12 }),
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
  ],
  orderings: [
    { title: "Newest", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", date: "publishedAt", media: "coverImage" },
    prepare({ title, date, media }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : "unpublished",
        media,
      };
    },
  },
});
