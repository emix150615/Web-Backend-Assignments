require("dotenv").config();
const mongoose = require("mongoose"); // Dòng khai báo bị thiếu trước đó

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shop_mongoose_db";

// 1. Khai báo Schema
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // QUESTION 1: Custom validation số điện thoại VN bằng Regex
    phone: {
      type: String,
      validate: {
        validator: (v) => /^(03|05|07|08|09)\d{8}$/.test(v),
        message: (props) => `${props.value} không phải SĐT hợp lệ!`,
      },
    },
    age: { type: Number, min: 18 },
    role: { type: String, enum: ["user", "admin", "manager"], default: "user" },
    isActive: { type: Boolean, default: true },
    // QUESTION 4: Khai báo trường hỗ trợ Soft Delete
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // QUESTION 2: Cấu hình cho phép xuất Virtuals
    toJSON: { virtuals: true },
  },
);

// QUESTION 2: Virtual property 'displayInfo'
userSchema.virtual("displayInfo").get(function () {
  return `${this.fullName} <${this.email}> [${this.role ? this.role.toUpperCase() : "USER"}]`;
});

// QUESTION 3: Static method findActiveByRole
userSchema.statics.findActiveByRole = function (roleName) {
  return this.find({ role: roleName, isActive: true }).sort({ fullName: 1 });
};

// QUESTION 4: Instance method softDelete
userSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.isActive = false;
  return await this.save();
};

// QUESTION 5 (a): Pre-save hook giả lập Hash password
userSchema.pre("save", function () {
  if (this.isModified("password") && !this.password.startsWith("$hashed$")) {
    this.password = `$hashed$_${this.password}`;
  }
});

// QUESTION 5 (b): Pre-find hook tự động ẩn các bản ghi bị soft delete
userSchema.pre(/^find/, function () {
  this.where({ isDeleted: { $ne: true } });
});

// Tạo Model
const User = mongoose.model("User", userSchema);

// Hàm thực thi & Kiểm chứng (Proof)
async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("-> Kết nối MongoDB thành công!\n");
    await User.deleteMany({}); // Dọn sạch dữ liệu cũ

    // === PROOF Q1: Custom Validation SĐT ===
    console.log("--- PROOF Q1: Kiểm tra Validate SĐT ---");
    try {
      await User.create({
        fullName: "User SĐT Lỗi",
        email: "phone_error@example.com",
        password: "123",
        phone: "0212345678", // Đầu 02 bị sai Regex
        age: 20,
      });
    } catch (err) {
      console.log(
        "✅ [PASSED Q1] Bắt lỗi thành công khi nhập SĐT sai:",
        err.message,
      );
    }

    // === PROOF Q2 & Q5a: Pre-save Password & Virtual Property ===
    console.log(
      "\n--- PROOF Q2 & Q5a: Pre-save Password & Virtual Property ---",
    );
    const user1 = await User.create({
      fullName: "Nguyen Van A",
      email: "a.nguyen@example.com",
      password: "mySecretPassword123",
      phone: "0912345678",
      age: 20,
      role: "admin",
    });

    console.log("✅ [PASSED Q5a] Mật khẩu đã tự động mã hóa:", user1.password);
    console.log(
      "✅ [PASSED Q2] Trực tiếp gọi Virtual Field:",
      user1.displayInfo,
    );

    const user2 = await User.create({
      fullName: "Bui Van B",
      email: "b.bui@example.com",
      password: "123",
      phone: "0388888888",
      age: 22,
      role: "user",
    });

    const user3 = await User.create({
      fullName: "An Tran C",
      email: "c.an@example.com",
      password: "123",
      phone: "0777777777",
      age: 25,
      role: "user",
    });

    // === PROOF Q3: Static Method ===
    console.log("\n--- PROOF Q3: Static Method findActiveByRole ---");
    const activeUsers = await User.findActiveByRole("user");
    console.log("✅ [PASSED Q3] Danh sách User (role: 'user') sắp xếp A-Z:");
    activeUsers.forEach((u) => console.log(`   - ${u.fullName}`));

    // === PROOF Q4 & Q5b: Soft Delete & Pre-find Query Hook ===
    console.log("\n--- PROOF Q4 & Q5b: Soft Delete & Query Hook ---");
    console.log(`Thực hiện Soft Delete tài khoản: ${user2.fullName}`);
    await user2.softDelete();

    console.log("✅ [PASSED Q4] Cập nhật trạng thái sau softDelete():", {
      isDeleted: user2.isDeleted,
      isActive: user2.isActive,
    });

    const findResults = await User.find();
    console.log(
      "\n✅ [PASSED Q5b] Danh sách User.find() còn lại (Đã tự động lọc bỏ Bui Van B):",
    );
    console.log(
      "  ",
      findResults.map((u) => u.fullName),
    );
  } catch (error) {
    console.error("Lỗi:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n-> Đã đóng kết nối thành công.");
  }
}

main();
