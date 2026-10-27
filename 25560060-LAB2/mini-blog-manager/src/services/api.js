const BASE_URL = 'https://dummyjson.com/posts';

//1. Lấy danh sách bài viết phân trang (limit = 10, skip = 0)
export const fetchPosts = async (limit = 10, skip = 0) => {
    const res = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
};
// Tìm kiếm bài viết theo từ khóa
export const searchPosts = async (query) => {
  const res = await fetch(`${BASE_URL}/search?q=${query}`);
  if (!res.ok) throw new Error('Failed to search posts');
  return res.json();
};

// Lấy danh sách bình luận của bài viết dựa vào ID
export const fetchCommentsByPostId = async (postId) => {
  const res = await fetch(`${BASE_URL}/${postId}/comments`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
};

// Gửi yêu cầu thêm bài viết mới
export const createPost = async (postData) => {
  const res = await fetch(`${BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...postData, userId: 1 }),
  });
  if (!res.ok) throw new Error('Failed to add post');
  return res.json();
};

// Gửi yêu cầu xóa bài viết
export const removePost = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return res.json();
};