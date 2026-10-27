require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Hàm hỗ trợ cho Câu 2: Tìm kiếm sản phẩm theo từ khóa (Prepared Statement)
async function searchItemsByKeyword(pool, keyword) {
  const sql = `SELECT * FROM items WHERE name LIKE ?`;
  const [rows] = await pool.execute(sql, [`%${keyword}%`]);
  return rows;
}

async function main() {
  try {
    console.log("=== KHỞI TẠO BẢNG & DỮ LIỆU MẪU ===");

    // 1. Tạo bảng categories & items (với khóa ngoại FOREIGN KEY)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        price DECIMAL(12, 2) NOT NULL,
        quantity INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);
    console.log("-> Bảng 'categories' và 'items' đã sẵn sàng.\n");

    // 2. Chèn dữ liệu mẫu (sử dụng INSERT IGNORE / TRUNCATE để thử nghiệm dễ dàng)
    await pool.execute(`DELETE FROM items`);
    await pool.execute(`DELETE FROM categories`);

    // Chèn Categories
    await pool.execute(`
      INSERT INTO categories (id, name, description) VALUES
      (1, 'Electronics', 'Thiết bị điện tử & công nghệ'),
      (2, 'Accessories', 'Phụ kiện máy tính và điện thoại'),
      (3, 'Office', 'Đồ dùng văn phòng')
    `);

    // Chèn Items
    await pool.execute(`
      INSERT INTO items (category_id, name, price, quantity) VALUES
      (1, 'Laptop Gaming ASUS ROG', 25000000, 5),
      (1, 'Màn hình Gaming 144Hz', 4500000, 10),
      (2, 'Chuột Wireless Logitech', 650000, 20),
      (2, 'Tai nghe Wireless Sony', 3200000, 15),
      (2, 'Bàn phím cơ', 450000, 30),
      (3, 'Ghế Gaming Ergonomic', 3500000, 2),
      (3, 'Bút viết cao cấp', 120000, 0)
    `);
    console.log("-> Đã chèn dữ liệu mẫu thành công.\n");

    // ==========================================
    // QUERIES
    // ==========================================

    // --- QUESTION 1: Filter & Sort ---
    console.log(
      "=== QUESTION 1: Sản phẩm có giá >= 500,000 VND & số lượng > 0 (Sắp xếp giảm dần) ===",
    );
    const sqlQ1 = `
      SELECT * FROM items 
      WHERE price >= 500000 AND quantity > 0 
      ORDER BY price DESC
    `;
    const [q1Rows] = await pool.execute(sqlQ1);
    console.table(q1Rows);

    // --- QUESTION 2: Wildcard / LIKE search ---
    console.log(
      '\n=== QUESTION 2: Tìm kiếm sản phẩm chứa "Gaming" hoặc "Wireless" ===',
    );

    // Cách A: Sử dụng hàm tìm kiếm đơn lẻ cho 1 từ khóa
    const gamingItems = await searchItemsByKeyword(pool, "Gaming");
    console.log(
      '-> Kết quả tìm kiếm riêng từ khóa "Gaming":',
      gamingItems.map((i) => i.name),
    );

    // Cách B: Truy vấn trực tiếp kết hợp cả 2 từ khóa "Gaming" OR "Wireless"
    const sqlQ2Multi = `
      SELECT * FROM items 
      WHERE name LIKE ? OR name LIKE ?
    `;
    const [q2Rows] = await pool.execute(sqlQ2Multi, ["%Gaming%", "%Wireless%"]);
    console.table(q2Rows);

    // --- QUESTION 3: Aggregate Functions ---
    console.log("\n=== QUESTION 3: Thống kê tổng quan toàn bộ sản phẩm ===");
    const sqlQ3 = `
      SELECT 
        SUM(quantity) AS total_stock_quantity,
        AVG(price) AS average_price,
        COUNT(*) AS total_items
      FROM items
    `;
    const [q3Rows] = await pool.execute(sqlQ3);
    console.table(q3Rows);

    // --- QUESTION 4: GROUP BY & HAVING ---
    console.log(
      "\n=== QUESTION 4: Thống kê theo Danh mục có Tổng giá trị tồn kho > 10,000,000 VND ===",
    );
    const sqlQ4 = `
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        COUNT(i.id) AS total_items,
        SUM(i.price * i.quantity) AS total_inventory_value
      FROM categories c
      JOIN items i ON c.id = i.category_id
      GROUP BY c.id, c.name
      HAVING total_inventory_value > 10000000
    `;
    const [q4Rows] = await pool.execute(sqlQ4);
    console.table(q4Rows);
  } catch (error) {
    console.error("Lỗi MySQL:", error.message);
  } finally {
    await pool.end();
    console.log("\nĐã đóng kết nối.");
  }
}

main();
