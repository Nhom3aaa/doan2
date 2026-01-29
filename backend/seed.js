require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Product = require('./src/models/Product');

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

    // Tạo sản phẩm mẫu
    const products = [
      // iPhone 17 Series (New)
      {
        name: 'iPhone 17 Pro Max',
        brand: 'Apple',
        price: 36990000,
        originalPrice: 38990000,
        description: 'iPhone 17 Pro Max - Đỉnh cao công nghệ tương lai. Chip A19 Pro siêu mạnh, thiết kế Titanium thế hệ mới.',
        specs: { screen: '6.9 inch Super Retina XDR', cpu: 'A19 Pro', ram: '12GB', storage: '256GB', battery: '4800mAh', camera: '48MP + 48MP + 48MP', os: 'iOS 18' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-titan-tu-nhien-1-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-titan-tu-nhien-1-600x600.jpg',
        stock: 50,
        isFeatured: true,
        colors: ['Titan Desert', 'Titan Black', 'Titan White']
      },
      {
        name: 'iPhone 17',
        brand: 'Apple',
        price: 26990000,
        description: 'iPhone 17 - Cân bằng hoàn hảo. Chip A19, màn hình 120Hz ProMotion đầu tiên trên dòng thường.',
        specs: { screen: '6.3 inch Super Retina XDR', cpu: 'A19', ram: '8GB', storage: '128GB', battery: '3800mAh', camera: '48MP + 12MP', os: 'iOS 18' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-hong-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-xanh-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-hong-thumb-600x600.jpg',
        stock: 60,
        colors: ['Hồng', 'Xanh', 'Vàng', 'Đen']
      },

      {
        name: 'iPhone 14 Pro Max',
        brand: 'Apple',
        price: 27990000,
        originalPrice: 29990000,
        description: 'iPhone 14 Pro Max - Màn hình Dynamic Island đột phá, camera 48MP đẳng cấp.',
        specs: { screen: '6.7 inch Super Retina XDR', cpu: 'A16 Bionic', ram: '6GB', storage: '128GB', battery: '4323mAh', camera: '48MP + 12MP + 12MP', os: 'iOS 16' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/251192/iphone-14-pro-max-tim-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/251192/iphone-14-pro-max-den-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/251192/iphone-14-pro-max-vang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/251192/iphone-14-pro-max-bac-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/251192/iphone-14-pro-max-tim-thumb-600x600.jpg',
        stock: 50,
        isFeatured: true,
        colors: ['Tím', 'Đen', 'Vàng', 'Bạc']
      },

      // iPhone 15 Series
      {
        name: 'iPhone 15 Pro Max',
        brand: 'Apple',
        price: 34990000,
        originalPrice: 36990000,
        description: 'iPhone 15 Pro Max - Thiết kế Titan bền bỉ, chip A17 Pro game thủ, Camera 48MP zoom quang 5x.',
        specs: { screen: '6.7 inch Super Retina XDR', cpu: 'A17 Pro', ram: '8GB', storage: '256GB', battery: '4422mAh', camera: '48MP + 12MP + 12MP', os: 'iOS 17' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-titan-tu-nhien-1-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-den-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-trang-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-titan-tu-nhien-1-600x600.jpg',
        stock: 50,
        isFeatured: true,
        colors: ['Titan Tự Nhiên', 'Titan Xanh', 'Titan Đen', 'Titan Trắng']
      },
      {
        name: 'iPhone 15 Plus',
        brand: 'Apple',
        price: 25990000,
        description: 'iPhone 15 Plus - Màn hình lớn 6.7 inch, Dynamic Island, Pin siêu trâu cả ngày.',
        specs: { screen: '6.7 inch Super Retina XDR', cpu: 'A16 Bionic', ram: '6GB', storage: '128GB', battery: '4383mAh', camera: '48MP + 12MP', os: 'iOS 17' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-hong-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-vang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-xanh-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-hong-thumb-600x600.jpg',
        stock: 45,
        colors: ['Hồng', 'Vàng', 'Xanh Lá', 'Đen']
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        price: 33990000,
        originalPrice: 35990000,
        description: 'Samsung Galaxy S24 Ultra với bút S Pen, camera 200MP, Galaxy AI.',
        specs: { screen: '6.8 inch Dynamic AMOLED 2X', cpu: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', battery: '5000mAh', camera: '200MP + 12MP + 50MP + 10MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-vang-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-tim-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-den-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg',
        stock: 40,
        isFeatured: true,
        colors: ['Titan Gray', 'Titan Black', 'Titan Violet', 'Titan Yellow']
      },
      {
        name: 'Xiaomi 14 Ultra',
        brand: 'Xiaomi',
        price: 23990000,
        description: 'Xiaomi 14 Ultra với camera Leica, Snapdragon 8 Gen 3.',
        specs: { screen: '6.73 inch AMOLED', cpu: 'Snapdragon 8 Gen 3', ram: '16GB', storage: '512GB', battery: '5000mAh', camera: '50MP + 50MP + 50MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/313889/xiaomi-14-ultra-black-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/313889/xiaomi-14-ultra-black-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/313889/xiaomi-14-ultra-black-thumbnew-600x600.jpg',
        stock: 30,
        isFeatured: true,
        colors: ['Đen', 'Trắng']
      },
      {
        name: 'OPPO Find X7 Ultra',
        brand: 'OPPO',
        price: 22990000,
        description: 'OPPO Find X7 Ultra với camera kép periscope, Hasselblad.',
        specs: { screen: '6.82 inch AMOLED', cpu: 'Dimensity 9300', ram: '16GB', storage: '512GB', battery: '5000mAh', camera: '50MP + 50MP + 50MP + 50MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/318995/oppo-find-x7-ultra-nau-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/318995/oppo-find-x7-ultra-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/318995/oppo-find-x7-ultra-nau-thumb-600x600.jpg',
        stock: 25,
        colors: ['Ocean Blue', 'Sepia Brown']
      },
      {
        name: 'iPhone 14',
        brand: 'Apple',
        price: 16990000,
        description: 'iPhone 14 - Thiết kế bền bỉ, camera quay phim chế độ Action Mode siêu ổn định.',
        specs: { screen: '6.1 inch Super Retina XDR', cpu: 'A15 Bionic', ram: '6GB', storage: '128GB', battery: '3279mAh', camera: '12MP + 12MP', os: 'iOS 16' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/240259/iphone-14-tim-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/240259/iphone-14-xanh-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/240259/iphone-14-do-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/240259/iphone-14-trang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/240259/iphone-14-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/240259/iphone-14-tim-thumb-600x600.jpg',
        stock: 60,
        colors: ['Tím', 'Xanh dương', 'Đỏ', 'Trắng', 'Đen']
      },

      // iPad Series
      {
        name: 'iPad Pro M2 12.9 inch WiFi 5G',
        brand: 'Apple',
        price: 34990000,
        description: 'iPad Pro M2 - Hiệu năng đỉnh cao với chip M2, màn hình Mini-LED XDR chân thực.',
        specs: { screen: '12.9 inch Liquid Retina XDR', cpu: 'Apple M2', ram: '8GB', storage: '128GB', battery: '10758mAh', camera: '12MP + 10MP + LiDAR', os: 'iPadOS 16' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/52/296766/ipad-pro-m2-129-inch-wifi-xam-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/52/296766/ipad-pro-m2-129-inch-wifi-bac-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/52/296766/ipad-pro-m2-129-inch-wifi-xam-thumb-600x600.jpg',
        stock: 20,
        category: 'Tablet',
        isFeatured: true,
        colors: ['Xám Không Gian', 'Bạc']
      },
      {
        name: 'iPad Air 5 M1 WiFi',
        brand: 'Apple',
        price: 15490000,
        description: 'iPad Air 5 M1 - Sức mạnh chip M1 trong thiết kế mỏng nhẹ đầy màu sắc.',
        specs: { screen: '10.9 inch Liquid Retina', cpu: 'Apple M1', ram: '8GB', storage: '64GB', battery: '28.6 Wh', camera: '12MP', os: 'iPadOS 16' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/52/248096/ipad-air-5-wifi-xanh-duong-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/52/248096/ipad-air-5-wifi-tim-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/52/248096/ipad-air-5-wifi-xam-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/52/248096/ipad-air-5-wifi-hong-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/52/248096/ipad-air-5-wifi-trang-star-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/52/248096/ipad-air-5-wifi-xanh-duong-thumb-600x600.jpg',
        stock: 35,
        category: 'Tablet',
        colors: ['Xanh Dương', 'Tím', 'Xám', 'Hồng', 'Trắng']
      },
      {
        name: 'iPad Gen 10 WiFi',
        brand: 'Apple',
        price: 9990000,
        description: 'iPad Gen 10 - Thiết kế mới toàn diện, màn hình Liquid Retina 10.9 inch sắc nét.',
        specs: { screen: '10.9 inch Liquid Retina', cpu: 'A14 Bionic', ram: '4GB', storage: '64GB', battery: '28.6 Wh', camera: '12MP', os: 'iPadOS 16' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/52/296728/ipad-gen-10-wifi-vang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/52/296728/ipad-gen-10-wifi-xanh-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/52/296728/ipad-gen-10-wifi-hong-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/52/296728/ipad-gen-10-wifi-bac-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/52/296728/ipad-gen-10-wifi-vang-thumb-600x600.jpg',
        stock: 50,
        category: 'Tablet',
        colors: ['Vàng', 'Xanh dương', 'Hồng', 'Bạc']
      },
      {
        name: 'Samsung Galaxy A55 5G',
        brand: 'Samsung',
        price: 10490000,
        description: 'Samsung Galaxy A55 5G với thiết kế cao cấp, camera OIS 50MP.',
        specs: { screen: '6.6 inch Super AMOLED', cpu: 'Exynos 1480', ram: '8GB', storage: '128GB', battery: '5000mAh', camera: '50MP + 12MP + 5MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/322967/samsung-galaxy-a55-5g-xanh-thumb-1-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/322967/samsung-galaxy-a55-5g-tim-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/322967/samsung-galaxy-a55-5g-xanh-thumb-1-600x600.jpg',
        stock: 80,
        colors: ['Xanh Navy', 'Tím Lilac', 'Vàng Chanh', 'Xanh Đá']
      },
      {
        name: 'Xiaomi Redmi Note 13 Pro+',
        brand: 'Xiaomi',
        price: 8990000,
        description: 'Redmi Note 13 Pro+ với camera 200MP, sạc nhanh 120W.',
        specs: { screen: '6.67 inch AMOLED', cpu: 'Dimensity 7200 Ultra', ram: '8GB', storage: '256GB', battery: '5000mAh', camera: '200MP + 8MP + 2MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/309834/xiaomi-redmi-note-13-pro-plus-trang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/309834/xiaomi-redmi-note-13-pro-plus-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/309834/xiaomi-redmi-note-13-pro-plus-trang-thumb-600x600.jpg',
        stock: 100,
        colors: ['Đen', 'Trắng', 'Tím']
      },
      {
        name: 'OPPO Reno11 5G',
        brand: 'OPPO',
        price: 10990000,
        description: 'OPPO Reno11 5G với camera chân dung đẹp, thiết kế mỏng nhẹ.',
        specs: { screen: '6.7 inch AMOLED', cpu: 'Dimensity 7050', ram: '8GB', storage: '256GB', battery: '5000mAh', camera: '50MP + 32MP + 8MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/318182/oppo-reno11-xanh-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/318182/oppo-reno11-xam-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/318182/oppo-reno11-xanh-thumb-600x600.jpg',
        stock: 45,
        colors: ['Xám', 'Xanh']
      },

      {
        name: 'Vivo X100 Pro 5G',
        brand: 'Vivo',
        price: 24990000,
        description: 'Vivo X100 Pro đỉnh cao nhiếp ảnh ZEISS, chip Dimensity 9300 mạnh mẽ.',
        specs: { screen: '6.78 inch AMOLED', cpu: 'Dimensity 9300', ram: '16GB', storage: '512GB', battery: '5400mAh', camera: '50MP + 50MP + 50MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/319665/vivo-x100-pro-den-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/319665/vivo-x100-pro-trang-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/319665/vivo-x100-pro-den-thumbnew-600x600.jpg',
        stock: 20,
        colors: ['Đen Asteroid', 'Trắng Moonlight']
      },
      {
        name: 'Realme 12 Pro+ 5G',
        brand: 'Realme',
        price: 9490000,
        description: 'Realme 12 Pro+ thiết kế Rolex cao cấp, camera tele periscope chụp chân dung chuẩn điện ảnh.',
        specs: { screen: '6.7 inch AMOLED', cpu: 'Snapdragon 7s Gen 2', ram: '12GB', storage: '256GB', battery: '5000mAh', camera: '50MP + 64MP + 8MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/321557/realme-12-pro-plus-do-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/321557/realme-12-pro-plus-xanh-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/321557/realme-12-pro-plus-do-thumbnew-600x600.jpg',
        stock: 45,
        colors: ['Đỏ', 'Xanh']
      },
      {
        name: 'Vivo V30e',
        brand: 'Vivo',
        price: 9490000,
        description: 'Vivo V30e thiết kế hào quang, camera Sony IMX882, pin khủng 5500mAh.',
        specs: { screen: '6.78 inch AMOLED', cpu: 'Snapdragon 6 Gen 1', ram: '8GB', storage: '256GB', battery: '5500mAh', camera: '50MP + 8MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/321852/vivo-v30e-tim-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/321852/vivo-v30e-trang-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/321852/vivo-v30e-tim-thumbnew-600x600.jpg',
        stock: 50,
        colors: ['Tím', 'Trắng']
      },
      {
        name: 'Realme C65',
        brand: 'Realme',
        price: 4790000,
        description: 'Realme C65 thiết kế vân ánh sao, sạc nhanh 45W, đạt chứng nhận độ mượt 48 tháng.',
        specs: { screen: '6.67 inch IPS LCD', cpu: 'Helio G85', ram: '8GB', storage: '256GB', battery: '5000mAh', camera: '50MP + 2MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/322894/realme-c65-tim-thumb-1-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/322894/realme-c65-den-thumb-1-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/322894/realme-c65-tim-thumb-1-600x600.jpg',
        stock: 100,
        colors: ['Tím Tinh Vân', 'Đen Ngân Hà']
      },

      // --- SẢN PHẨM MỚI BỔ SUNG ---
      // Samsung
      {
        name: 'Samsung Galaxy A35 5G',
        brand: 'Samsung',
        price: 8290000,
        description: 'Galaxy A35 5G - Thiết kế Key Island độc đáo, lưng kính cao cấp, camera 50MP.',
        specs: { screen: '6.6 inch Super AMOLED', cpu: 'Exynos 1380', ram: '8GB', storage: '128GB', battery: '5000mAh', camera: '50MP + 8MP + 5MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/321851/samsung-galaxy-a35-5g-xanh-thumb-1-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/321851/samsung-galaxy-a35-5g-vang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/321851/samsung-galaxy-a35-5g-tim-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/321851/samsung-galaxy-a35-5g-xanh-thumb-1-600x600.jpg',
        stock: 65,
        colors: ['Xanh Ice', 'Vàng Lemon', 'Tím Lilac']
      },
      {
        name: 'Samsung Galaxy M55 5G',
        brand: 'Samsung',
        price: 9690000,
        description: 'Galaxy M55 5G - Pin mãnh thú, sạc nhanh 45W, chip Snapdragon 7 Gen 1.',
        specs: { screen: '6.7 inch Super AMOLED+', cpu: 'Snapdragon 7 Gen 1', ram: '8GB', storage: '256GB', battery: '5000mAh', camera: '50MP + 8MP + 2MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/318029/samsung-galaxy-m55-xanh-la-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/318029/samsung-galaxy-m55-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/318029/samsung-galaxy-m55-xanh-la-thumb-600x600.jpg',
        stock: 55,
        colors: ['Xanh Mint', 'Đen']
      },
      {
        name: 'Samsung Galaxy S23 FE 5G',
        brand: 'Samsung',
        price: 11890000,
        description: 'Galaxy S23 FE - Phiên bản Fan Edition, trải nghiệm flagship với mức giá tốt.',
        specs: { screen: '6.4 inch Dynamic AMOLED 2X', cpu: 'Exynos 2200', ram: '8GB', storage: '128GB', battery: '4500mAh', camera: '50MP + 12MP + 8MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/306994/samsung-galaxy-s23-fe-xanh-mint-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/306994/samsung-galaxy-s23-fe-tim-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/306994/samsung-galaxy-s23-fe-trang-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/306994/samsung-galaxy-s23-fe-xam-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/306994/samsung-galaxy-s23-fe-xanh-mint-thumbnew-600x600.jpg',
        stock: 40,
        colors: ['Xanh Mint', 'Tím', 'Kem', 'Xám']
      },

      // Xiaomi
      {
        name: 'Xiaomi 13T 5G',
        brand: 'Xiaomi',
        price: 11490000,
        description: 'Xiaomi 13T - Camera Leica chuyên nghiệp, màn hình CrystalRes 144Hz.',
        specs: { screen: '6.67 inch AMOLED', cpu: 'Dimensity 8200 Ultra', ram: '12GB', storage: '256GB', battery: '5000mAh', camera: '50MP + 50MP + 12MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/309816/xiaomi-13t-xanh-duong-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/309816/xiaomi-13t-xanh-la-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/309816/xiaomi-13t-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/309816/xiaomi-13t-xanh-duong-thumb-600x600.jpg',
        stock: 30,
        colors: ['Xanh Dương', 'Xanh Lá', 'Đen']
      },
      {
        name: 'Xiaomi Redmi Note 13 Pro (4G)',
        brand: 'Xiaomi',
        price: 6490000,
        description: 'Redmi Note 13 Pro - Camera 200MP OIS, sạc nhanh 67W.',
        specs: { screen: '6.67 inch AMOLED', cpu: 'Helio G99 Ultra', ram: '8GB', storage: '128GB', battery: '5000mAh', camera: '200MP + 8MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/321850/xiaomi-redmi-note-13-pro-xanh-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/321850/xiaomi-redmi-note-13-pro-tim-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/321850/xiaomi-redmi-note-13-pro-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/321850/xiaomi-redmi-note-13-pro-xanh-thumb-600x600.jpg',
        stock: 70,
        colors: ['Xanh', 'Tím', 'Đen']
      },
      {
        name: 'POCO X6 Pro 5G',
        brand: 'Xiaomi',
        price: 8490000,
        description: 'POCO X6 Pro - Hiệu năng vô đối với Dimensity 8300 Ultra, chuyên game.',
        specs: { screen: '6.67 inch AMOLED', cpu: 'Dimensity 8300 Ultra', ram: '8GB', storage: '256GB', battery: '5000mAh', camera: '64MP + 8MP + 2MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/319910/poco-x6-pro-xam-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/319910/poco-x6-pro-vang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/319910/poco-x6-pro-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/319910/poco-x6-pro-vang-thumb-600x600.jpg',
        stock: 45,
        colors: ['Xám', 'Vàng', 'Đen']
      },

      // OPPO
      {
        name: 'OPPO A79 5G',
        brand: 'OPPO',
        price: 7490000,
        description: 'OPPO A79 5G - Thiết kế lông vũ độc đáo, màn hình lớn 90Hz.',
        specs: { screen: '6.72 inch LTPS LCD', cpu: 'Dimensity 6020', ram: '8GB', storage: '256GB', battery: '5000mAh', camera: '50MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/316239/oppo-a79-5g-tim-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/316239/oppo-a79-5g-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/316239/oppo-a79-5g-tim-thumb-600x600.jpg',
        stock: 50,
        colors: ['Tím', 'Đen']
      },
      {
        name: 'OPPO A18',
        brand: 'OPPO',
        price: 3290000,
        description: 'OPPO A18 - Thiết kế OPPO Glow, pin lớn 5000mAh.',
        specs: { screen: '6.56 inch IPS LCD', cpu: 'Helio G85', ram: '4GB', storage: '128GB', battery: '5000mAh', camera: '8MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/314187/oppo-a18-xanh-thumb-1-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/314187/oppo-a18-den-thumb-1-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/314187/oppo-a18-xanh-thumb-1-600x600.jpg',
        stock: 100,
        colors: ['Xanh', 'Đen']
      },

      // Vivo
      {
        name: 'Vivo Y36',
        brand: 'Vivo',
        price: 5290000,
        description: 'Vivo Y36 - Thiết kế mặt lưng kính, sạc siêu tốc 44W.',
        specs: { screen: '6.64 inch IPS LCD', cpu: 'Snapdragon 680', ram: '8GB', storage: '128GB', battery: '5000mAh', camera: '50MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/306783/vivo-y36-xanh-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/306783/vivo-y36-den-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/306783/vivo-y36-xanh-thumbnew-600x600.jpg',
        stock: 60,
        colors: ['Xanh Sóng Biển', 'Đen Sao Băng']
      },
      {
        name: 'Vivo Y03',
        brand: 'Vivo',
        price: 2990000,
        description: 'Vivo Y03 - Giá rẻ, thiết kế thời trang, kháng nước IP54.',
        specs: { screen: '6.56 inch IPS LCD', cpu: 'Helio G85', ram: '4GB', storage: '64GB', battery: '5000mAh', camera: '13MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/322896/vivo-y03-xanh-thumb-1-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/322896/vivo-y03-den-thumb-1-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/322896/vivo-y03-xanh-thumb-1-600x600.jpg',
        stock: 80,
        colors: ['Xanh', 'Đen']
      },

      // Realme
      {
        name: 'Realme C53',
        brand: 'Realme',
        price: 3790000,
        description: 'Realme C53 - Sạc 33W, camera 50MP, thiết kế ánh kim.',
        specs: { screen: '6.74 inch IPS LCD', cpu: 'Unisoc Tiger T612', ram: '6GB', storage: '128GB', battery: '5000mAh', camera: '50MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/306785/realme-c53-gold-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/306785/realme-c53-black-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/306785/realme-c53-gold-thumb-600x600.jpg',
        stock: 75,
        colors: ['Vàng', 'Đen']
      },
      {
        name: 'Realme 11 Pro 5G',
        brand: 'Realme',
        price: 8490000,
        description: 'Realme 11 Pro - Thiết kế da sinh học, màn hình cong 120Hz.',
        specs: { screen: '6.7 inch AMOLED', cpu: 'Dimensity 7050', ram: '8GB', storage: '256GB', battery: '5000mAh', camera: '100MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/306787/realme-11-pro-trang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/306787/realme-11-pro-xanh-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/306787/realme-11-pro-trang-thumb-600x600.jpg',
        stock: 30,
        colors: ['Trắng', 'Xanh']
      },
      {
        name: 'Samsung Galaxy Z Fold6',
        brand: 'Samsung',
        price: 41990000,
        description: 'Galaxy Z Fold6 - Quyền năng AI, Gập mở bứt phá.',
        specs: { screen: '7.6 inch Dynamic AMOLED 2X', cpu: 'Snapdragon 8 Gen 3 for Galaxy', ram: '12GB', storage: '256GB', battery: '4400mAh', camera: '50MP + 12MP + 10MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/320721/Slider/vi-vn-samsung-galaxy-z-fold6-5g-1.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/320721/Slider/vi-vn-samsung-galaxy-z-fold6-5g-1.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/320721/Slider/vi-vn-samsung-galaxy-z-fold6-5g-1.jpg',
        stock: 15,
        isFeatured: true,
        colors: ['Xám Metal', 'Hồng', 'Xanh Navy']
      },
      {
        name: 'Samsung Galaxy Z Flip6',
        brand: 'Samsung',
        price: 26990000,
        description: 'Galaxy Z Flip6 - Biểu tượng thời trang, Camera 50MP.',
        specs: { screen: '6.7 inch Dynamic AMOLED 2X', cpu: 'Snapdragon 8 Gen 3 for Galaxy', ram: '12GB', storage: '256GB', battery: '4000mAh', camera: '50MP + 12MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/320722/Slider/vi-vn-samsung-galaxy-z-flip6-1.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/320722/Slider/vi-vn-samsung-galaxy-z-flip6-1.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/320722/Slider/vi-vn-samsung-galaxy-z-flip6-1.jpg',
        stock: 20,
        isFeatured: true,
        colors: ['Xanh Maya', 'Vàng Solar', 'Xanh Mint']
      },

      // --- SẢN PHẨM MỚI PHASE 2 (Pixel, Gaming Phone) ---
      // Google Pixel
      {
        name: 'Google Pixel 8 Pro',
        brand: 'Google',
        price: 22990000,
        description: 'Google Pixel 8 Pro - Nhiếp ảnh AI đỉnh cao, màn hình Super Actua sáng nhất.',
        specs: { screen: '6.7 inch LTPO OLED', cpu: 'Google Tensor G3', ram: '12GB', storage: '128GB', battery: '5050mAh', camera: '50MP + 48MP + 48MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/313885/google-pixel-8-pro-obsidian-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/313885/google-pixel-8-pro-porcelain-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/313885/google-pixel-8-pro-bay-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/313885/google-pixel-8-pro-bay-thumb-600x600.jpg',
        stock: 30,
        category: 'Phone',
        colors: ['Xanh Bay', 'Đen Obsidian', 'Trắng Porcelain']
      },
      {
        name: 'Google Pixel 7a',
        brand: 'Google',
        price: 10990000,
        description: 'Google Pixel 7a - Nhỏ gọn, camera xuất sắc trong tầm giá, chip Tensor G2.',
        specs: { screen: '6.1 inch OLED', cpu: 'Google Tensor G2', ram: '8GB', storage: '128GB', battery: '4385mAh', camera: '64MP + 13MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/306983/google-pixel-7a-sea-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/306983/google-pixel-7a-charcoal-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/306983/google-pixel-7a-sea-thumb-600x600.jpg',
        stock: 40,
        category: 'Phone',
        colors: ['Xanh Biển', 'Đen Than', 'Trắng Tuyết']
      },

      // Gaming Phone
      {
        name: 'ASUS ROG Phone 8 Pro',
        brand: 'ASUS',
        price: 29990000,
        description: 'ROG Phone 8 Pro - Quái vật Gaming, màn hình AniMe Vision độc đáo, Snapdragon 8 Gen 3.',
        specs: { screen: '6.78 inch AMOLED 165Hz', cpu: 'Snapdragon 8 Gen 3', ram: '16GB', storage: '512GB', battery: '5500mAh', camera: '50MP + 32MP + 13MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/320962/asus-rog-phone-8-pro-black-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/320962/asus-rog-phone-8-pro-black-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/320962/asus-rog-phone-8-pro-black-thumb-600x600.jpg',
        stock: 15,
        category: 'Phone',
        isFeatured: true,
        colors: ['Đen Phantom']
      },
      {
        name: 'Nubia Red Magic 9 Pro',
        brand: 'Nubia',
        price: 19990000,
        description: 'Red Magic 9 Pro - Thiết kế phẳng hoàn toàn, quạt tản nhiệt RGB tích hợp.',
        specs: { screen: '6.8 inch AMOLED 120Hz', cpu: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', battery: '6500mAh', camera: '50MP + 50MP + 2MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/319662/nubia-red-magic-9-pro-black-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/319662/nubia-red-magic-9-pro-silver-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/319662/nubia-red-magic-9-pro-silver-thumb-600x600.jpg',
        stock: 20,
        category: 'Phone',
        colors: ['Bạc Cyclone', 'Đen Sleet']
      },

      // Samsung Giá Rẻ
      {
        name: 'Samsung Galaxy A15',
        brand: 'Samsung',
        price: 4990000,
        description: 'Galaxy A15 - Màn hình Super AMOLED 90Hz rực rỡ, thiết kế Key Island.',
        specs: { screen: '6.5 inch Super AMOLED', cpu: 'Helio G99', ram: '8GB', storage: '128GB', battery: '5000mAh', camera: '50MP + 5MP + 2MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/319584/samsung-galaxy-a15-vang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/319584/samsung-galaxy-a15-xanh-duong-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/319584/samsung-galaxy-a15-vang-thumb-600x600.jpg',
        stock: 100,
        category: 'Phone',
        colors: ['Vàng', 'Xanh Dương', 'Xanh Đen']
      },
      {
        name: 'Samsung Galaxy A25 5G',
        brand: 'Samsung',
        price: 6590000,
        description: 'Galaxy A25 5G - Trải nghiệm 5G tốc độ cao, camera OIS chống rung.',
        specs: { screen: '6.5 inch Super AMOLED 120Hz', cpu: 'Exynos 1280', ram: '6GB', storage: '128GB', battery: '5000mAh', camera: '50MP + 8MP + 2MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/319586/samsung-galaxy-a25-5g-vang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/319586/samsung-galaxy-a25-5g-xanh-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/319586/samsung-galaxy-a25-5g-vang-thumb-600x600.jpg',
        stock: 80,
        category: 'Phone',
        colors: ['Vàng', 'Xanh Dương', 'Đen']
      },

      // Xiaomi & OPPO Bổ Sung
      {
        name: 'Xiaomi 14 5G',
        brand: 'Xiaomi',
        price: 19990000,
        description: 'Xiaomi 14 - Kích thước nhỏ gọn, sức mạnh vô song với ống kính Leica Summilux.',
        specs: { screen: '6.36 inch AMOLED 120Hz', cpu: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', battery: '4610mAh', camera: '50MP + 50MP + 50MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/317688/xiaomi-14-trang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/317688/xiaomi-14-den-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/317688/xiaomi-14-xanh-la-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/317688/xiaomi-14-trang-thumb-600x600.jpg',
        stock: 25,
        category: 'Phone',
        isFeatured: true,
        colors: ['Trắng', 'Đen', 'Xanh Ngọc Bích']
      },
      {
        name: 'OPPO Reno10 5G',
        brand: 'OPPO',
        price: 9990000,
        description: 'OPPO Reno10 5G - Chuyên gia chân dung với camera tele 32MP.',
        specs: { screen: '6.7 inch AMOLED 120Hz', cpu: 'Dimensity 7050', ram: '8GB', storage: '128GB', battery: '5000mAh', camera: '64MP + 32MP + 8MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/306981/oppo-reno10-xanh-duong-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/306981/oppo-reno10-xam-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/306981/oppo-reno10-xanh-duong-thumbnew-600x600.jpg',
        stock: 45,
        category: 'Phone',
        colors: ['Xanh Băng Tuyết', 'Xám Ánh Trăng']
      },

      // iPhone cũ (giá tốt)
      {
        name: 'iPhone 13',
        brand: 'Apple',
        price: 13990000,
        description: 'iPhone 13 - Chip A15 Bionic mạnh mẽ, camera kép tiên tiến.',
        specs: { screen: '6.1 inch Super Retina XDR', cpu: 'Apple A15 Bionic', ram: '4GB', storage: '128GB', battery: '3240mAh', camera: '12MP + 12MP', os: 'iOS 15' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/250258/iphone-13-xanh-thumb-new-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/250258/iphone-13-hong-thumb-new-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/250258/iphone-13-trang-thumb-new-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/250258/iphone-13-den-thumb-new-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/250258/iphone-13-xanh-thumb-new-600x600.jpg',
        stock: 50,
        colors: ['Xanh lá', 'Hồng', 'Trắng', 'Đen']
      },
      {
        name: 'iPhone 11',
        brand: 'Apple',
        price: 8990000,
        description: 'iPhone 11 - Thiết kế đầy màu sắc, camera góc siêu rộng.',
        specs: { screen: '6.1 inch Liquid Retina', cpu: 'Apple A13 Bionic', ram: '4GB', storage: '64GB', battery: '3110mAh', camera: '12MP + 12MP', os: 'iOS 15' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/153856/iphone-11-trang-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/153856/iphone-11-den-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/153856/iphone-11-trang-600x600.jpg',
        stock: 30,
        colors: ['Trắng', 'Đen']
      },
      {
        name: 'iPhone 8 Plus',
        brand: 'Apple',
        price: 4990000,
        description: 'iPhone 8 Plus - Thiết kế cổ điển với nút Home, camera kép.',
        specs: { screen: '5.5 inch Retina IPS', cpu: 'Apple A11 Bionic', ram: '3GB', storage: '64GB', battery: '2691mAh', camera: '12MP + 12MP', os: 'iOS 11' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/114110/iphone-8-plus-hh-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/114110/iphone-8-plus-gold-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/114110/iphone-8-plus-silver-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/114110/iphone-8-plus-hh-600x600.jpg',
        stock: 15,
        colors: ['Vàng', 'Bạc', 'Xám', 'Đỏ']
      },
      {
        name: 'Xiaomi Redmi Note 13',
        brand: 'Xiaomi',
        price: 4890000,
        description: 'Redmi Note 13 - Camera 108MP siêu nét, màn hình AMOLED 120Hz.',
        specs: { screen: '6.67 inch AMOLED', cpu: 'Snapdragon 685', ram: '6GB', storage: '128GB', battery: '5000mAh', camera: '108MP + 8MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/309831/xiaomi-redmi-note-13-vang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/309831/xiaomi-redmi-note-13-xanh-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/309831/xiaomi-redmi-note-13-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/309831/xiaomi-redmi-note-13-vang-thumb-600x600.jpg',
        stock: 100,
        colors: ['Vàng', 'Đen', 'Xanh']
      },
      {
        name: 'OPPO A60',
        brand: 'OPPO',
        price: 5490000,
        description: 'OPPO A60 - Siêu bền chuẩn quân đội, sạc nhanh 45W.',
        specs: { screen: '6.67 inch IPS LCD', cpu: 'Snapdragon 680', ram: '8GB', storage: '128GB', battery: '5000mAh', camera: '50MP + 2MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/321772/oppo-a60-xanh-thumb-1-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/321772/oppo-a60-den-thumb-1-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/321772/oppo-a60-xanh-thumb-1-600x600.jpg',
        stock: 60,
        colors: ['Xanh', 'Đen']
      },
      {
        name: 'Vivo Y100',
        brand: 'Vivo',
        price: 7290000,
        description: 'Vivo Y100 - Thiết kế mặt lưng da, sạc siêu nhanh 80W.',
        specs: { screen: '6.67 inch AMOLED', cpu: 'Snapdragon 685', ram: '8GB', storage: '128GB', battery: '5000mAh', camera: '50MP + 2MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/321522/vivo-y100-xanh-thumb-1-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/321522/vivo-y100-tim-thumb-1-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/321522/vivo-y100-xanh-thumb-1-600x600.jpg',
        stock: 40,
        colors: ['Xanh', 'Tím']
      },
      {
        name: 'Realme C60',
        brand: 'Realme',
        price: 2690000,
        description: 'Realme Note 50 - Giá rẻ, màn hình lớn 90Hz.',
        specs: { screen: '6.74 inch IPS LCD', cpu: 'Unisoc Tiger T612', ram: '4GB', storage: '64GB', battery: '5000mAh', camera: '13MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/320492/realme-note-50-xanh-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/320492/realme-note-50-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/320492/realme-note-50-xanh-thumb-600x600.jpg',
        stock: 80,
        colors: ['Xanh', 'Đen']
      },

      // --- SẢN PHẨM MỚI (User Request) ---
      {
        name: 'Sony Xperia 1 V',
        brand: 'Sony',
        price: 29990000,
        description: 'Sony Xperia 1 V - Cảm biến Exmor T mới, màn hình 4K OLED tỉ lệ 21:9 chuẩn điện ảnh.',
        specs: { screen: '6.5 inch 4K OLED', cpu: 'Snapdragon 8 Gen 2', ram: '12GB', storage: '256GB', battery: '5000mAh', camera: '48MP + 12MP + 12MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/303362/sony-xperia-1-v-den-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/303362/sony-xperia-1-v-xanh-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/303362/sony-xperia-1-v-den-thumb-600x600.jpg',
        stock: 10,
        colors: ['Đen', 'Xanh Khaki']
      },
      {
        name: 'Huawei Pura 70 Ultra',
        brand: 'Huawei',
        price: 31990000,
        description: 'Huawei Pura 70 Ultra - Camera thò thụt độc đáo, cảm biến 1 inch, thiết kế thời trang.',
        specs: { screen: '6.8 inch LTPO OLED', cpu: 'Kirin 9010', ram: '16GB', storage: '512GB', battery: '5200mAh', camera: '50MP + 50MP + 40MP', os: 'HarmonyOS 4.2' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/324169/huawei-pura-70-ultra-brown-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/324169/huawei-pura-70-ultra-green-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/324169/huawei-pura-70-ultra-brown-thumb-600x600.jpg',
        stock: 15,
        colors: ['Nâu', 'Xanh']
      },
      {
        name: 'Tecno Pova 6 Pro',
        brand: 'Tecno',
        price: 5990000,
        description: 'Tecno Pova 6 Pro - Thiết kế Mecha Gaming, pin 6000mAh, sạc nhanh 70W.',
        specs: { screen: '6.78 inch AMOLED 120Hz', cpu: 'Dimensity 6080', ram: '12GB', storage: '256GB', battery: '6000mAh', camera: '108MP + 2MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/322895/tecno-pova-6-pro-xanh-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/322895/tecno-pova-6-pro-xam-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/322895/tecno-pova-6-pro-xanh-thumb-600x600.jpg',
        stock: 50,
        colors: ['Xanh Sao chổi', 'Xám Meteor']
      },
      {
        name: 'Infinix GT 20 Pro',
        brand: 'Infinix',
        price: 8490000,
        description: 'Infinix GT 20 Pro - Gaming Phone giá mềm, đèn LED RGB mặt lưng, Dimensity 8200.',
        specs: { screen: '6.78 inch AMOLED 144Hz', cpu: 'Dimensity 8200 Ultimate', ram: '12GB', storage: '256GB', battery: '5000mAh', camera: '108MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/325208/infinix-gt-20-pro-blue-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/325208/infinix-gt-20-pro-orange-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/325208/infinix-gt-20-pro-blue-thumb-600x600.jpg',
        stock: 30,
        colors: ['Xanh Mecha', 'Cam Mecha']
      },
      {
        name: 'POCO F6',
        brand: 'Xiaomi',
        price: 9990000,
        description: 'POCO F6 - Sát thủ hiệu năng mới, chip Snapdragon 8s Gen 3.',
        specs: { screen: '6.67 inch AMOLED 120Hz', cpu: 'Snapdragon 8s Gen 3', ram: '12GB', storage: '512GB', battery: '5000mAh', camera: '50MP + 8MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/325251/poco-f6-black-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/325251/poco-f6-green-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/325251/poco-f6-green-thumb-600x600.jpg',
        stock: 40,
        colors: ['Đen', 'Xanh']
      },
      {
        name: 'iPhone 12',
        brand: 'Apple',
        price: 11990000,
        description: 'iPhone 12 - Thiết kế vuông vức trở lại, màn hình OLED Super Retina XDR.',
        specs: { screen: '6.1 inch OLED', cpu: 'Apple A14 Bionic', ram: '4GB', storage: '64GB', battery: '2815mAh', camera: '12MP + 12MP', os: 'iOS 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-xanh-la-thumb-new-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-tim-thumb-new-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-trang-thumb-new-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-tim-thumb-new-600x600.jpg',
        stock: 40,
        colors: ['Tím', 'Xanh lá', 'Trắng']
      },
      {
        name: 'iPad Mini 6 WiFi',
        brand: 'Apple',
        price: 11990000,
        description: 'iPad Mini 6 - Nhỏ gọn nhưng mạnh mẽ với chip A15 Bionic.',
        specs: { screen: '8.3 inch Liquid Retina', cpu: 'Apple A15 Bionic', ram: '4GB', storage: '64GB', battery: '19.3 Wh', camera: '12MP', os: 'iPadOS 15' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/52/247517/ipad-mini-6-wifi-purple-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/52/247517/ipad-mini-6-wifi-starlight-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/52/247517/ipad-mini-6-wifi-purple-thumb-600x600.jpg',
        stock: 25,
        category: 'Tablet',
        colors: ['Tím', 'Vàng ánh sao', 'Xám', 'Hồng']
      },
      {
        name: 'Xiaomi Redmi A3',
        brand: 'Xiaomi',
        price: 2490000,
        description: 'Redmi A3 - Thiết kế giả da sang trọng, màn hình 90Hz, pin trâu.',
        specs: { screen: '6.71 inch IPS LCD', cpu: 'Helio G36', ram: '4GB', storage: '128GB', battery: '5000mAh', camera: '8MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/322096/xiaomi-redmi-a3-xanh-la-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/322096/xiaomi-redmi-a3-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/322096/xiaomi-redmi-a3-xanh-la-thumb-600x600.jpg',
        stock: 100,
        colors: ['Xanh Lá', 'Đen']
      },

      // --- SẢN PHẨM MỚI BỔ SUNG ĐỢT 2 (User Request) ---
      // Samsung
      {
        name: 'Samsung Galaxy S23 5G',
        brand: 'Samsung',
        price: 13990000,
        description: 'Galaxy S23 5G - Nhỏ gọn, mạnh mẽ, camera chụp đêm siêu đỉnh.',
        specs: { screen: '6.1 inch Dynamic AMOLED 2X', cpu: 'Snapdragon 8 Gen 2 for Galaxy', ram: '8GB', storage: '128GB', battery: '3900mAh', camera: '50MP + 12MP + 10MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/264060/samsung-galaxy-s23-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/264060/samsung-galaxy-s23-xanh-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/264060/samsung-galaxy-s23-600x600.jpg',
        stock: 30,
        colors: ['Kem', 'Xanh Botanic', 'Tím Lilac', 'Đen']
      },
      {
        name: 'Samsung Galaxy A05s',
        brand: 'Samsung',
        price: 3590000,
        description: 'Galaxy A05s - Màn hình lớn 6.7 inch, chip Snapdragon 680 ổn định.',
        specs: { screen: '6.7 inch PLS LCD', cpu: 'Snapdragon 680', ram: '4GB', storage: '128GB', battery: '5000mAh', camera: '50MP + 2MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/317530/samsung-galaxy-a05s-xanh-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/317530/samsung-galaxy-a05s-bac-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/317530/samsung-galaxy-a05s-xanh-thumb-600x600.jpg',
        stock: 100,
        colors: ['Xanh Matcha', 'Bạc Xỉu', 'Đen']
      },
      {
        name: 'Samsung Galaxy S22 Ultra 5G',
        brand: 'Samsung',
        price: 17990000,
        description: 'S22 Ultra - Kế thừa di sản Note, tích hợp bút S Pen, Camera mắt thần bóng đêm.',
        specs: { screen: '6.8 inch Dynamic AMOLED 2X', cpu: 'Snapdragon 8 Gen 1', ram: '8GB', storage: '128GB', battery: '5000mAh', camera: '108MP + 12MP + 10MP + 10MP', os: 'Android 12' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/235838/samsung-galaxy-s22-ultra-do-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/235838/samsung-galaxy-s22-ultra-xanh-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/235838/samsung-galaxy-s22-ultra-do-thumbnew-600x600.jpg',
        stock: 20,
        colors: ['Đỏ Burgundy', 'Xanh Zeta', 'Trắng', 'Đen']
      },

      // Xiaomi
      {
        name: 'Xiaomi Redmi 13C',
        brand: 'Xiaomi',
        price: 3090000,
        description: 'Redmi 13C - Màn hình lớn 6.74 inch 90Hz, thiết kế mặt lưng kính.',
        specs: { screen: '6.74 inch IPS LCD', cpu: 'Helio G85', ram: '6GB', storage: '128GB', battery: '5000mAh', camera: '50MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/316568/xiaomi-redmi-13c-blue-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/316568/xiaomi-redmi-13c-green-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/316568/xiaomi-redmi-13c-blue-thumb-600x600.jpg',
        stock: 80,
        colors: ['Xanh Dương', 'Xanh Lá', 'Đen']
      },
      {
        name: 'Xiaomi 13 Lite 5G',
        brand: 'Xiaomi',
        price: 8990000,
        description: 'Xiaomi 13 Lite - Siêu mỏng nhẹ, selfie kép, thiết kế sang trọng.',
        specs: { screen: '6.55 inch AMOLED 120Hz', cpu: 'Snapdragon 7 Gen 1', ram: '8GB', storage: '128GB', battery: '4500mAh', camera: '50MP + 8MP + 2MP', os: 'Android 12' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/302672/xiaomi-13-lite-hong-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/302672/xiaomi-13-lite-xanh-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/302672/xiaomi-13-lite-hong-thumb-600x600.jpg',
        stock: 40,
        colors: ['Hồng', 'Xanh', 'Đen']
      },

      // OPPO
      {
        name: 'OPPO Reno8 T 5G',
        brand: 'OPPO',
        price: 8490000,
        description: 'Reno8 T 5G - Màn hình cong tràn viền 120Hz, Camera chân dung 108MP.',
        specs: { screen: '6.7 inch AMOLED', cpu: 'Snapdragon 695 5G', ram: '8GB', storage: '256GB', battery: '4800mAh', camera: '108MP + 2MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/301642/oppo-reno8-t-5g-vang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/301642/oppo-reno8-t-5g-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/301642/oppo-reno8-t-5g-vang-thumb-600x600.jpg',
        stock: 35,
        colors: ['Vàng Ánh Kim', 'Đen Ánh Sao']
      },
      {
        name: 'OPPO A38',
        brand: 'OPPO',
        price: 4490000,
        description: 'OPPO A38 - Sạc siêu nhanh SuperVOOC 33W, camera AI 50MP.',
        specs: { screen: '6.56 inch IPS LCD', cpu: 'Helio G85', ram: '6GB', storage: '128GB', battery: '5000mAh', camera: '50MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/309832/oppo-a38-vang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/309832/oppo-a38-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/309832/oppo-a38-vang-thumb-600x600.jpg',
        stock: 60,
        colors: ['Vàng', 'Đen']
      },

      // Vivo
      {
        name: 'Vivo V29e 5G',
        brand: 'Vivo',
        price: 8990000,
        description: 'Vivo V29e 5G - Vòng sáng Aura 2.0, Camera biến hình, thiết kế tinh xảo.',
        specs: { screen: '6.67 inch AMOLED 120Hz', cpu: 'Snapdragon 695', ram: '8GB', storage: '256GB', battery: '4800mAh', camera: '64MP + 8MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/314856/vivo-v29e-blue-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/314856/vivo-v29e-black-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/314856/vivo-v29e-blue-thumb-600x600.jpg',
        stock: 30,
        colors: ['Xanh Sông Băng', 'Đen Đại Ngàn']
      },
      {
        name: 'Vivo Y17s',
        brand: 'Vivo',
        price: 3990000,
        description: 'Vivo Y17s - Camera 50MP, RAM mở rộng, thiết kế thời thượng.',
        specs: { screen: '6.56 inch IPS LCD', cpu: 'Helio G85', ram: '4GB', storage: '128GB', battery: '5000mAh', camera: '50MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/316089/vivo-y17s-tim-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/316089/vivo-y17s-xanh-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/316089/vivo-y17s-tim-thumb-600x600.jpg',
        stock: 50,
        colors: ['Tím Sao Băng', 'Xanh Rừng Sâu']
      },

      // Apple (Cũ/Giá rẻ)
      {
        name: 'iPhone 11 Pro Max',
        brand: 'Apple',
        price: 11990000,
        description: 'iPhone 11 Pro Max - Cụm 3 camera "bếp từ" huyền thoại, pin trâu nhất một thời.',
        specs: { screen: '6.5 inch OLED', cpu: 'Apple A13 Bionic', ram: '4GB', storage: '64GB', battery: '3969mAh', camera: '12MP + 12MP + 12MP', os: 'iOS 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/210654/iphone-11-pro-max-xanh-la-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/210654/iphone-11-pro-max-gold-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/210654/iphone-11-pro-max-xanh-la-600x600.jpg',
        stock: 15,
        colors: ['Xanh Bóng Đêm', 'Vàng', 'Xám', 'Bạc']
      },
      {
        name: 'iPhone XS Max',
        brand: 'Apple',
        price: 8990000,
        description: 'iPhone XS Max - Màn hình lớn 6.5 inch OLED, thiết kế thép không gỉ sang trọng.',
        specs: { screen: '6.5 inch OLED', cpu: 'Apple A12 Bionic', ram: '4GB', storage: '64GB', battery: '3174mAh', camera: '12MP + 12MP', os: 'iOS 12' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/190322/iphone-xs-max-gold-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/190322/iphone-xs-max-gray-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/190322/iphone-xs-max-gold-600x600.jpg',
        stock: 20,
        colors: ['Vàng', 'Xám', 'Bạc']
      },

      // Realme
      {
        name: 'Realme C55',
        brand: 'Realme',
        price: 4990000,
        description: 'Realme C55 - Mini Capsule độc đáo, camera 64MP.',
        specs: { screen: '6.72 inch IPS LCD', cpu: 'Helio G88', ram: '6GB', storage: '128GB', battery: '5000mAh', camera: '64MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/305655/realme-c55-vang-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/305655/realme-c55-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/305655/realme-c55-vang-thumb-600x600.jpg',
        stock: 60,
        colors: ['Vàng Nắng Mai', 'Đen Trời Đêm']
      },
      {
        name: 'Realme C51',
        brand: 'Realme',
        price: 3690000,
        description: 'Realme C51 - Sạc nhanh 33W, thiết kế mỏng nhẹ.',
        specs: { screen: '6.74 inch IPS LCD', cpu: 'Unisoc Tiger T612', ram: '4GB', storage: '128GB', battery: '5000mAh', camera: '50MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/313333/realme-c51-xanh-ngoc-thumbnew-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/313333/realme-c51-den-thumbnew-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/313333/realme-c51-xanh-ngoc-thumbnew-600x600.jpg',
        stock: 75,
        colors: ['Xanh Ngọc', 'Đen']
      },

      // --- SẢN PHẨM MỚI BỔ SUNG ĐỢT 3 (User Request Further) ---
      // Sony
      {
        name: 'Sony Xperia 5 V',
        brand: 'Sony',
        price: 22990000,
        description: 'Sony Xperia 5 V - Nhỏ gọn, mạnh mẽ, cảm biến Exmor T thế hệ mới.',
        specs: { screen: '6.1 inch OLED 120Hz', cpu: 'Snapdragon 8 Gen 2', ram: '8GB', storage: '128GB', battery: '5000mAh', camera: '48MP + 12MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/306981/sony-xperia-5-v-den-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/306981/sony-xperia-5-v-bac-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/306981/sony-xperia-5-v-den-thumb-600x600.jpg',
        stock: 15,
        colors: ['Đen', 'Bạc Platinum', 'Xanh']
      },
      {
        name: 'Sony Xperia 10 VI',
        brand: 'Sony',
        price: 11990000,
        description: 'Sony Xperia 10 VI - Pin siêu bền bỉ 2 ngày, nhẹ nhất thế giới trong dòng pin 5000mAh.',
        specs: { screen: '6.1 inch OLED', cpu: 'Snapdragon 6 Gen 1', ram: '8GB', storage: '128GB', battery: '5000mAh', camera: '48MP + 8MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/322896/sony-xperia-10-vi-blue-thumb-600x600.jpg', // Placeholder image
          'https://cdn.tgdd.vn/Products/Images/42/322896/sony-xperia-10-vi-black-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/322896/sony-xperia-10-vi-blue-thumb-600x600.jpg',
        stock: 20,
        colors: ['Xanh', 'Đen', 'Trắng']
      },

      // Google Pixel
      {
        name: 'Google Pixel 8',
        brand: 'Google',
        price: 15990000,
        description: 'Google Pixel 8 - Thông minh hơn, mạnh mẽ hơn với Google AI.',
        specs: { screen: '6.2 inch Actua OLED', cpu: 'Google Tensor G3', ram: '8GB', storage: '128GB', battery: '4575mAh', camera: '50MP + 12MP', os: 'Android 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/313886/google-pixel-8-rose-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/313886/google-pixel-8-hazel-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/313886/google-pixel-8-rose-thumb-600x600.jpg',
        stock: 30,
        colors: ['Hồng Rose', 'Xám Hazel', 'Đen Obsidian']
      },

      // ASUS
      {
        name: 'ASUS ROG Phone 7 Ultimate',
        brand: 'ASUS',
        price: 24990000,
        description: 'ROG Phone 7 Ultimate - Thiết kế độc nhất với ROG Vision, AeroActive Portal làm mát cực đỉnh.',
        specs: { screen: '6.78 inch AMOLED 165Hz', cpu: 'Snapdragon 8 Gen 2', ram: '16GB', storage: '512GB', battery: '6000mAh', camera: '50MP + 13MP + 5MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/306990/asus-rog-phone-7-ultimate-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/306990/asus-rog-phone-7-ultimate-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/306990/asus-rog-phone-7-ultimate-thumb-600x600.jpg',
        stock: 10,
        category: 'Phone',
        isFeatured: true,
        colors: ['Trắng Storm']
      },

      // Nubia
      {
        name: 'Nubia Red Magic 8S Pro',
        brand: 'Nubia',
        price: 17490000,
        description: 'Red Magic 8S Pro - Phiên bản nâng cấp với chip ép xung, thiết kế trong suốt.',
        specs: { screen: '6.8 inch AMOLED 120Hz', cpu: 'Snapdragon 8 Gen 2 Advanced', ram: '12GB', storage: '256GB', battery: '6000mAh', camera: '50MP + 8MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/308643/nubia-red-magic-8s-pro-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/308643/nubia-red-magic-8s-pro-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/308643/nubia-red-magic-8s-pro-thumb-600x600.jpg',
        stock: 15,
        colors: ['Bạc Aurora', 'Đen Midnight']
      },

      // Samsung (Phổ thông)
      {
        name: 'Samsung Galaxy M34 5G',
        brand: 'Samsung',
        price: 7690000,
        description: 'Galaxy M34 5G - Pin mãnh thú 6000mAh, màn hình 120Hz.',
        specs: { screen: '6.5 inch Super AMOLED', cpu: 'Exynos 1280', ram: '8GB', storage: '128GB', battery: '6000mAh', camera: '50MP + 8MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/309825/samsung-galaxy-m34-xanh-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/309825/samsung-galaxy-m34-bac-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/309825/samsung-galaxy-m34-xanh-thumb-600x600.jpg',
        stock: 50,
        colors: ['Xanh Midnight', 'Bạc Prism']
      },
      {
        name: 'Samsung Galaxy A04s',
        brand: 'Samsung',
        price: 3090000,
        description: 'Galaxy A04s - Màn hình 90Hz mượt mà nhất phân khúc phổ thông.',
        specs: { screen: '6.5 inch PLS LCD', cpu: 'Exynos 850', ram: '4GB', storage: '64GB', battery: '5000mAh', camera: '50MP + 2MP + 2MP', os: 'Android 12' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/285091/samsung-galaxy-a04s-den-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/285091/samsung-galaxy-a04s-xanh-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/285091/samsung-galaxy-a04s-den-thumb-600x600.jpg',
        stock: 80,
        colors: ['Đen', 'Xanh', 'Nâu']
      },

      // Xiaomi (Phổ thông)
      {
        name: 'POCO M6 Pro',
        brand: 'Xiaomi',
        price: 6490000,
        description: 'POCO M6 Pro - Màn hình Flow AMOLED 120Hz, sạc nhanh 67W.',
        specs: { screen: '6.67 inch AMOLED', cpu: 'Helio G99 Ultra', ram: '8GB', storage: '256GB', battery: '5000mAh', camera: '64MP + 8MP + 2MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/319912/poco-m6-pro-den-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/319912/poco-m6-pro-tim-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/319912/poco-m6-pro-den-thumb-600x600.jpg',
        stock: 40,
        colors: ['Đen', 'Tím', 'Xanh']
      },
      {
        name: 'Xiaomi Redmi Note 12S',
        brand: 'Xiaomi',
        price: 5990000,
        description: 'Redmi Note 12S - Camera 108MP, loa kép stereo, thiết kế gọn gàng.',
        specs: { screen: '6.43 inch AMOLED 90Hz', cpu: 'Helio G96', ram: '8GB', storage: '256GB', battery: '5000mAh', camera: '108MP + 8MP', os: 'Android 13' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/306782/xiaomi-redmi-note-12s-xanh-la-thumb-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/306782/xiaomi-redmi-note-12s-den-thumb-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/306782/xiaomi-redmi-note-12s-xanh-la-thumb-600x600.jpg',
        stock: 60,
        colors: ['Xanh Lá', 'Đen', 'Xanh Dương']
      },

      // iPhone (Cũ)
      {
        name: 'iPhone 12 Pro Max',
        brand: 'Apple',
        price: 15490000,
        description: 'iPhone 12 Pro Max - Thiết kế phẳng, cảm biến LiDAR, màn hình lớn 6.7 inch.',
        specs: { screen: '6.7 inch OLED', cpu: 'Apple A14 Bionic', ram: '6GB', storage: '128GB', battery: '3687mAh', camera: '12MP + 12MP + 12MP', os: 'iOS 14' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/228744/iphone-12-pro-max-gold-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/228744/iphone-12-pro-max-blue-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/228744/iphone-12-pro-max-gold-600x600.jpg',
        stock: 25,
        colors: ['Vàng', 'Xanh Đại Dương', 'Than Chì', 'Bạc']
      },
      {
        name: 'iPhone 7 Plus',
        brand: 'Apple',
        price: 3990000,
        description: 'iPhone 7 Plus - Model quốc dân một thời, camera kép xóa phông đầu tiên của Apple.',
        specs: { screen: '5.5 inch Retina', cpu: 'Apple A10 Fusion', ram: '3GB', storage: '32GB', battery: '2900mAh', camera: '12MP + 12MP', os: 'iOS 10' },
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/78124/iphone-7-plus-32gb-gold-600x600.jpg',
          'https://cdn.tgdd.vn/Products/Images/42/78124/iphone-7-plus-32gb-black-600x600.jpg'
        ],
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/78124/iphone-7-plus-32gb-gold-600x600.jpg',
        stock: 10,
        colors: ['Vàng', 'Đen nhám', 'Hồng']
      }
    ];
    
    // Thêm dữ liệu Sold, Rating, Discount cho tất cả sản phẩm
    products.forEach(p => {
      // 1. Sold Count (10 -> 999)
      if (!p.sold) {
        p.sold = Math.floor(Math.random() * 989) + 10;
      }
      
      // 2. Discount Fake (Nếu chưa có originalPrice, tạo fake discount 5% - 20%)
      if (!p.originalPrice) {
        const discountPercent = Math.floor(Math.random() * 16) + 5; // 5% - 20%
        p.originalPrice = Math.round(p.price * (1 + discountPercent / 100) / 10000) * 10000;
      }

      // 3. Rating Fake (4.0 -> 5.0)
      if (!p.rating) {
        p.rating = (Math.random() * 1 + 4).toFixed(1);
        p.numReviews = Math.floor(Math.random() * 100) + 5;
      }
    });

    // --- PHẦN TỰ ĐỘNG THÊM SẢN PHẨM TỪ ẢNH LOCAL (Uploads) ---
    // Giúp hiển thị các ảnh đã upload trong folder uploads/products
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(__dirname, 'uploads/products');

    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir).filter(f => !f.startsWith('.'));
      
      if (files.length > 0) {
        console.log(`\n� Tìm thấy ${files.length} ảnh trong máy. Đang tạo sản phẩm tương ứng...`);
        
        // Tạo sản phẩm bổ sung từ ảnh
        const extraProducts = [];
        
        // Nhóm ảnh: Cứ 2-3 ảnh tạo thành 1 sản phẩm để đỡ rối
        let fileIdx = 0;
        let productIdx = 1;

        while (fileIdx < files.length) {
          const numImagesForThisProduct = Math.floor(Math.random() * 3) + 1; // 1-3 ảnh/sp
          const productImages = [];
          
          for (let k = 0; k < numImagesForThisProduct && fileIdx < files.length; k++) {
             productImages.push(`/uploads/products/${files[fileIdx]}`);
             fileIdx++;
          }

          if (productImages.length > 0) {
             extraProducts.push({
                name: `Sản phẩm nhập kho #${productIdx} (Mới)`,
                brand: 'New Import',
                price: 5000000 + (productIdx * 100000), // Giá giả định
                description: 'Sản phẩm mới nhập về kho, chưa cập nhật chi tiết.',
                specs: { screen: 'To và đẹp', cpu: 'Mạnh mẽ', ram: '8GB', storage: '256GB' },
                images: productImages,
                thumbnail: productImages[0],
                stock: 10,
                category: 'Phone',
                isFeatured: false,
                colors: ['Mặc định']
             });
             productIdx++;
          }
        }

        // Gộp sản phẩm cũ và mới
        if (extraProducts.length > 0) {
           products.push(...extraProducts);
           console.log(`➕ Đã thêm ${extraProducts.length} sản phẩm mới từ kho ảnh.`);
        }
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
