// Component hiển thị bài viết hỗ trợ tương tác Like và Dislike
export default function PostItem({ post, onDelete, onView, onLike, onDislike }) {
  // Chuẩn hóa dữ liệu lượt thích từ API
  const likes = post.reactions?.likes ?? (typeof post.reactions === 'number' ? post.reactions : 0);
  const dislikes = post.reactions?.dislikes ?? 0;

  return (
    <div
      style={{
        background: '#ffffff',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        marginBottom: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
        {post.title}
      </h4>

      {post.tags && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                background: '#eeefff',
                color: '#5b52f6',
                fontSize: '12px',
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: '8px',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Thanh tương tác Like và Dislike */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={() => onLike(post.id)}
          style={{
            background: '#f1f5f9',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            color: '#334155',
          }}
        >
          👍 {likes}
        </button>
        <button
          onClick={() => onDislike(post.id)}
          style={{
            background: '#f1f5f9',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            color: '#334155',
          }}
        >
          👎 {dislikes}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onView(post)}
          style={{
            padding: '8px 16px',
            background: '#eeefff',
            color: '#5b52f6',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          View
        </button>
        <button
          onClick={() => onDelete(post.id)}
          style={{
            padding: '8px 16px',
            background: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}