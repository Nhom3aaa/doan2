import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipper-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto" *ngIf="order">
        <div class="mb-4">
            <button (click)="goBack()" class="text-gray-600 hover:text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
                Quay lại
            </button>
        </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Chi tiết đơn hàng #{{order.orderNumber}}</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Thông tin chi tiết và cập nhật trạng thái.</p>
          </div>
          <span [ngClass]="{
            'bg-yellow-100 text-yellow-800': order.status === 'pending',
            'bg-blue-100 text-blue-800': order.status === 'confirmed',
            'bg-indigo-100 text-indigo-800': order.status === 'shipping',
            'bg-green-100 text-green-800': order.status === 'delivered',
            'bg-red-100 text-red-800': order.status === 'cancelled'
          }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
            {{getStatusText(order.status)}}
          </span>
        </div>
        
        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Khách hàng</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{order.shippingAddress.name}} - {{order.shippingAddress.phone}}</dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Địa chỉ giao hàng</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{order.shippingAddress.street}}, {{order.shippingAddress.ward}}, {{order.shippingAddress.district}}, {{order.shippingAddress.city}}
              </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Sản phẩm</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul class="border border-gray-200 rounded-md divide-y divide-gray-200">
                        <li *ngFor="let item of order.items" class="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div class="flex items-center flex-1 min-w-0 gap-3">
                                <img [src]="getImgUrl(item.product.thumbnail)" alt="" class="h-12 w-12 rounded object-cover border border-gray-200 bg-gray-50">
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate">{{item.product.name}}</p>
                                    <p class="text-xs text-gray-500">Màu: {{item.color}} | SL: {{item.quantity}}</p>
                                </div>
                            </div>
                            <div class="ml-4 flex-shrink-0 font-medium">
                                {{item.price | number}} đ
                            </div>
                        </li>
                    </ul>
                </dd>
            </div>
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Tổng tiền thu hộ</dt>
              <dd class="mt-1 text-sm font-bold text-blue-600 sm:mt-0 sm:col-span-2">{{order.totalAmount | number}} đ</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Action Section -->
      <div class="bg-white shadow sm:rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Cập nhật trạng thái</h3>
        
        <div class="flex flex-col space-y-4">
            <!-- Update Status Buttons -->
            <div class="flex space-x-3">
                <button *ngIf="order.status === 'confirmed'" (click)="updateStatus('shipping')" 
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Bắt đầu giao hàng
                </button>
                <button *ngIf="order.status === 'shipping'" (click)="updateStatus('delivered')" 
                    [disabled]="!proofImage && !order.deliveryImage"
                    [class.opacity-50]="!proofImage && !order.deliveryImage"
                    class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Xác nhận giao hàng thành công
                </button>
                 <button *ngIf="order.status === 'shipping' || order.status === 'confirmed'" (click)="updateStatus('cancelled')" 
                    class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Báo hủy/Không giao được
                </button>
            </div>

            <!-- Upload Evidence -->
            <div *ngIf="order.status === 'shipping' || order.status === 'delivered'" class="mt-4 border-t pt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Bằng chứng giao hàng (Ảnh/Video)</label>
                
                <div *ngIf="order.deliveryImage" class="mb-2">
                    <p class="text-sm text-green-600 mb-1">Đã có bằng chứng:</p>
                    <div *ngIf="isVideo(order.deliveryImage); else imagePreview">
                        <video [src]="getImgUrl(order.deliveryImage)" controls class="w-full max-h-64 rounded border"></video>
                    </div>
                    <ng-template #imagePreview>
                        <img [src]="getImgUrl(order.deliveryImage)" alt="Delivery Proof" class="h-48 w-auto object-cover rounded border">
                    </ng-template>
                </div>

                <div>
                    <input type="file" (change)="onFileSelected($event)" accept="image/*,video/*" class="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100">
                    <button *ngIf="selectedFile" (click)="uploadEvidence()" 
                        class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm flex items-center gap-2">
                        <span *ngIf="uploading" class="animate-spin h-3 w-3 border-2 border-white rounded-full border-t-transparent"></span>
                        {{ uploading ? 'Đang tải lên...' : 'Tải lên' }}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  `
})
export class ShipperOrderDetailComponent implements OnInit {
  order: any = null;
  loading = true;
  apiUrl = environment.apiUrl;
  selectedFile: File | null = null;
  proofImage: string | null = null;
  apiUrlRoot = environment.apiUrl.replace('/api', '');

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
        if (params['id']) {
             // In real app, we might need a specific endpoint for single order details for shipper 
             // or reuse getAssignedOrders and find. For now, fetch all and find is simplest if API doesn't support getById for shipper specific check
             // BUT, usually we should have GET /api/shipper/orders/:id. 
             // Since I didn't create that route in backend, I will use getAssignedOrders and filter on client side for MVP, 
             // OR I can quickly add the route in backend if I was in backend mode. 
             // Actually, I didn't create GET /orders/:id for shipper in backend. 
             // Let's implement fetchOrders and filter for now to avoid switching context back and forth too much, as the list is likely small per shipper.
             // Wait, I can't effectively filter if the list is paginated (though it's not). 
             // Better approach: use valid existing endpoint or just fetch list.
             this.fetchOrderDetails(params['id']);
        }
    });
  }

  fetchOrderDetails(orderId: string) {
      this.http.get<any>(`${this.apiUrl}/shipper/orders`).subscribe({
          next: (res) => {
              if (res.success) {
                  this.order = res.orders.find((o: any) => o._id === orderId);
                  if (!this.order) {
                      alert('Không tìm thấy đơn hàng');
                      this.router.navigate(['/shipper']);
                  }
              }
              this.loading = false;
          },
          error: (err) => {
              console.error(err);
              this.loading = false;
          }
      });
  }

  updateStatus(status: string) {
      if (!confirm('Bạn có chắc chắn muốn thay đổi trạng thái thành ' + this.getStatusText(status) + '?')) return;

      this.http.put(`${this.apiUrl}/shipper/orders/${this.order._id}/status`, { status }).subscribe({
          next: (res: any) => {
              if (res.success) {
                  this.order.status = status;
                  alert('Cập nhật trạng thái thành công');
              }
          },
          error: (err) => alert('Lỗi cập nhật trạng thái: ' + err.error?.message)
      });
  }

  onFileSelected(event: any) {
      const file: File = event.target.files[0];
      if (file) {
          this.selectedFile = file;
      }
  }

  uploadEvidence() {
      if (!this.selectedFile) return;

      this.uploading = true;
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.http.post(`${this.apiUrl}/shipper/orders/${this.order._id}/evidence`, formData).subscribe({
          next: (res: any) => {
              if (res.success) {
                  this.order = res.order;
                  this.proofImage = res.order.deliveryImage;
                  this.selectedFile = null;
                  alert('Upload bằng chứng thành công');
              }
              this.uploading = false;
          },
          error: (err) => {
              alert('Lỗi upload: ' + (err.error?.message || err.message));
              this.uploading = false;
          }
      });
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'shipping': 'Đang giao',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  }

  uploading = false;

  getImgUrl(path: string): string {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      return `${this.apiUrlRoot}${path}`;
  }

  isVideo(path: string): boolean {
      if (!path) return false;
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
      return videoExtensions.some(ext => path.toLowerCase().endsWith(ext));
  }


  
  goBack() {
      this.router.navigate(['/shipper']);
  }
}
