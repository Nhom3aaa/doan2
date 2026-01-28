import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipper-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-blue-600 text-white shadow-lg">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <a routerLink="/shipper" class="text-xl font-bold">Shipper Portal</a>
          <div class="flex space-x-4">
            <a routerLink="/shipper" class="hover:text-blue-200">Đơn hàng của tôi</a>
            <a routerLink="/profile" class="hover:text-blue-200">Tài khoản</a>
          </div>
        </div>
      </nav>
      <div class="container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class ShipperLayoutComponent {}
