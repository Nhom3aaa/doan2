const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middlewares/auth');
const passport = require('passport');
const upload = require('../middlewares/upload');

const router = express.Router();

// --- Social Login Routes ---

// Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Generate token
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Redirect to frontend with token
    res.redirect(`http://localhost:4200/auth/callback?token=${token}`);
  }
);

// Facebook Login
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook Callback
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`http://localhost:4200/auth/callback?token=${token}`);
  }
);

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Tạo user mới
    const user = new User({
      email,
      password,
      name,
      phone
    });

    await user.save();

    // Tạo token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng ký',
      error: error.message
    });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra tài khoản có bị khóa không
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa'
      });
    }

    // Kiểm tra password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạo token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng nhập',
      error: error.message
    });
  }
});

// Lấy thông tin profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin',
      error: error.message
    });
  }
});

// Cập nhật profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật',
      error: error.message
    });
  }
});

// ... (existing imports)

// POST /profile/avatar
router.post('/profile/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn ảnh'
      });
    }

    const avatarUrl = `/uploads/products/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Cập nhật ảnh đại diện thành công',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật ảnh đại diện',
      error: error.message
    });
  }
});

// Đổi mật khẩu
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi đổi mật khẩu',
      error: error.message
    });
  }
});

module.exports = router;
