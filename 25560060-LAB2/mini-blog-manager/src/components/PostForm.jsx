import { useState } from 'react';

// Component biểu mẫu tạo bài viết mới chuẩn thiết kế UI
export default function PostForm({ onAddPost }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    onAddPost({ title, body });
    setTitle('');
    setBody('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
        New post
      </h3>

      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            outline: 'none',
            fontSize: '14px',
            background: '#ffffff',
          }}
          required
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            outline: 'none',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            background: '#ffffff',
          }}
          required
        />
      </div>

      <button
        type="submit"
        style={{
          padding: '10px 20px',
          background: '#635bff',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontWeight: '600',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        Add post
      </button>
    </form>
  );
}