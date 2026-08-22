import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from '../../lib/sanity/env';

const builder = imageUrlBuilder({ projectId, dataset });

const components = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="prose-fig">
          <Image
            src={builder.image(value).width(1400).quality(78).url()}
            alt={value.alt || ''}
            width={1400}
            height={900}
            sizes="(max-width: 780px) 100vw, 720px"
          />
          {value.alt ? <figcaption>{value.alt}</figcaption> : null}
        </figure>
      );
    },
    codeBlock: ({ value }) => (
      <pre className="prose-code">
        <code>{value?.code}</code>
      </pre>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const external = /^https?:\/\//.test(value?.href || '');
      return (
        <a
          href={value?.href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export default function Prose({ value }) {
  return (
    <div className="prose">
      <PortableText value={value} components={components} />
    </div>
  );
}
