import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShipperGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isShipper) {
      return true;
    }

    // Nếu đã đăng nhập nhưng không phải shipper, về trang chủ
    if (this.authService.isLoggedIn) {
      return this.router.createUrlTree(['/']);
    }

    // Chưa đăng nhập thì về login
    return this.router.createUrlTree(['/auth/login']);
  }
}
