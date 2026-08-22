import { groq } from "next-sanity";

// --- Blog -----------------------------------------------------------------

const cardFields = groq`
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  coverImage,
  "topics": topics[]->{ title, "slug": slug.current }
`;

export const postsPageQuery = groq`{
  "total": count(*[_type == "post" && defined(slug.current)
    && (!defined($topic) || references($topic))]),
  "posts": *[_type == "post" && defined(slug.current)
    && (!defined($topic) || references($topic))]
    | order(featured desc, publishedAt desc)[$start...$end]{ ${cardFields} }
}`;

// Scored search: a title hit outranks an excerpt hit, which outranks a body hit.
const searchMatch = groq`(
  title match $q || excerpt match $q || pt::text(body) match $q
)`;

export const searchPostsQuery = groq`{
  "total": count(*[_type == "post" && defined(slug.current)
    && (!defined($topic) || references($topic)) && ${searchMatch}]),
  "posts": *[_type == "post" && defined(slug.current)
    && (!defined($topic) || references($topic)) && ${searchMatch}]
    | score(
        boost(title match $q, 6),
        boost(excerpt match $q, 3),
        pt::text(body) match $q
      )
    | order(_score desc, publishedAt desc)[$start...$end]{ ${cardFields} }
}`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ${cardFields},
    body,
    "related": *[_type == "post" && slug.current != $slug
      && count(topics[@._ref in ^.^.topics[]._ref]) > 0]
      | order(publishedAt desc)[0...3]{ ${cardFields} }
  }
`;

export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)].slug.current`;

export const allTopicsQuery = groq`
  *[_type == "topic" && defined(slug.current) && count(*[_type == "post" && references(^._id)]) > 0]
    | order(title asc){
      title,
      "slug": slug.current,
      description,
      "count": count(*[_type == "post" && references(^._id)])
    }
`;

export const topicBySlugQuery = groq`
  *[_type == "topic" && slug.current == $slug][0]{ _id, title, "slug": slug.current, description }
`;

// --- Newsletter -----------------------------------------------------------

const issueFields = groq`
  _id, number, subject, preheader, intro, issueDate, status, sentAt, recipientCount,
  "slug": slug.current,
  tools, deepCut, skip
`;

export const latestDraftIssueQuery = groq`
  *[_type == "issue" && status == "draft"] | order(number desc)[0]{ ${issueFields} }
`;

export const issueByIdQuery = groq`*[_type == "issue" && _id == $id][0]{ ${issueFields} }`;

export const issueBySlugQuery = groq`
  *[_type == "issue" && slug.current == $slug && status == "sent"][0]{ ${issueFields} }
`;

export const sentIssuesQuery = groq`
  *[_type == "issue" && status == "sent"] | order(number desc)[0...50]{
    number, subject, preheader, issueDate, "slug": slug.current,
    "toolCount": count(tools)
  }
`;

export const allIssuesQuery = groq`
  *[_type == "issue"] | order(number desc)[0...50]{
    _id, number, subject, issueDate, status, sentAt, recipientCount,
    "slug": slug.current
  }
`;
