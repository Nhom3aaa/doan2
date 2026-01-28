const Order = require('../models/Order');
const User = require('../models/User');

// Lấy danh sách đơn hàng được gán cho shipper
const getAssignedOrders = async (req, res) => {
  try {
    const shipperId = req.user._id;

    const orders = await Order.find({ shipper: shipperId })
      .populate('user', 'name phone address')
      .populate('items.product', 'name price thumbnail')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đơn hàng',
      error: error.message
    });
  }
};

// Cập nhật trạng thái giao hàng
const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({ 
      _id: orderId,
      shipper: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tìm thấy hoặc không thuộc quyền quản lý của bạn'
      });
    }

    const validStatuses = ['shipping', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    // Nếu chuyển sang trạng thái đã giao, bắt buộc phải có bằng chứng
    if (status === 'delivered') {
      console.log('Checking Order Evidence:', {
        id: order._id,
        deliveryImage: order.deliveryImage,
        status: order.status
      });
      if (!order.deliveryImage) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng tải lên bằng chứng giao hàng (Ảnh/Video) trước khi xác nhận đã giao'
        });
      }
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái',
      error: error.message
    });
  }
};

// Upload ảnh bằng chứng giao hàng
const uploadDeliveryEvidence = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng tải lên ảnh hoặc video bằng chứng'
      });
    }

    // Do middleware upload.js đang lưu vào uploads/products
    // Do middleware upload.js đang lưu vào uploads/products
    const imageUrl = `/uploads/products/${req.file.filename}`;
    
    // Sử dụng findOneAndUpdate để cập nhật trực tiếp và trả về document mới nhất
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, shipper: req.user._id },
      { $set: { deliveryImage: imageUrl } },
      { new: true } // Trả về document sau khi update
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tìm thấy hoặc không thuộc quyền quản lý'
      });
    }

    console.log('Evidence Uploaded Successfully:', {
        id: updatedOrder._id,
        image: updatedOrder.deliveryImage
    });

    res.json({
      success: true,
      message: 'Upload bằng chứng thành công',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi upload ảnh',
      error: error.message
    });
  }
};

// Lấy danh sách đơn hàng chưa có shipper (Order Pool)
const getAvailableOrders = async (req, res) => {
  try {
    // Chỉ lấy đơn đã xác nhận và chưa có shipper
    const orders = await Order.find({ 
      status: 'confirmed',
      $or: [
        { shipper: { $exists: false } },
        { shipper: null }
      ]
    })
      .populate('user', 'name phone address')
      .populate('items.product', 'name price thumbnail')
      .sort({ createdAt: 1 }); // Đơn cũ nhất lên đầu

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đơn hàng mới',
      error: error.message
    });
  }
};

// Nhận đơn hàng
const claimOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId,
      status: 'confirmed',
      $or: [
        { shipper: { $exists: false } },
        { shipper: null }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không khả dụng (đã có người nhận hoặc không tồn tại)'
      });
    }

    order.shipper = req.user._id;
    // Có thể chuyển luôn trạng thái sang shipping hoặc giữ nguyên confirmed
    // Ở đây ta giữ nguyên confirmed để shipper bấm "Bắt đầu giao" sau
    await order.save();

    res.json({
      success: true,
      message: 'Nhận đơn hàng thành công',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi nhận đơn hàng',
      error: error.message
    });
  }
};

module.exports = {
  getAssignedOrders,
  updateDeliveryStatus,
  uploadDeliveryEvidence,
  getAvailableOrders,
  claimOrder
};
