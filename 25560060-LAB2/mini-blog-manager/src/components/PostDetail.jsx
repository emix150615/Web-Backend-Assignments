import { useEffect, useState } from 'react';
import { fetchCommentsByPostId } from '../services/api';

// Component Modal xem chi tiết và gửi bình luận mới
export default function PostDetail({ post, onClose }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    if (post) {
      setLoadingComments(true);
      fetchCommentsByPostId(post.id)
        .then((data) => setComments(data.comments || []))
        .catch((err) => console.error(err))
        .finally(() => setLoadingComments(false));
    }
  }, [post]);

  // Xử lý chèn bình luận mới vào danh sách hiện tại
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      body: newCommentText,
      user: { username: 'You' },
    };

    setComments((prev) => [newCommentObj, ...prev]);
    setNewCommentText('');
  };

  if (!post) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        justify: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>
          {post.title}
        </h2>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', marginBottom: '20px' }}>
          {post.body}
        </p>
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '16px' }} />

        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>
          Comments:
        </h4>

        {/* Biểu mẫu gửi bình luận */}
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 14px',
              background: '#635bff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Post
          </button>
        </form>

        {loadingComments ? (
          <p style={{ fontSize: '13px', color: '#64748b' }}>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#64748b' }}>No comments found.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} style={{ borderBottom: '1px solid #f1f5f9', padding: '10px 0' }}>
              <strong style={{ fontSize: '13px', color: '#334155' }}>
                {comment.user?.username || 'User'}:
              </strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>
                {comment.body}
              </p>
            </div>
          ))
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
            padding: '8px 18px',
            background: '#64748b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}