const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.');

    // Clear old data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Cleared old data.');

    // Create Users
    await User.create({
      email: 'admin@phoneshop.com', password: 'admin123', name: 'Admin Store', phone: '0123456789', role: 'admin'
    });
    await User.create({
      email: 'user@example.com', password: 'user123', name: 'Test User', phone: '0987654321', role: 'user'
    });
    console.log('👤 Created default users.');

    // Scan for local images
    const uploadDir = path.join(__dirname, 'uploads/products');
    let productImages = [];
    
    if (fs.existsSync(uploadDir)) {
       const files = fs.readdirSync(uploadDir).filter(f => !f.startsWith('.'));
       if (files.length > 0) {
           console.log(`📂 Found ${files.length} local images in uploads/products.`);
           productImages = files.map(f => `/uploads/products/${f}`);
       } else {
           console.log('⚠️ uploads/products directory exists but is empty.');
       }
    } else {
       console.log('⚠️ uploads/products directory not found.');
    }

    // Product Templates
    const templates = [
        { name: 'iPhone 15 Pro Max', brand: 'Apple', price: 34990000 },
        { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 33990000 },
        { name: 'Xiaomi 14 Ultra', brand: 'Xiaomi', price: 23990000 },
        { name: 'iPhone 14 Pro Max', brand: 'Apple', price: 27990000 },
        { name: 'Google Pixel 8 Pro', brand: 'Google', price: 22990000 },
        { name: 'OPPO Find X7 Ultra', brand: 'OPPO', price: 22990000 },
        { name: 'Vivo X100 Pro', brand: 'Vivo', price: 19990000 },
        { name: 'iPhone 13', brand: 'Apple', price: 13990000 },
        { name: 'Samsung Galaxy A55', brand: 'Samsung', price: 10490000 },
        { name: 'Xiaomi Redmi Note 13', brand: 'Xiaomi', price: 4890000 }
    ];

    const products = [];
    let imgIndex = 0;

    // Use local images if available
    if (productImages.length > 0) {
        for (let i = 0; i < 50; i++) {
            const template = templates[i % templates.length];
            const currentImages = [];
            
            // Assign 2-4 images per product
            const count = Math.floor(Math.random() * 3) + 2;
            for (let j = 0; j < count; j++) {
                if (imgIndex < productImages.length) {
                    currentImages.push(productImages[imgIndex++]);
                } else {
                    // Loop back if run out
                    currentImages.push(productImages[Math.floor(Math.random() * productImages.length)]);
                }
            }
            
            products.push({
                ...template,
                name: `${template.name} ${i >= templates.length ? '(Variant ' + (i+1) + ')' : ''}`,
                originalPrice: template.price * 1.1,
                description: `Mô tả sản phẩm ${template.name}. Hàng chính hãng 100%.`,
                specs: { screen: '6.7 inch', cpu: 'Snapdragon 8 Gen 3', ram: '8GB', storage: '256GB' },
                images: currentImages,
                thumbnail: currentImages[0],
                stock: Math.floor(Math.random() * 50) + 10,
                category: 'Phone',
                rating: 4.5,
                numReviews: Math.floor(Math.random() * 100),
                sold: Math.floor(Math.random() * 1000)
            });
        }
    } else {
        // Fallback to online images if no local images found (Old behavior)
         console.log('⚠️ Using fallback online data as no local images were found.');
         // ... (Simple fallback data could be added here, but for now we focus on local)
    }
    
    if (products.length > 0) {
        await Product.insertMany(products);
        console.log(`📱 Seeded ${products.length} products using local images.`);
    } else {
        console.log('❌ No products seeded.');
    }

    console.log('\n✅ Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
