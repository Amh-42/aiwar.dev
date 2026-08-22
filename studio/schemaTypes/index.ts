import type { SchemaTypeDefinition } from "sanity";
import { issue } from "./issue";
import { post } from "./post";
import { subscriber } from "./subscriber";
import { topic } from "./topic";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, topic, issue, subscriber],
};
