import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Cart } from '../../core/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Thanh toán</h1>

      @if (!cart || cart.items.length === 0) {
        <div class="text-center py-12 card">
          <p class="text-gray-600 mb-4">Giỏ hàng trống</p>
          <a routerLink="/products" class="btn btn-primary">Tiếp tục mua sắm</a>
        </div>
      } @else {
        <div class="grid md:grid-cols-3 gap-6">
          <!-- Form -->
          <div class="md:col-span-2">
            <form (ngSubmit)="placeOrder()">
              <!-- Shipping Info -->
              <div class="card p-6 mb-6">
                <h2 class="font-semibold mb-4">Thông tin giao hàng</h2>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
                    <input type="text" [(ngModel)]="shippingAddress.name" name="name" class="input" required>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                    <input type="tel" [(ngModel)]="shippingAddress.phone" name="phone" class="input" required>
                  </div>
                </div>

                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ *</label>
                  <input type="text" [(ngModel)]="shippingAddress.street" name="street" class="input" placeholder="Số nhà, tên đường" required>
                </div>

                <div class="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                    <input type="text" [(ngModel)]="shippingAddress.ward" name="ward" class="input">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện *</label>
                    <input type="text" [(ngModel)]="shippingAddress.district" name="district" class="input" required>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố *</label>
                    <input type="text" [(ngModel)]="shippingAddress.city" name="city" class="input" required>
                  </div>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="card p-6 mb-6">
                <h2 class="font-semibold mb-4">Phương thức thanh toán</h2>
                <div class="space-y-3">
                  <label class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors" [class.border-primary-500]="paymentMethod === 'cod'" [class.bg-primary-50]="paymentMethod === 'cod'">
                    <input type="radio" value="cod" [(ngModel)]="paymentMethod" name="payment" class="mr-3">
                    <div>
                      <span class="font-medium block">💵 Thanh toán khi nhận hàng (COD)</span>
                      <span class="text-sm text-gray-500">Thanh toán tiền mặt cho shipper khi nhận hàng</span>
                    </div>
                  </label>
                  
                  <label class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors" [class.border-primary-500]="paymentMethod === 'banking'" [class.bg-primary-50]="paymentMethod === 'banking'">
                    <input type="radio" value="banking" [(ngModel)]="paymentMethod" name="payment" class="mr-3">
                    <div>
                      <span class="font-medium block">🏦 Chuyển khoản ngân hàng</span>
                      <span class="text-sm text-gray-500">Quét mã QR hoặc chuyển khoản thủ công</span>
                    </div>
                  </label>

                  <!-- Bank Info & QR -->
                  @if (paymentMethod === 'banking') {
                    <div class="mt-4 p-4 bg-white border border-slate-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                       <div class="flex flex-col items-center mb-4">
                          <p class="text-xs font-bold text-gray-500 mb-2">QUÉT MÃ THANH TOÁN NGAY</p>
                          <img src="assets/payment-qr.png" alt="QR Code" class="w-full max-w-[300px] h-auto object-contain border rounded-lg shadow-sm">
                       </div>
                       
                       <div class="space-y-2 text-sm text-slate-700 bg-slate-50 p-3 rounded">
                          <p><span class="font-bold">Ngân hàng:</span> TPBank</p>
                          <p><span class="font-bold">STK:</span> <span class="text-primary-600 font-bold text-lg">0000 4962 158</span></p>
                          <p><span class="font-bold">Chủ TK:</span> HO HUU CHUNG</p>
                          <div class="pt-2 border-t border-slate-200 mt-2">
                             <p class="font-bold text-red-500 mb-1">Nội dung chuyển khoản:</p>
                             <div class="bg-white border border-red-200 p-2 rounded text-center font-bold text-slate-800">
                                {{ shippingAddress.phone || 'SỐ ĐIỆN THOẠI CỦA BẠN' }}
                             </div>
                             <p class="text-[10px] text-gray-400 mt-1 italic text-center">
                               *Sau khi chuyển khoản, vui lòng Upload ảnh Bill ở bước tiếp theo.
                             </p>
                          </div>
                       </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Note -->
              <div class="card p-6 mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea [(ngModel)]="note" name="note" class="input" rows="3" placeholder="Ghi chú cho đơn hàng..."></textarea>
              </div>

              @if (error) {
                <div class="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{{ error }}</div>
              }

              <button type="submit" class="btn btn-primary w-full py-3" [disabled]="loading">
                {{ loading ? 'Đang xử lý...' : 'Đặt hàng' }}
              </button>
            </form>
          </div>

          <!-- Order Summary -->
          <div>
            <div class="card p-6 sticky top-20">
              <h2 class="font-semibold mb-4">Đơn hàng ({{ cart.items.length }} sản phẩm)</h2>
              
              <div class="space-y-3 max-h-64 overflow-y-auto mb-4">
                @for (item of cart.items; track item.product._id) {
                  <div class="flex gap-3">
                    <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img [src]="getImageUrl(item.product.thumbnail)" [alt]="item.product.name" class="w-full h-full object-contain p-1">
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate">{{ item.product.name }}</p>
                      <p class="text-sm text-gray-500">x{{ item.quantity }}</p>
                      <p class="text-sm font-semibold text-primary-600">{{ formatPrice(item.product.price * item.quantity) }}</p>
                    </div>
                  </div>
                }
              </div>

              <hr class="my-4">

              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Tạm tính</span>
                  <span>{{ formatPrice(cart.total) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Phí vận chuyển</span>
                  <span>{{ formatPrice(30000) }}</span>
                </div>
              </div>

              <hr class="my-4">

              <div class="flex justify-between font-semibold text-lg">
                <span>Tổng cộng</span>
                <span class="text-primary-600">{{ formatPrice(cart.total + 30000) }}</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  uploadingProof = false; // Added
  error = '';

  shippingAddress = {
    name: '',
    phone: '',
    street: '',
    ward: '',
    district: '',
    city: ''
  };

  paymentMethod = 'cod';
  paymentProof = ''; // Added
  note = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private productService: ProductService, // Added
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });

    // Pre-fill from user profile
    const user = this.authService.currentUser;
    if (user) {
      this.shippingAddress.name = user.name;
      this.shippingAddress.phone = user.phone || '';
      if (user.address) {
        this.shippingAddress.street = user.address.street || '';
        this.shippingAddress.ward = user.address.ward || '';
        this.shippingAddress.district = user.address.district || '';
        this.shippingAddress.city = user.address.city || '';
      }
    }
  }

  // Added
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadingProof = true;
    this.productService.uploadImages([file]).subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.length > 0) {
          this.paymentProof = res.data[0];
        }
        this.uploadingProof = false;
        event.target.value = ''; // Reset input
      },
      error: (err) => {
        console.error('Upload proof error:', err);
        alert('Lỗi upload ảnh: ' + (err.error?.message || err.message));
        this.uploadingProof = false;
      }
    });
  }

  placeOrder() {
    if (!this.shippingAddress.name || !this.shippingAddress.phone || 
        !this.shippingAddress.street || !this.shippingAddress.district || 
        !this.shippingAddress.city) {
      this.error = 'Vui lòng điền đầy đủ thông tin giao hàng';
      return;
    }

    this.orderService.createOrder({
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod,
      note: this.note
    }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.router.navigate(['/orders', res.data._id]);
        } else {
          this.error = res.message || 'Đặt hàng thất bại';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Đặt hàng thất bại';
        this.loading = false;
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://via.placeholder.com/100x100?text=Phone';
    if (path.startsWith('http')) return path;
    return environment.apiUrl.replace('/api', '') + path;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
