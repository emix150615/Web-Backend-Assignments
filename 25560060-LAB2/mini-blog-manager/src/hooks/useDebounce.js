import { useState, useEffect } from 'react';

// Custom hook để hoãn việc cập nhật value cho tới khi dừng gõ đủ khoảng thời gian delay
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Thiết lập timer đếm ngược
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hủy bộ đếm cũ nếu người dùng tiếp tục gõ trước khi hết thời gian delay
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};