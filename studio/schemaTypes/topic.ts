import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// A blog topic. Kept as a document (not a plain string) for the same reason
// forbes.et does it — clean /blog?topic=<slug> URLs and filter chips that can't
// drift out of sync with typos.
export const topic = defineType({
  name: "topic",
  title: "Topic",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      description: "One line. Shown at the top of the filtered list.",
    }),
  ],
  orderings: [{ title: "A–Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "description" } },
});
