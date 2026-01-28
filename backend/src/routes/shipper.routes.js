const express = require('express');
const router = express.Router();
const { auth, shipperAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload'); // Cần kiểm tra file này
const shipperController = require('../controllers/shipper.controller');

// Tất cả routes đều cần đăng nhập và quyền shipper
router.use(auth, shipperAuth);

router.get('/orders', shipperController.getAssignedOrders);
router.put('/orders/:orderId/status', shipperController.updateDeliveryStatus);
router.post('/orders/:orderId/evidence', upload.single('image'), shipperController.uploadDeliveryEvidence);
router.get('/available', shipperController.getAvailableOrders);
router.post('/orders/:orderId/claim', shipperController.claimOrder);

module.exports = router;
