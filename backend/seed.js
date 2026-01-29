const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Cleared old data');

    // Tạo Admin
    const admin = await User.create({
      email: 'admin@chungmobile.com',
      password: 'admin123',
      name: 'Admin',
      phone: '0123456789',
      role: 'admin'
    });
    console.log('👤 Admin created:', admin.email);

    // Tạo User mẫu
    const user = await User.create({
      email: 'user@example.com',
      password: 'user123',
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      role: 'user'
    });
    console.log('👤 User created:', user.email);

    // Tạo sản phẩm mẫu (DANH SÁCH GỐC TỪ SCREENSHOT)
    const products = [
      {
        name: 'iPhone 11 Pro Max',
        brand: 'Apple',
        price: 11990000,
        originalPrice: 12890000,
        description: 'iPhone 11 Pro Max - Vẫn là siêu phẩm. 3 Camera đỉnh cao, pin trâu nhất lịch sử iPhone lúc ra mắt.',
        specs: { screen: '6.5 inch OLED', cpu: 'A13 Bionic', ram: '4GB', storage: '64GB', battery: '3969mAh', camera: '12MP + 12MP + 12MP', os: 'iOS 15' },
        stock: 50,
        isFeatured: true,
        colors: ['Vàng Gold', 'Xanh Midnight', 'Trắng', 'Đen']
      },
      {
        name: 'iPhone 12 Pro Max',
        brand: 'Apple',
        price: 15490000,
        originalPrice: 18190000,
        description: 'iPhone 12 Pro Max - Thiết kế vuông vức huyền thoại trở lại. 5G siêu tốc, màn hình lớn nhất.',
        specs: { screen: '6.7 inch OLED', cpu: 'A14 Bionic', ram: '6GB', storage: '128GB', battery: '3687mAh', camera: '12MP + 12MP + 12MP', os: 'iOS 16' },
        stock: 45,
        isFeatured: true,
        colors: ['Xanh Pacific', 'Vàng', 'Than Chì', 'Bạc']
      },
      {
        name: 'iPhone XS Max',
        brand: 'Apple',
        price: 8990000,
        originalPrice: 9890000,
        description: 'iPhone XS Max - Màn hình Super Retina lớn, thiết kế thép không gỉ sang trọng.',
        specs: { screen: '6.5 inch OLED', cpu: 'A12 Bionic', ram: '4GB', storage: '64GB', battery: '3174mAh', camera: '12MP + 12MP', os: 'iOS 15' },
        stock: 30,
        isFeatured: true,
        colors: ['Vàng', 'Xám Không Gian', 'Bạc']
      },
      {
        name: 'iPhone 8 Plus',
        brand: 'Apple',
        price: 4990000,
        originalPrice: 5500000,
        description: 'iPhone 8 Plus - Thiết kế mặt lưng kính, sạc không dây, nút Home quen thuộc.',
        specs: { screen: '5.5 inch LCD', cpu: 'A11 Bionic', ram: '3GB', storage: '64GB', battery: '2691mAh', camera: '12MP + 12MP', os: 'iOS 14' },
        stock: 20,
        colors: ['Vàng', 'Đỏ', 'Bạc', 'Xám']
      },
      {
        name: 'iPhone 7 Plus',
        brand: 'Apple',
        price: 3500000,
        description: 'iPhone 7 Plus - Camera kép xóa phông đầu tiên của Apple. Vẫn mượt mà cho tác vụ cơ bản.',
        specs: { screen: '5.5 inch LCD', cpu: 'A10 Fusion', ram: '3GB', storage: '32GB', battery: '2900mAh', camera: '12MP + 12MP', os: 'iOS 14' },
        stock: 15,
        colors: ['Đen Nhám', 'Vàng', 'Hồng']
      },
      {
        name: 'iPad Mini 6',
        brand: 'Apple',
        price: 11500000,
        description: 'iPad Mini 6 - Nhỏ gọn nhưng mạnh mẽ với chip A15 Bionic. Thiết kế toàn màn hình.',
        specs: { screen: '8.3 inch Liquid Retina', cpu: 'A15 Bionic', ram: '4GB', storage: '64GB', battery: '19.3 Wh', camera: '12MP', os: 'iPadOS 16' },
        category: 'Tablet',
        stock: 25,
        colors: ['Tím', 'Hồng', 'Xám', 'Trắng Sao']
      },
       {
        name: 'iPhone 15 Pro Max',
        brand: 'Apple',
        price: 34990000,
        description: 'iPhone 15 Pro Max - Titan bền bỉ, A17 Pro.',
        specs: { screen: '6.7 inch OLED', cpu: 'A17 Pro', ram: '8GB', storage: '256GB', battery: '4422mAh', camera: '48MP', os: 'iOS 17' },
        stock: 50,
        isFeatured: true,
        colors: ['Titan Tự Nhiên', 'Titan Xanh']
      },
       {
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        price: 33990000,
        description: 'Samsung Galaxy S24 Ultra - Quyền năng Galaxy AI.',
        specs: { screen: '6.8 inch AMOLED', cpu: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', battery: '5000mAh', camera: '200MP', os: 'Android 14' },
        stock: 40,
        isFeatured: true,
        colors: ['Xám Titan', 'Vàng Titan']
      }
      // Có thể thêm các sản phẩm khác nếu cần...
    ];

    // --- SMART IMAGE MAPPING (TỰ ĐỘNG GÁN ẢNH LOCAL) ---
    // Thay thế ảnh online bằng ảnh có sẵn trong uploads/products
    const uploadDir = path.join(__dirname, 'uploads/products');

    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir).filter(f => !f.startsWith('.'));
      
      if (files.length > 0) {
        console.log(`\n📂 Tìm thấy ${files.length} ảnh trong máy. Đang gán vào ${products.length} sản phẩm...`);
        
        let fileIdx = 0;
        
        // Duyệt qua từng sản phẩm gốc và gán ảnh local
        for (let i = 0; i < products.length; i++) {
            const currentImages = [];
            // Mỗi sản phẩm lấy ngẫu nhiên 2-4 ảnh
            const numImages = Math.floor(Math.random() * 3) + 2; 

            for (let j = 0; j < numImages; j++) {
                if (fileIdx < files.length) {
                    currentImages.push(`/uploads/products/${files[fileIdx]}`);
                    fileIdx++;
                } else {
                    // Nếu hết ảnh thì quay lại từ đầu (loop)
                    fileIdx = 0;
                    currentImages.push(`/uploads/products/${files[fileIdx]}`);
                    fileIdx++;
                }
            }

            products[i].images = currentImages;
            products[i].thumbnail = currentImages[0];
        }
        console.log(`✅ Đã gán ảnh local thành công.`);
      } else {
          console.log('⚠️ Không tìm thấy ảnh nào trong uploads/products. Sử dụng ảnh mặc định nếu có.');
      }
    }
    // -------------------------------------------------------------

    await Product.insertMany(products);
    console.log(`📱 Tổng cộng: ${products.length} sản phẩm đã được tạo.`);

    console.log('\n✅ Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
