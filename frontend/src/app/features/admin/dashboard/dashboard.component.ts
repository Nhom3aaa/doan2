import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  template: `
    <div>
      <div class="mb-8">
        <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">Dashboard Overview</h2>
        <p class="text-slate-500 mt-1">Hệ thống quản lý bán hàng Chung Mobile.</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6 border-l-4 border-primary-500 bg-gradient-to-br from-white to-primary-50/50 hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-500 font-medium text-sm uppercase tracking-wide">Tổng đơn hàng</p>
              <p class="text-3xl font-extrabold mt-2 text-slate-800">{{ stats.totalOrders || 0 }}</p>
              <div class="flex items-center mt-2 text-xs text-green-600 bg-green-100 w-fit px-2 py-1 rounded-full">
                <span>↑ 12%</span>
                <span class="ml-1">tuần này</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center text-2xl shadow-sm">
              📦
            </div>
          </div>
        </div>

        <div class="card p-6 border-l-4 border-green-500 bg-gradient-to-br from-white to-green-50/50 hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-500 font-medium text-sm uppercase tracking-wide">Doanh thu</p>
              <p class="text-2xl font-extrabold mt-2 text-slate-800">{{ formatPrice(stats.totalRevenue || 0) }}</p>
              <div class="flex items-center mt-2 text-xs text-green-600 bg-green-100 w-fit px-2 py-1 rounded-full">
                <span>↑ 8.5%</span>
                <span class="ml-1">tháng này</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-2xl shadow-sm">
              💰
            </div>
          </div>
        </div>

        <div class="card p-6 border-l-4 border-yellow-500 bg-gradient-to-br from-white to-yellow-50/50 hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-500 font-medium text-sm uppercase tracking-wide">Chờ xử lý</p>
              <p class="text-3xl font-extrabold mt-2 text-yellow-600">{{ getPendingCount() }}</p>
              <div class="flex items-center mt-2 text-xs text-yellow-600 bg-yellow-100 w-fit px-2 py-1 rounded-full">
                <span>Cần xử lý ngay</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl shadow-sm">
              ⏳
            </div>
          </div>
        </div>

        <div class="card p-6 border-l-4 border-purple-500 bg-gradient-to-br from-white to-purple-50/50 hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-500 font-medium text-sm uppercase tracking-wide">Khách hàng</p>
              <p class="text-3xl font-extrabold mt-2 text-slate-800">{{ userStats.totalUsers || 0 }}</p>
              <div class="flex items-center mt-2 text-xs text-purple-600 bg-purple-100 w-fit px-2 py-1 rounded-full">
                <span>+5 mới</span>
                <span class="ml-1">hôm nay</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl shadow-sm">
              👥
            </div>
          </div>
        </div>
      </div>

      <!-- Charts & Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Main Chart -->
        <div class="lg:col-span-2 card p-6 shadow-md border-0 ring-1 ring-slate-100">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-lg text-slate-800">Biểu đồ doanh thu</h3>
            <select class="text-sm border-gray-200 rounded-lg focus:ring-primary-500">
              <option>7 ngày qua</option>
              <option>Tháng này</option>
              <option>Năm nay</option>
            </select>
          </div>
          <div class="h-80 w-full">
            <canvas baseChart
              [data]="barChartData"
              [options]="barChartOptions"
              [type]="barChartType">
            </canvas>
          </div>
        </div>

        <!-- Side Chart -->
        <div class="card p-6 shadow-md border-0 ring-1 ring-slate-100">
          <h3 class="font-bold text-lg text-slate-800 mb-6">Tỷ lệ đơn hàng</h3>
          <div class="h-64 relative flex items-center justify-center">
             <canvas baseChart
              [data]="pieChartData"
              [options]="pieChartOptions"
              [type]="pieChartType">
            </canvas>
          </div>
          <div class="mt-6 space-y-3">
            @for (stat of stats.statusStats || []; track stat._id) {
               <div class="flex items-center justify-between text-sm">
                 <div class="flex items-center gap-2">
                   <span class="w-3 h-3 rounded-full" [ngClass]="getStatusColor(stat._id)"></span>
                   <span class="text-slate-600">{{ getStatusText(stat._id) }}</span>
                 </div>
                 <span class="font-bold text-slate-800">{{ stat.count }}</span>
               </div>
            }
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8">
        <h3 class="font-bold text-lg text-slate-800 mb-4">Thao tác nhanh</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <a routerLink="/admin/products" class="group p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer">
            <div class="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📱</div>
            <div>
              <p class="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">Sản phẩm</p>
              <p class="text-xs text-slate-500">Quản lý kho hàng</p>
            </div>
          </a>
          <a routerLink="/admin/orders" class="group p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-green-500 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer">
            <div class="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📦</div>
            <div>
              <p class="font-bold text-slate-800 group-hover:text-green-600 transition-colors">Đơn hàng</p>
              <p class="text-xs text-slate-500">Xử lý đơn mới</p>
            </div>
          </a>
          <a routerLink="/admin/users" class="group p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer">
            <div class="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">👥</div>
            <div>
              <p class="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Người dùng</p>
              <p class="text-xs text-slate-500">Quản lý tài khoản</p>
            </div>
          </a>
          <a routerLink="/admin/chat" class="group p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-pink-500 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer">
            <div class="w-12 h-12 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">💬</div>
            <div>
              <p class="font-bold text-slate-800 group-hover:text-pink-600 transition-colors">Hỗ trợ</p>
              <p class="text-xs text-slate-500">Chat với khách hàng</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  userStats: any = {};

  constructor(
    private orderService: OrderService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.orderService.getOrderStats().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.stats = res.data;
          this.updateCharts();
        }
      }
    });

    this.http.get<any>(`${environment.apiUrl}/users/stats/overview`).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.userStats = res.data;
        }
      }
    });
  }

  getPendingCount(): number {
    const pending = this.stats.statusStats?.find((s: any) => s._id === 'pending');
    return pending?.count || 0;
  }

  getStatusText(status: string): string {
    const map: Record<string, string> = {
      pending: 'Chờ xử lý', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy'
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', 
      shipping: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-yellow-500', confirmed: 'bg-blue-500', 
      shipping: 'bg-purple-500', delivered: 'bg-green-500', cancelled: 'bg-red-500'
    };
    return map[status] || 'bg-gray-500';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  // Charts
  public barChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  public pieChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };

  updateCharts() {
    // Pie Chart: Order Status
    if (this.stats.statusStats) {
      const labels = this.stats.statusStats.map((s: any) => this.getStatusText(s._id));
      const data = this.stats.statusStats.map((s: any) => s.count);
      
      this.pieChartData = {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#FCD34D', '#60A5FA', '#A78BFA', '#34D399', '#F87171']
        }]
      };
    }

    // Bar Chart: Revenue (Mock data for demo as API doesn't return daily revenue yet)
    // In a real app, backend should provide this.
    // We will simulate last 7 days revenue.
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    this.barChartData = {
      labels: days,
      datasets: [
        { data: [65000000, 59000000, 80000000, 81000000, 56000000, 55000000, 40000000], label: 'Doanh thu (VND)', backgroundColor: '#3B82F6' }
      ]
    };
  }
}
