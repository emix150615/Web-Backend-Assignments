import { useState, useEffect } from 'react';
import { fetchPosts, searchPosts, createPost, removePost } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import PostForm from '../components/PostForm';
import SearchBar from '../components/SearchBar';
import PostItem from '../components/PostItem';
import PostDetail from '../components/PostDetail';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  const limit = 10;

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (debouncedSearch.trim() !== '') {
          data = await searchPosts(debouncedSearch);
        } else {
          const skip = (page - 1) * limit;
          data = await fetchPosts(limit, skip);
        }
        setPosts(data.posts || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [debouncedSearch, page]);

  // Xử lý tăng số lượt Like trong State
  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const currentLikes = post.reactions?.likes ?? (typeof post.reactions === 'number' ? post.reactions : 0);
          const currentDislikes = post.reactions?.dislikes ?? 0;
          return {
            ...post,
            reactions: {
              likes: currentLikes + 1,
              dislikes: currentDislikes,
            },
          };
        }
        return post;
      })
    );
  };

  // Xử lý tăng số lượt Dislike trong State
  const handleDislike = (id) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const currentLikes = post.reactions?.likes ?? (typeof post.reactions === 'number' ? post.reactions : 0);
          const currentDislikes = post.reactions?.dislikes ?? 0;
          return {
            ...post,
            reactions: {
              likes: currentLikes,
              dislikes: currentDislikes + 1,
            },
          };
        }
        return post;
      })
    );
  };

  const handleAddPost = async (formData) => {
    try {
      const newPost = await createPost(formData);
      setPosts((prev) => [newPost, ...prev]);
    } catch (err) {
      alert('Error adding post: ' + err.message);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await removePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Error deleting post: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 16px' }}>
      <h1 style={{ color: '#5b52f6', fontSize: '26px', fontWeight: '800', marginBottom: '24px' }}>
        Mini Blog Manager
      </h1>

      <PostForm onAddPost={handleAddPost} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {loading && <p style={{ color: '#64748b', fontSize: '14px' }}>Loading posts...</p>}
      {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
              onView={setSelectedPost}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          ))}

          {debouncedSearch.trim() === '' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: page === 1 ? '#f1f5f9' : '#ffffff',
                  color: page === 1 ? '#94a3b8' : '#334155',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Previous
              </button>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Page {page}</span>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: page * limit >= total ? '#f1f5f9' : '#ffffff',
                  color: page * limit >= total ? '#94a3b8' : '#334155',
                  cursor: page * limit >= total ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}