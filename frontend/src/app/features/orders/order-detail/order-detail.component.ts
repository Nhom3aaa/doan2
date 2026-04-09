import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { environment } from '../../../../environments/environment';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      @if (loading) {
        <div class="animate-pulse space-y-4">
          <div class="bg-gray-200 h-8 rounded w-1/3"></div>
          <div class="bg-gray-200 h-40 rounded"></div>
        </div>
      } @else if (order) {
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <a routerLink="/orders" class="text-primary-600 hover:underline text-sm">&larr; Quay lại</a>
            <h1 class="text-2xl font-bold mt-2">Đơn hàng {{ order.orderNumber }}</h1>
            <p class="text-gray-500">{{ formatDate(order.createdAt) }}</p>
          </div>
          <span [class]="getStatusClass(order.status)" class="badge text-lg px-4 py-2">
            {{ getStatusText(order.status) }}
          </span>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="md:col-span-2 space-y-6">
            <!-- Items -->
            <div class="card p-6">
              <h2 class="font-semibold mb-4">Sản phẩm</h2>
              <div class="space-y-4">
                @for (item of order.items; track item.product) {
                  <div class="flex gap-4">
                    <div class="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img [src]="item.thumbnail || 'https://via.placeholder.com/80'" class="w-full h-full object-contain p-2">
                    </div>
                    <div class="flex-1">
                      <p class="font-medium">{{ item.name }}</p>
                      @if (item.color) {
                        <p class="text-sm text-gray-500">Màu: {{ item.color }}</p>
                      }
                      <p class="text-sm text-gray-500">Số lượng: {{ item.quantity }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold">{{ formatPrice(item.price * item.quantity) }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Timeline -->
            <div class="card p-6">
              <h2 class="font-semibold mb-4">Trạng thái đơn hàng</h2>
              <div class="space-y-4">
                @for (step of orderSteps; track step.status) {
                  <div class="flex gap-4">
                    <div 
                      [class]="isStepCompleted(step.status) ? 'bg-green-500' : 'bg-gray-300'"
                      class="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    >
                      @if (isStepCompleted(step.status)) {
                        ✓
                      }
                    </div>
                    <div>
                      <p [class]="isStepCompleted(step.status) ? 'font-medium' : 'text-gray-400'">{{ step.label }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="space-y-6">
            <!-- Shipping -->
            <div class="card p-6">
              <h2 class="font-semibold mb-4">Giao hàng đến</h2>
              <div class="text-sm space-y-1">
                <p class="font-medium">{{ order.shippingAddress.name }}</p>
                <p class="text-gray-600">{{ order.shippingAddress.phone }}</p>
                <p class="text-gray-600">
                  {{ order.shippingAddress.street }}, 
                  {{ order.shippingAddress.ward ? order.shippingAddress.ward + ', ' : '' }}
                  {{ order.shippingAddress.district }}, 
                  {{ order.shippingAddress.city }}
                </p>
              </div>
            </div>

            <!-- Payment -->
            <div class="card p-6">
              <h2 class="font-semibold mb-4">Thanh toán</h2>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Tạm tính</span>
                  <span>{{ formatPrice(order.totalAmount - order.shippingFee) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Phí vận chuyển</span>
                  <span>{{ formatPrice(order.shippingFee) }}</span>
                </div>
                <hr class="my-2">
                <div class="flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span class="text-primary-600">{{ formatPrice(order.totalAmount) }}</span>
                </div>
                <div class="flex justify-between mt-2">
                  <span class="text-gray-600">Phương thức</span>
                  <span>{{ getPaymentMethod(order.paymentMethod) }}</span>
                </div>
                
                <!-- Banking Info & Upload -->
                @if (order.paymentMethod === 'banking') {
                  <div class="mt-4 pt-4 border-t">
                    <p class="font-semibold mb-2">Thông tin chuyển khoản</p>
                    
                    @if (order.paymentStatus === 'paid') {
                       <div class="p-3 bg-green-50 text-green-700 rounded-lg font-bold flex items-center gap-2">
                          <span>✅</span> Đã thanh toán thành công
                       </div>
                    } @else {
                       <div class="grid md:grid-cols-2 gap-4 mb-4">
                          <!-- QR Code -->
                          <div class="flex flex-col items-center justify-center p-4 border rounded-lg bg-white">
                             <p class="text-sm font-bold mb-3 text-gray-500">QUÉT MÃ ĐỂ THANH TOÁN</p>
                             <img src="assets/payment-qr.png" alt="QR Code" class="w-full max-w-[300px] object-contain shadow-sm">
                          </div>

                          <!-- Text Info -->
                          <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm space-y-2 flex flex-col justify-center">
                             <div>
                               <p class="text-xs text-gray-500 uppercase">Ngân hàng</p>
                               <p class="font-bold text-slate-900 text-lg">TPBank (Tiên Phong)</p>
                             </div>
                             <div>
                               <p class="text-xs text-gray-500 uppercase">Số tài khoản</p>
                               <p class="font-bold text-primary-600 text-xl tracking-wider">0000 4962 158</p>
                             </div>
                             <div>
                               <p class="text-xs text-gray-500 uppercase">Chủ tài khoản</p>
                               <p class="font-bold uppercase text-slate-800">HO HUU CHUNG</p>
                             </div>
                             <div>
                               <p class="text-xs text-gray-500 uppercase">Nội dung chuyển khoản</p>
                               <div class="flex items-center gap-2">
                                  <span class="font-bold text-red-500 text-lg bg-white px-2 py-1 rounded border border-red-200 block w-full text-center select-all">{{ order.orderNumber }}</span>
                               </div>
                               <p class="text-[10px] text-gray-400 mt-1">*Bắt buộc ghi đúng nội dung này</p>
                             </div>
                          </div>
                       </div>

                       @if (order.paymentProof) {
                           <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p class="text-sm font-bold text-yellow-800 mb-2 flex items-center gap-2">
                                 <span>⏳</span> Trạng thái: Đang chờ xác nhận
                              </p>
                              <div class="flex items-center gap-3">
                                 <img [src]="getImageUrl(order.paymentProof)" class="h-16 w-16 object-cover rounded border bg-white">
                                 <span class="text-xs text-gray-500">Shop sẽ kiểm tra và xác nhận sớm nhất.</span>
                              </div>
                           </div>
                       }

                       <div>
                          <label class="block text-sm font-medium mb-2 text-slate-700">
                             {{ order.paymentProof ? 'Gửi lại ảnh khác?' : '📸 Upload biên lai chuyển khoản' }}
                          </label>
                          <div class="flex items-center gap-2">
                            <input type="file" (change)="onFileSelected($event)" accept="image/*" class="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 text-sm text-slate-500 w-full" [disabled]="uploadingProof">
                          </div>
                          @if (uploadingProof) {
                            <p class="text-xs text-blue-600 mt-1 animate-pulse font-medium">Đang tải ảnh lên...</p>
                          }
                       </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Actions -->
            @if (order.status === 'pending') {
              <button (click)="cancelOrder()" class="btn btn-secondary w-full" [disabled]="cancelling">
                {{ cancelling ? 'Đang hủy...' : 'Hủy đơn hàng' }}
              </button>
            }
          </div>
        </div>
      } @else {
        <div class="text-center py-12">
          <p class="text-gray-600">Không tìm thấy đơn hàng</p>
        </div>
      }
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  cancelling = false;
  uploadingProof = false;

  orderSteps = [
    { status: 'pending', label: 'Đặt hàng thành công' },
    { status: 'confirmed', label: 'Đã xác nhận' },
    { status: 'shipping', label: 'Đang giao hàng' },
    { status: 'delivered', label: 'Đã giao hàng' }
  ];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadOrder(params['id']);
    });
  }

  loadOrder(id: string) {
    this.loading = true;
    this.orderService.getOrder(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.order = res.data;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  cancelOrder() {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    
    this.cancelling = true;
    this.orderService.cancelOrder(this.order!._id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.order = res.data;
        }
        this.cancelling = false;
      },
      error: () => this.cancelling = false
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadingProof = true;
    this.productService.uploadImages([file]).subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.length > 0) {
          const proofUrl = res.data[0];
          // Update order with proof
          this.orderService.updatePaymentProof(this.order!._id, proofUrl).subscribe({
            next: (orderRes) => {
              if (orderRes.success && orderRes.data) {
                 this.order = orderRes.data;
                 alert('Đã gửi ảnh biên lai thành công! Shop sẽ kiểm tra sớm.');
              }
              this.uploadingProof = false;
            },
            error: () => {
              alert('Lỗi cập nhật đơn hàng.');
              this.uploadingProof = false;
            }
          });
        } else {
           this.uploadingProof = false;
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        alert('Lỗi upload ảnh.');
        this.uploadingProof = false;
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://via.placeholder.com/50';
    if (path.startsWith('http')) return path;
    return environment.apiUrl.replace('/api', '') + path;
  }

  isStepCompleted(status: string): boolean {
    const statusOrder = ['pending', 'confirmed', 'shipping', 'delivered'];
    const currentIndex = statusOrder.indexOf(this.order?.status || '');
    const stepIndex = statusOrder.indexOf(status);
    return stepIndex <= currentIndex && this.order?.status !== 'cancelled';
  }

  getStatusText(status: string): string {
    const map: Record<string, string> = {
      pending: 'Chờ xử lý', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy'
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', shipping: 'bg-purple-100 text-purple-700', 
      delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }

  getPaymentMethod(method: string): string {
    const map: Record<string, string> = { cod: 'Thanh toán khi nhận hàng', banking: 'Chuyển khoản', momo: 'MoMo', vnpay: 'VNPay' };
    return map[method] || method;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('vi-VN');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
