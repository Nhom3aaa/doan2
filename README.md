
Dự án website bán điện thoại đầy đủ chức năng với **Frontend Angular** và **Backend Node.js/Express**. Hệ thống hỗ trợ 3 vai trò người dùng: **Khách hàng**, **Admin**, và **Shipper**.
=======
Dự án website bán điện thoại đầy đủ chức năng với Frontend Angular và Backend Node.js/Express.
>>>>>>> 81f4f5e255a94ee797685ee042923ae864d46109

## 🚀 Yêu cầu hệ thống

- **Node.js**: Phiên bản 18+ (khuyên dùng)
- **MongoDB**: Cần có server MongoDB đang chạy (local hoặc cloud)
- **npm**: Trình quản lý gói đi kèm với Node.js

## 🛠️ Cài đặt và Chạy

Dự án bao gồm 2 phần chính: **backend** và **frontend**. Bạn cần chạy cả hai để ứng dụng hoạt động đầy đủ.

### 1. Backend (API)

Di chuyển vào thư mục backend và cài đặt các thư viện:

```bash
cd backend
npm install
```

**Cấu hình môi trường (.env):**
<<<<<<< HEAD
Tạo file `.env` trong thư mục `backend` với nội dung sau:
=======
Tạo file `.env` trong thư mục `backend` với nội dung sau (điền các key của bạn):
>>>>>>> 81f4f5e255a94ee797685ee042923ae864d46109

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/phone-store

# Security
<<<<<<< HEAD
JWT_SECRET=your_jwt_secret_key

# Social Auth (Optional)
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret

# AI Features (Optional)
GROQ_API_KEY=your_key
=======
JWT_SECRET=your_secret_key_here

# Social Auth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# AI Features (Optional)
GROQ_API_KEY=your_groq_api_key
>>>>>>> 81f4f5e255a94ee797685ee042923ae864d46109
```

**Chạy server:**

```bash
# Chạy với nodemon (dev mode)
npm run dev
<<<<<<< HEAD
```

Backend sẽ chạy tại: `http://localhost:5001`
=======

# Hoặc chạy thông thường
npm start
```

Backend sẽ chạy tại: `http://localhost:5001` (mặc định)
>>>>>>> 81f4f5e255a94ee797685ee042923ae864d46109

### 2. Frontend (Angular App)

Mở một terminal mới, di chuyển vào thư mục frontend và cài đặt thư viện:

```bash
cd frontend
npm install
```

**Chạy ứng dụng:**

```bash
npm start
<<<<<<< HEAD
# Hoặc: ng serve
=======
# Hoặc
ng serve
>>>>>>> 81f4f5e255a94ee797685ee042923ae864d46109
```

Frontend sẽ chạy tại: `http://localhost:4200`

## 📚 Công nghệ sử dụng

### Frontend

<<<<<<< HEAD
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
=======
- **Angular 17**: Framework chính.
- **Tailwind CSS**: Styling framework.
- **Socket.io-client**: Real-time chat & notifications.
- **Chart.js / ng2-charts**: Biểu đồ thống kê.

### Backend

- **Node.js & Express**: API Framework.
- **MongoDB & Mongoose**: Cơ sở dữ liệu.
- **Socket.io**: Xử lý thời gian thực.
- **Passport.js**: Xác thực người dùng (Google, Facebook).
- **JWT**: Bảo mật API.
- **Groq SDK**: Tích hợp AI.

## ✨ Tính năng chính

- **Người dùng**:
  - Đăng ký, Đăng nhập (Local, Google, Facebook).
  - Tìm kiếm, xem chi tiết sản phẩm.
  - Giỏ hàng, Đặt hàng, Thanh toán.
  - Lịch sử đơn hàng.
  - Chat trực tiếp với Admin.
- **Admin**:
  - Quản lý sản phẩm, danh mục.
  - Quản lý đơn hàng, trạng thái đơn.
  - Quản lý người dùng.
  - Dashboard thống kê doanh thu.
  - Chat hỗ trợ khách hàng.
>>>>>>> 81f4f5e255a94ee797685ee042923ae864d46109
