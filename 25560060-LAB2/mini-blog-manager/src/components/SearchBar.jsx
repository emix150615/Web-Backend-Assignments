// Component thanh tìm kiếm từ khóa
export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search posts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          fontSize: '14px',
          outline: 'none',
          background: '#ffffff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      />
    </div>
  );
}