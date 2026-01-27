import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center space-x-2">
            <span class="text-4xl">📱</span>
            <span class="text-2xl font-bold text-primary-600">Chung Mobile</span>
          </a>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">Đăng nhập</h2>
          <p class="mt-2 text-gray-600">
            Chưa có tài khoản? 
            <a routerLink="/auth/register" class="text-primary-600 hover:underline">Đăng ký ngay</a>
          </p>
        </div>

        <div class="card p-8">
          @if (error) {
            <div class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{{ error }}</div>
          }

          <form (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email"
                class="input" 
                placeholder="email@example.com"
                required
              >
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password"
                class="input" 
                placeholder="••••••••"
                required
              >
            </div>

            <button 
              type="submit" 
              class="btn btn-primary w-full py-3"
              [disabled]="loading"
            >
              {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </button>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng</span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-4">
              <a href="http://localhost:5001/api/auth/google" class="group relative w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-md hover:border-gray-400 transition-all duration-200">
                <span class="absolute left-4 flex items-center">
                  <svg class="h-5 w-5" viewBox="0 0 24 24">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </span>
                <span>Google</span>
              </a>

              <a href="http://localhost:5001/api/auth/facebook" class="group relative w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl bg-[#1877F2] text-sm font-semibold text-white hover:bg-[#166fe5] hover:shadow-md transition-all duration-200">
                <span class="absolute left-4 flex items-center">
                  <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span>Facebook</span>
              </a>
            </div>
          </div>

          <div class="mt-6 text-center text-sm text-gray-500">
            <p>Tài khoản demo:</p>
            <p>Admin: admin&#64;chungmobile.com / admin123</p>
            <p>User: user&#64;example.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/']);
        } else {
          this.error = res.message || 'Đăng nhập thất bại';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Đăng nhập thất bại';
        this.loading = false;
      }
    });
  }
}
