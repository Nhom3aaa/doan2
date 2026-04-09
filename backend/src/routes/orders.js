const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const { auth, adminAuth } = require('../middlewares/auth');

const router = express.Router();

// Lấy lịch sử đơn hàng của user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { user: req.user._id };
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy lịch sử đơn hàng',
      error: error.message
    });
  }
});

// Lấy chi tiết đơn hàng
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết đơn hàng',
      error: error.message
    });
  }
});

// Đặt hàng
router.post('/', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'cod', note } = req.body;

    // Lấy giỏ hàng
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống'
      });
    }

    // Kiểm tra tồn kho và tính tổng
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product) continue;

      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm "${item.product.name}" không đủ số lượng tồn kho`
        });
      }

      totalAmount += item.product.price * item.quantity;
      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        color: item.color,
        thumbnail: item.product.thumbnail || item.product.images[0]
      });
    }

    // Phí ship cố định
    const shippingFee = 30000;
    totalAmount += shippingFee;

    // Tạo đơn hàng
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      note,
      shippingFee
    });

    await order.save();

    // Cập nhật tồn kho
    for (const item of cart.items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity, sold: item.quantity }
        });
      }
    }

    // Xóa giỏ hàng
    await Cart.findOneAndDelete({ user: req.user._id });

    // Tạo thông báo
    const notification = new Notification({
      user: req.user._id,
      type: 'order',
      title: 'Đặt hàng thành công',
      content: `Đơn hàng ${order.orderNumber} đã được đặt thành công. Tổng tiền: ${totalAmount.toLocaleString()}đ`,
      data: { orderId: order._id }
    });
    await notification.save();

    // Gửi thông báo realtime
    const io = req.app.get('io');
    io.to(`user_${req.user._id}`).emit('new_notification', notification);

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi đặt hàng',
      error: error.message
    });
  }
});

// Cập nhật bằng chứng thanh toán (User)
router.put('/:id/payment', auth, async (req, res) => {
  try {
    const { paymentProof } = req.body;
    
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Không thể cập nhật thanh toán cho đơn hàng này' });
    }

    order.paymentProof = paymentProof;
    await order.save();

    res.json({
      success: true,
      message: 'Đã cập nhật ảnh chuyển khoản',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật thanh toán',
      error: error.message
    });
  }
});

// Hủy đơn hàng
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể hủy đơn hàng đang chờ xử lý'
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Hoàn lại số lượng tồn kho
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity }
      });
    }

    res.json({
      success: true,
      message: 'Đã hủy đơn hàng',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi hủy đơn hàng',
      error: error.message
    });
  }
});

// ===== ADMIN ROUTES =====

// Lấy tất cả đơn hàng (admin)
router.get('/admin/all', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('shipper', 'name phone')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách đơn hàng',
      error: error.message
    });
  }
});

// Cập nhật trạng thái đơn hàng (admin)
router.put('/admin/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = {};
    const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    const validPaymentStatuses = ['pending', 'paid', 'failed'];
    
    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Trạng thái đơn hàng không hợp lệ' });
      }
      updateData.status = status;
    }

    if (paymentStatus) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ success: false, message: 'Trạng thái thanh toán không hợp lệ' });
      }
      updateData.paymentStatus = paymentStatus;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Tạo thông báo cho user
    const statusText = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy'
    };

    const notification = new Notification({
      user: order.user._id,
      type: 'order_status',
      title: 'Cập nhật đơn hàng',
      content: `Đơn hàng ${order.orderNumber} đã chuyển sang trạng thái: ${statusText[status]}`,
      data: { orderId: order._id }
    });
    await notification.save();

    // Gửi thông báo realtime
    const io = req.app.get('io');
    io.to(`user_${order.user._id}`).emit('new_notification', notification);
    io.to(`user_${order.user._id}`).emit('order_status', { 
      orderId: order._id, 
      status, 
      statusText: statusText[status] 
    });

    res.json({
      success: true,
      message: 'Đã cập nhật trạng thái đơn hàng',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật trạng thái',
      error: error.message
    });
  }
});

// Thống kê đơn hàng (admin)
router.get('/admin/stats', auth, adminAuth, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        statusStats: stats,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thống kê',
      error: error.message
    });
  }
});

module.exports = router;
