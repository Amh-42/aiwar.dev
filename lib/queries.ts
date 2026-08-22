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

// Images are resolved to CDN urls here so the email renderer (which has no
// Sanity client) can just use them.
const issueFields = groq`
  _id, subject, preheader, issueDate, number, status, sentAt, recipientCount,
  "slug": slug.current,
  body[]{
    ...,
    _type == "image" => { ..., "url": asset->url }
  }
`;

export const issueByIdQuery = groq`*[_type == "issue" && _id == $id][0]{ ${issueFields} }`;

export const issueBySlugQuery = groq`
  *[_type == "issue" && slug.current == $slug][0]{ ${issueFields} }
`;

// Everything published shows in the archive immediately — being mailed out is a
// separate step that can lag by a minute.
export const publishedIssuesQuery = groq`
  *[_type == "issue" && defined(slug.current)] | order(issueDate desc)[0...50]{
    subject, preheader, issueDate, number, status, "slug": slug.current
  }
`;

export const unsentIssueByIdQuery = groq`
  *[_type == "issue" && _id == $id && status != "sent"][0]{ ${issueFields} }
`;
