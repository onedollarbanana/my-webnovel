import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ChapterView() {
  const { id, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch(`/api/chapters/${id}/${chapterId}`)
      .then(res => res.json())
      .then(setChapter);
    fetch(`/api/comments/${chapterId}`)
      .then(res => res.json())
      .then(setComments);
  }, [id, chapterId]);

  const handleComment = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
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

  return (
    <div>
      <h4>{chapter.title}</h4>
      <p>{chapter.content}</p>
      <h5>Comments</h5>
      <ul>
        {comments.map(c => (
          <li key={c.id}>{c.content}</li>
        ))}
      </ul>
      <form onSubmit={handleComment} className="comment-form">
        <input value={text} onChange={e => setText(e.target.value)} />
        <button type="submit">Comment</button>
      </form>
    </div>
  );
}
