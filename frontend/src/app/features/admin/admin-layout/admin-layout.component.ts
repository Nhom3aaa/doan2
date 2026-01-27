import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Sidebar -->
      <aside class="w-72 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-2xl relative z-20">
        <!-- Logo Area -->
        <div class="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <a routerLink="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span class="text-2xl">📱</span>
            </div>
            <div>
              <h1 class="text-lg font-bold tracking-tight">Chung Mobile</h1>
              <p class="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Admin Portal</p>
              <!-- Updated Brand Name -->
            </div>
          </a>
        </div>

        <!-- Nav -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-2">Tổng quan</div>
          
          <a routerLink="/admin" routerLinkActive="bg-primary-600 text-white shadow-lg shadow-primary-600/20" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
            <span class="p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">📊</span>
            <span class="font-medium">Dashboard</span>
          </a>

          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">Quản lý</div>

          <a routerLink="/admin/products" routerLinkActive="bg-primary-600 text-white shadow-lg shadow-primary-600/20"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
            <span class="p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">📱</span>
            <span class="font-medium">Sản phẩm</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="bg-primary-600 text-white shadow-lg shadow-primary-600/20"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
            <span class="p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">📦</span>
            <span class="font-medium">Đơn hàng</span>
          </a>
          <a routerLink="/admin/users" routerLinkActive="bg-primary-600 text-white shadow-lg shadow-primary-600/20"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
            <span class="p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">👥</span>
            <span class="font-medium">Người dùng</span>
          </a>
          <a routerLink="/admin/chat" routerLinkActive="bg-primary-600 text-white shadow-lg shadow-primary-600/20"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
            <span class="p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">💬</span>
            <span class="font-medium">Chat hỗ trợ</span>
          </a>
        </nav>

        <!-- Bottom Actions -->
        <div class="p-4 border-t border-slate-800 bg-slate-900/50">
          <a routerLink="/" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all border border-slate-700/50 hover:border-slate-600">
            <span>🌐</span>
            <span class="font-medium">Về trang chủ</span>
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col h-screen overflow-hidden relative">
        <!-- Top Header -->
        <header class="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 class="text-2xl font-bold text-slate-800">Tổng quan</h2>
            <p class="text-sm text-slate-500">Chào mừng trở lại, {{ authService.currentUser?.name }}!</p>
          </div>
          
          <div class="flex items-center gap-4">
            <button class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-primary-600 transition-colors shadow-sm relative">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div class="h-8 w-px bg-slate-200 mx-2"></div>
            <div class="flex items-center gap-3 pl-2 py-1 pr-4 rounded-full bg-white border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {{ authService.currentUser?.name?.charAt(0)?.toUpperCase() }}
              </div>
              <span class="text-sm font-semibold text-slate-700 hidden md:block">{{ authService.currentUser?.name }}</span>
            </div>
          </div>
        </header>

        <!-- Content Scroll Area -->
        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  constructor(public authService: AuthService) {}
}
