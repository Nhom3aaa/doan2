import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-shipper-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Bảng điều khiển Shipper</h2>

      <!-- Tabs -->
      <div class="flex space-x-4 mb-6 border-b">
        <button 
          (click)="switchTab('assigned')" 
          [class]="activeTab === 'assigned' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
          class="pb-2 px-4 font-medium transition-colors">
          Đơn hàng của tôi
        </button>
        <button 
          (click)="switchTab('available')" 
          [class]="activeTab === 'available' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
          class="pb-2 px-4 font-medium transition-colors">
          Nhận đơn mới
        </button>
      </div>
      
      <div *ngIf="loading" class="text-center py-4">
        <p>Đang tải...</p>
      </div>

      <!-- Assigned Orders -->
      <div *ngIf="!loading && activeTab === 'assigned'">
        <div *ngIf="assignedOrders.length === 0" class="text-center py-8 text-gray-500">
          Hiện tại bạn chưa được gán đơn hàng nào.
        </div>
        <div *ngIf="assignedOrders.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
             <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let order of assignedOrders" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{order.orderNumber}}</td>
                <td class="px-6 py-4">{{order.shippingAddress.street}}, {{order.shippingAddress.ward}}, {{order.shippingAddress.district}}, {{order.shippingAddress.city}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-blue-600 font-medium">{{order.totalAmount | number}} đ</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [ngClass]="{
                    'bg-yellow-100 text-yellow-800': order.status === 'pending',
                    'bg-blue-100 text-blue-800': order.status === 'confirmed',
                    'bg-indigo-100 text-indigo-800': order.status === 'shipping',
                    'bg-green-100 text-green-800': order.status === 'delivered',
                    'bg-red-100 text-red-800': order.status === 'cancelled'
                  }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{getStatusText(order.status)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a [routerLink]="['/shipper/orders', order._id]" class="text-indigo-600 hover:text-indigo-900">Chi tiết</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Available Orders -->
      <div *ngIf="!loading && activeTab === 'available'">
        <div *ngIf="availableOrders.length === 0" class="text-center py-8 text-gray-500">
          Hiện tại không có đơn hàng mới nào cần giao.
        </div>
        <div *ngIf="availableOrders.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let order of availableOrders" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{order.orderNumber}}</td>
                <td class="px-6 py-4">{{order.shippingAddress.street}}, {{order.shippingAddress.ward}}, {{order.shippingAddress.district}}, {{order.shippingAddress.city}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-blue-600 font-medium">{{order.totalAmount | number}} đ</td>
                <td class="px-6 py-4 whitespace-nowrap">{{order.createdAt | date:'dd/MM/yyyy HH:mm'}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button (click)="claimOrder(order._id)" class="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors">
                    Nhận đơn này
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class ShipperDashboardComponent implements OnInit {
  activeTab: 'assigned' | 'available' = 'assigned';
  assignedOrders: any[] = [];
  availableOrders: any[] = [];
  loading = true;
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (this.activeTab === 'assigned') {
      this.fetchAssignedOrders();
    } else {
      this.fetchAvailableOrders();
    }
  }

  switchTab(tab: 'assigned' | 'available') {
    this.activeTab = tab;
    this.loadData();
  }

  fetchAssignedOrders() {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}/shipper/orders`).subscribe({
      next: (res) => {
        if (res.success) {
          this.assignedOrders = res.orders;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching assigned orders:', err);
        this.loading = false;
      }
    });
  }

  fetchAvailableOrders() {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}/shipper/available`).subscribe({
      next: (res) => {
        if (res.success) {
          this.availableOrders = res.orders;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching available orders:', err);
        this.loading = false;
      }
    });
  }

  claimOrder(orderId: string) {
    if (!confirm('Bạn có chắc chắn muốn nhận giao đơn hàng này?')) return;

    this.http.post<any>(`${this.apiUrl}/shipper/orders/${orderId}/claim`, {}).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Đã nhận đơn hàng thành công! Đơn hàng đã được chuyển sang danh sách của bạn.');
          this.switchTab('assigned');
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Lỗi khi nhận đơn hàng');
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
}
