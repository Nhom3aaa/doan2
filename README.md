# Phone Store Website

Dự án website bán điện thoại đầy đủ chức năng với Frontend Angular và Backend Node.js/Express.

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
Tạo file `.env` trong thư mục `backend` với nội dung sau (điền các key của bạn):

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/phone-store

# Security
JWT_SECRET=your_secret_key_here

# Social Auth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# AI Features (Optional)
GROQ_API_KEY=your_groq_api_key
```

**Chạy server:**

```bash
# Chạy với nodemon (dev mode)
npm run dev

# Hoặc chạy thông thường
npm start
```

Backend sẽ chạy tại: `http://localhost:5001` (mặc định)

### 2. Frontend (Angular App)

Mở một terminal mới, di chuyển vào thư mục frontend và cài đặt thư viện:

```bash
cd frontend
npm install
```

**Chạy ứng dụng:**

```bash
npm start
# Hoặc
ng serve
```

Frontend sẽ chạy tại: `http://localhost:4200`

## 📚 Công nghệ sử dụng

### Frontend

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
