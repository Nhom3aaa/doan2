import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto">
        @for (tab of tabs; track tab.value) {
          <button 
            (click)="filterByStatus(tab.value)"
            [class]="currentStatus === tab.value ? 'btn-primary' : 'btn-secondary'"
            class="btn whitespace-nowrap"
          >
            {{ tab.label }}
          </button>
        }
      </div>

      @if (loading) {
        <div class="space-y-4">
          @for (i of [1,2,3]; track i) {
            <div class="card p-4 animate-pulse">
              <div class="bg-gray-200 h-4 rounded w-1/3 mb-4"></div>
              <div class="bg-gray-200 h-20 rounded"></div>
            </div>
          }
        </div>
      } @else if (orders.length === 0) {
        <div class="text-center py-12 card">
          <div class="text-6xl mb-4">📦</div>
          <p class="text-gray-600 mb-4">Chưa có đơn hàng nào</p>
          <a routerLink="/products" class="btn btn-primary">Mua sắm ngay</a>
        </div>
      } @else {
        <div class="space-y-4">
          @for (order of orders; track order._id) {
            <a [routerLink]="['/orders', order._id]" class="card p-4 block hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <span class="font-medium">{{ order.orderNumber }}</span>
                  <span class="text-gray-500 text-sm ml-2">{{ formatDate(order.createdAt) }}</span>
                </div>
                <span [class]="getStatusClass(order.status)" class="badge">
                  {{ getStatusText(order.status) }}
                </span>
              </div>

              <div class="flex items-center gap-4">
                <div class="flex -space-x-2">
                  @for (item of order.items.slice(0, 3); track item.product) {
                    <div class="w-12 h-12 bg-gray-100 rounded border-2 border-white overflow-hidden">
                      <img [src]="item.thumbnail || 'https://via.placeholder.com/50'" class="w-full h-full object-contain">
                    </div>
                  }
                  @if (order.items.length > 3) {
                    <div class="w-12 h-12 bg-gray-200 rounded border-2 border-white flex items-center justify-center text-sm font-medium">
                      +{{ order.items.length - 3 }}
                    </div>
                  }
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-600">{{ order.items.length }} sản phẩm</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-primary-600">{{ formatPrice(order.totalAmount) }}</p>
                </div>
              </div>
            </a>
          }
        </div>

        <!-- Pagination -->
        @if (pagination && pagination.pages > 1) {
          <div class="flex justify-center mt-6 gap-2">
            @for (page of getPages(); track page) {
              <button 
                (click)="goToPage(page)"
                [class]="page === pagination.current ? 'btn btn-primary' : 'btn btn-secondary'"
              >
                {{ page }}
              </button>
            }
          </div>
        }
      }
    </div>
  `
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  currentStatus = '';
  pagination: any;

  tabs = [
    { label: 'Tất cả', value: '' },
    { label: 'Chờ xử lý', value: 'pending' },
    { label: 'Đã xác nhận', value: 'confirmed' },
    { label: 'Đang giao', value: 'shipping' },
    { label: 'Đã giao', value: 'delivered' },
    { label: 'Đã hủy', value: 'cancelled' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(page = 1) {
    this.loading = true;
    this.orderService.getOrders(page, 10, this.currentStatus || undefined).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  filterByStatus(status: string) {
    this.currentStatus = status;
    this.loadOrders();
  }

  goToPage(page: number) {
    this.loadOrders(page);
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.pagination.pages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStatusText(status: string): string {
    const map: Record<string, string> = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipping: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('vi-VN');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
