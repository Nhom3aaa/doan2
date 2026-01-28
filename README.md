# Phone Store Website

Dự án website bán điện thoại đầy đủ chức năng với **Frontend Angular** và **Backend Node.js/Express**. Hệ thống hỗ trợ 3 vai trò người dùng: **Khách hàng**, **Admin**, và **Shipper**.

## 🚀 Yêu cầu hệ thống

- **Node.js**: Phiên bản 18+ (khuyên dùng)
- **MongoDB**: Cần có server MongoDB đang chạy (local hoặc cloud)
- **npm**: Trình quản lý gói đi kèm với Node.js
- **Docker & Docker Compose**: (Tùy chọn) Để chạy container.

## 🛠️ Cài đặt và Chạy

Dự án bao gồm 2 phần chính: **backend** và **frontend**.

### 1. Backend (API)

Di chuyển vào thư mục backend và cài đặt các thư viện:

```bash
cd backend
npm install
```

**Cấu hình môi trường (.env):**
Tạo file `.env` trong thư mục `backend`:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/phone-store

# Security
JWT_SECRET=your_jwt_secret_key

# Social Auth (Optional)
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret

# AI Features (Optional)
GROQ_API_KEY=your_key
```

**Chạy server:**

```bash
# Chạy với nodemon (dev mode)
npm run dev
# Hoặc chạy thường
npm start
```

Backend sẽ chạy tại: `http://localhost:5001`

### 2. Frontend (Angular App)

Mở terminal mới, vào thư mục frontend:

```bash
cd frontend
npm install
```

**Chạy ứng dụng:**

```bash
npm start
# Hoặc: ng serve
```

Frontend sẽ chạy tại: `http://localhost:4200`

### 3. Chạy bằng Docker (Khuyên dùng cho Production)

Nếu bạn muốn chạy toàn bộ hệ thống (Frontend + Backend + Database) nhanh chóng:

**Yêu cầu:** Cài đặt Docker và Docker Compose.

**Chạy lệnh:**

```bash
docker-compose up --build -d
```

Hệ thống sẽ chạy tại:

- **Frontend**: `http://localhost:80` (hoặc `http://localhost`)
- **Backend**: `http://localhost:5001`
- **MongoDB**: `localhost:27017`

---

## 📚 Công nghệ sử dụng

### Frontend

- **Angular 17**: Framework chính (Standalone Components).
- **Tailwind CSS**: Styling framework hiện đại.
- **Socket.io-client**: Real-time chat & notifications.
- **Chart.js**: Biểu đồ thống kê.

### Backend

- **Node.js & Express**: API Framework mạnh mẽ.
- **MongoDB & Mongoose**: Cơ sở dữ liệu NoSQL.
- **Socket.io**: Xử lý giao tiếp thời gian thực.
- **Multer**: Xử lý upload file (Ảnh/Video).
- **JWT**: Xác thực và phân quyền bảo mật.
- **Groq SDK**: Tích hợp AI.

## ✨ Tính năng chính

### 👤 Khách hàng (User)

- Đăng ký, Đăng nhập (Local, Google, Facebook).
- Tìm kiếm, lọc sản phẩm (Thương hiệu, Giá...).
- Giỏ hàng, Đặt hàng, Thanh toán online/COD.
- Theo dõi trạng thái đơn hàng realtime.
- Chat trực tiếp với nhân viên hỗ trợ.

### 👑 Quản trị viên (Admin)

- Dashboard thống kê doanh thu, đơn hàng, khách hàng mới.
- Quản lý Sản phẩm: Thêm, sửa, xóa, upload ảnh/video.
- Quản lý Đơn hàng: Xác nhận, gán shipper, hủy đơn.
- **Xem bằng chứng giao hàng**: Xem ảnh/video shipper gửi về ngay trên chi tiết đơn.
- Quản lý Người dùng và Chat Support.

### 🚚 Nhân viên giao hàng (Shipper) [MỚI]

- **Kênh đối tác riêng**: Giao diện tối ưu cho điện thoại.
- **Nhận đơn (Pool)**: Xem và tự nhận các đơn hàng chưa có người giao.
- **Quản lý đơn giao**: Xem danh sách đơn cần giao, gọi điện cho khách ngay trên app.
- **Cập nhật trạng thái**: Đang giao, Đã giao, Hủy.
- **Bằng chứng giao hàng**: Bắt buộc Upload Ảnh/Video khi xác nhận "Đã giao" để đảm bảo tính minh bạch.

## 🤝 Đóng góp

Dự án được phát triển bởi nhóm 3. Mọi đóng góp xin gửi Pull Request hoặc tạo Issue.
