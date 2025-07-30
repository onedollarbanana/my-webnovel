import React from 'react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export default function MarkdownEditor({ value, onChange }) {
  return (
    <div className="markdown-editor">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Content (Markdown supported)"
      />
      <div
        className="markdown-preview markdown-content"
        dangerouslySetInnerHTML={{ __html: md.render(value) }}
      />
    </div>
  );
}
