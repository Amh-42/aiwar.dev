import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Subscribers live in Sanity rather than a separate database — one fewer
// service to run for a personal list. Written only by the server-side write
// client; the dataset denies anonymous reads, so emails never reach a browser.
export const subscriber = defineType({
  name: "subscriber",
  title: "Subscriber",
  type: "document",
  icon: UsersIcon,
  readOnly: true,
  fields: [
    defineField({ name: "email", type: "string" }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "Subscribed", value: "subscribed" },
          { title: "Unsubscribed", value: "unsubscribed" },
        ],
      },
    }),
    defineField({
      name: "token",
      type: "string",
      description: "One-click unsubscribe token.",
    }),
    defineField({
      name: "source",
      type: "string",
      description: "Where they joined from — site, linkedin-giveaway, telegram.",
    }),
    defineField({ name: "createdAt", type: "datetime" }),
    defineField({ name: "unsubscribedAt", type: "datetime" }),
  ],
  orderings: [
    { title: "Newest", name: "createdAtDesc", by: [{ field: "createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "email", status: "status", source: "source" },
    prepare({ title, status, source }) {
      return {
        title,
        subtitle: `${status === "subscribed" ? "✅" : "🚫"} ${source || "site"}`,
      };
    },
  },
});
