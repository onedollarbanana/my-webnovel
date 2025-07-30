import React, { useEffect, useState, useContext } from 'react';
import MarkdownIt from 'markdown-it';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function ChapterView() {
  const { id, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [comments, setComments] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [text, setText] = useState('');
  const { token } = useContext(AuthContext);
  const md = new MarkdownIt();

  useEffect(() => {
    fetch(`/api/chapters/${id}/${chapterId}`)
      .then(res => res.json())
      .then(setChapter);
    fetch(`/api/comments/${chapterId}`)
      .then(res => res.json())
      .then(setComments);
    fetch(`/api/chapters/${id}`)
      .then(res => res.json())
      .then(setChapters);
  }, [id, chapterId]);

  const handleComment = async e => {
    e.preventDefault();
    await fetch(`/api/comments/${chapterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: text }),
    });
    setText('');
    const res = await fetch(`/api/comments/${chapterId}`);
    setComments(await res.json());
  };

  if (!chapter) return <div>Loading...</div>;

  const chapterIndex = chapters.findIndex(ch => ch.id === Number(chapterId));
  const prevChapter = chapters[chapterIndex - 1];
  const nextChapter = chapters[chapterIndex + 1];
  const wordCount = chapter.content
    ? chapter.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const NavLink = ({ to, children, disabled }) =>
    disabled ? (
      <span className="disabled">{children}</span>
    ) : (
      <Link to={to}>{children}</Link>
    );

  return (
    <div>
      <div className="chapter-nav">
        <NavLink
          to={`/fiction/${id}/chapter/${prevChapter ? prevChapter.id : ''}`}
          disabled={!prevChapter}
        >
          Previous Chapter
        </NavLink>
        <NavLink
          to={`/fiction/${id}/chapter/${nextChapter ? nextChapter.id : ''}`}
          disabled={!nextChapter}
        >
          Next Chapter
        </NavLink>
      </div>

      <h4>{chapter.title}</h4>
      <div className="chapter-meta">
        <div>Word Count: {wordCount}</div>
        <div>First Published: {new Date(chapter.createdAt).toLocaleDateString()}</div>
        <div>Last Edited: {new Date(chapter.updatedAt).toLocaleDateString()}</div>
      </div>

      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: md.render(chapter.content || '') }}
      />

      <div className="chapter-nav">
        <NavLink
          to={`/fiction/${id}/chapter/${prevChapter ? prevChapter.id : ''}`}
          disabled={!prevChapter}
        >
          Previous Chapter
        </NavLink>
        <NavLink
          to={`/fiction/${id}/chapter/${nextChapter ? nextChapter.id : ''}`}
          disabled={!nextChapter}
        >
          Next Chapter
        </NavLink>
      </div>

      <h5>Comments</h5>
      <ul>
        {comments.map(c => (
          <li key={c.id}>{c.content}</li>
        ))}
      </ul>
      {token && (
        <form onSubmit={handleComment} className="comment-form">
          <input value={text} onChange={e => setText(e.target.value)} />
          <button type="submit">Comment</button>
        </form>
      )}
    </div>
  );
}
