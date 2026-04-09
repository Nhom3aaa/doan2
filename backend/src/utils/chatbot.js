const OpenAI = require('openai');
const Groq = require('groq-sdk');
const Product = require('../models/Product');

// Initialize Clients
let openai;
let groq;

if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
  console.log('✅ Chatbot: Groq API Key found');
  groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY.trim()
  });
}

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
  console.log('✅ Chatbot: OpenAI API Key found');
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY.trim() });
}

const getBotResponse = async (message) => {
  console.log('💬 Bot received:', message);
  try {
    // 1. Search for related products in DB to provide context
    const keywords = message.replace(/giá|bao nhiêu|tìm|mua|của|ở đâu|shop|cửa hàng/gi, '').trim();
    console.log('🔍 Extracted keywords:', keywords);
    let productContext = '';
    
    if (keywords.length > 2) {
      const products = await Product.find({ 
        name: { $regex: keywords, $options: 'i' } 
      }).limit(5).select('name price brand specs');

      console.log(`🔎 Found ${products.length} products for context`);

      if (products.length > 0) {
        productContext = 'Sản phẩm có trong cửa hàng:\n' + products.map(p => {
            const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price);
            return `- ${p.name}: ${price}`;
        }).join('\n');
      }
    }

    const systemPrompt = `Bạn là trợ lý bán hàng ảo của 'Chung Mobile'. 
            Phong cách: Thân thiện, nhiệt tình, dùng emoji. 
            Nhiệm vụ: Trả lời câu hỏi về giá, cấu hình, tư vấn sản phẩm.
            Thông tin cửa hàng: 
            - Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
            - Hotline: 0909.123.456
            - Bảo hành: 1 đổi 1 trong 30 ngày, phần cứng 12 tháng.
            
            DỮ LIỆU SẢN PHẨM TÌM THẤY TỪ DATABASE NGAY LÚC NÀY (Sử dụng để trả lời chính xác, không bịa đặt giá):
            ${productContext}
            
            Nếu khách hỏi về sản phẩm không có trong danh sách trên, hãy nói là bạn sẽ kiểm tra lại kho hoặc gợi ý sản phẩm khác. 
            Đừng bịa ra sản phẩm không có.`;

    // 2. Use Groq (Priority)
    if (groq) {
        console.log('🚀 Using Groq API (llama-3.3-70b-versatile)...');
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
        });
        const ans = completion.choices[0]?.message?.content || "Xin lỗi, tôi không thể trả lời lúc này.";
        console.log('🤖 Groq response:', ans);
        return ans;
    }

    // 3. Use OpenAI (Fallback)
    if (openai) {
        console.log('🚀 Using OpenAI API...');
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "gpt-3.5-turbo",
        });
        const ans = completion.choices[0].message.content;
        console.log('🤖 OpenAI response:', ans);
        return ans;
    }

    // 4. No AI Client
    console.warn('⚠️ No AI Client available');
    if (productContext) return `Tôi tìm thấy các sản phẩm sau:\n${productContext}\n(VCâu hình AI API Key để tôi có thể tư vấn chi tiết hơn)`;
    return "Xin chào! Tôi là trợ lý ảo. Hiện tại tính năng AI đang được bảo trì. Bạn vui lòng quay lại sau hoặc gọi hotline nhé.";

  } catch (err) {
    console.error('❌ Chatbot AI Error:', err);
    return 'Xin lỗi, tôi đang gặp chút sự cố khi tra cứu dữ liệu. Bạn chờ lát nhắn lại nhé! 😅';
  }
};

module.exports = { getBotResponse };
