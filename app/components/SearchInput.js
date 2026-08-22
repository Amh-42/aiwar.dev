// Plain GET form → /blog?q=… . Works without JS, needs no client runtime.
// Same mechanic as the forbes.et search box.
export default function SearchInput({ defaultValue = '', topic = '', placeholder = 'Search posts…' }) {
  return (
    <form action="/blog" role="search" className="searchbar">
      {topic ? <input type="hidden" name="topic" value={topic} /> : null}
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label="Search posts"
      />
      <button type="submit">Search</button>
    </form>
  );
}
