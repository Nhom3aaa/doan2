import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgOptimizedImage],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-4 md:py-12">
      @if (loading) {
        <div class="animate-pulse">
          <div class="grid lg:grid-cols-2 gap-12">
            <div class="bg-gray-200 aspect-square rounded-3xl"></div>
            <div class="space-y-6">
              <div class="bg-gray-200 h-10 rounded-xl w-3/4"></div>
              <div class="bg-gray-200 h-8 rounded-xl w-1/2"></div>
              <div class="bg-gray-200 h-32 rounded-xl w-full"></div>
            </div>
          </div>
        </div>
      } @else if (product) {
        <!-- Breadcrumb -->
        <nav class="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <a routerLink="/" class="hover:text-primary-600 transition-colors">Trang chủ</a>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <a routerLink="/products" class="hover:text-primary-600 transition-colors">Điện thoại</a>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-slate-900 truncate max-w-[200px]">{{ product.name }}</span>
        </nav>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 pb-24 md:pb-0">
          <!-- Images Column -->
          <div class="space-y-6">
            <div class="card p-4 bg-white rounded-3xl aspect-square flex items-center justify-center relative group overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50">
              @if (selectedMediaType === 'video' && product.video) {
                <video 
                  [src]="getImageUrl(product.video)" 
                  class="w-full h-full object-contain"
                  controls 
                  autoplay
                ></video>
              } @else {
                <img 
                  [ngSrc]="getImageUrl(selectedImage || product.thumbnail || product.images[0])" 
                  fill
                  priority
                  [alt]="product.name"
                  class="object-contain transform group-hover:scale-110 transition-transform duration-500"
                  (error)="onImageError($event)"
                >
                <!-- Zoom hint -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/2 cursor-zoom-in transition-colors pointer-events-none"></div>
              }
            </div>

            @if (product.images.length > 1) {
              <div class="grid grid-cols-5 gap-4">
                @for (image of product.images; track image) {
                  <button 
                    (click)="selectImage(image)"
                    [class]="selectedMediaType === 'image' && selectedImage === image ? 'ring-2 ring-primary-600 ring-offset-2 scale-95' : 'hover:scale-105'"
                    class="card aspect-square p-2 rounded-xl bg-white border border-slate-100 transition-all duration-200 cursor-pointer overflow-hidden relative"
                  >
                    <img [ngSrc]="getImageUrl(image)" fill [alt]="product.name" class="object-contain">
                  </button>
                }
                
                @if (product.video) {
                  <button 
                    (click)="selectVideo()"
                    [class]="selectedMediaType === 'video' ? 'ring-2 ring-primary-600 ring-offset-2 scale-95' : 'hover:scale-105'"
                    class="card aspect-square p-2 rounded-xl bg-slate-50 border border-slate-100 transition-all duration-200 cursor-pointer overflow-hidden group flex items-center justify-center relative"
                  >
                    <div class="absolute inset-0 flex items-center justify-center z-10">
                      <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                    <img [src]="getImageUrl(product.thumbnail || product.images[0])" class="w-full h-full object-contain opacity-50 blur-[1px]">
                  </button>
                }
              </div>
            }
          </div>

          <!-- Info Column -->
          <div class="flex flex-col">
            <div class="mb-8">
              <div class="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-4">
                {{ product.brand }}
              </div>
              <h1 class="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 font-display">{{ product.name }}</h1>
              
              <div class="flex items-end gap-4 mb-6">
                <!-- Dynamic Price -->
                 <div class="flex flex-col">
                   <span class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                     {{ formatPrice(product.price) }}
                   </span>
                 </div>
                @if (product.originalPrice && product.originalPrice > product.price) {
                  <span class="text-xl text-slate-400 line-through mb-1.5">{{ formatPrice(product.originalPrice) }}</span>
                  <div class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg mb-2 shadow-lg shadow-red-500/30 animate-pulse">
                    -{{ getDiscount() }}%
                  </div>
                }
              </div>

               <!-- Short Description Preview -->
               @if (product.description) {
                <p class="text-slate-500 leading-relaxed mb-6 line-clamp-3">
                  {{ product.description }}
                </p>
               }
            </div>

            <div class="card p-6 lg:p-8 bg-white/50 backdrop-blur-sm border-slate-100 mb-8 space-y-8">
              <!-- Colors -->
              @if (product.colors && product.colors.length > 0) {
                <div>
                  <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <span>Màu sắc</span>
                    <span class="text-primary-600">{{ selectedColor }}</span>
                  </h3>
                  <div class="flex flex-wrap gap-3">
                    @for (color of product.colors; track color; let i = $index) {
                      <button 
                        (click)="selectColor(color, i)"
                        [class.ring-2]="selectedColor === color"
                        [class.ring-primary-600]="selectedColor === color" 
                        [class.bg-white]="selectedColor !== color"
                        [class.bg-primary-50]="selectedColor === color"
                        class="px-6 py-3 rounded-xl border border-slate-200 hover:border-primary-400 transition-all font-medium text-slate-700 hover:text-primary-600 relative overflow-hidden group"
                      >
                         {{ color }}
                         @if (selectedColor === color) {
                           <div class="absolute top-0 right-0 w-4 h-4 bg-primary-600 rounded-bl-lg">
                             <svg class="w-2.5 h-2.5 text-white absolute top-0.5 right-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                           </div>
                         }
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Quantity -->
              <div>
                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Số lượng</h3>
                <div class="flex items-center gap-6">
                  <div class="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                    <button 
                      (click)="quantity > 1 && quantity = quantity - 1"
                      class="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
                    </button>
                    <input type="text" [value]="quantity" class="w-12 text-center font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0" readonly>
                    <button 
                      (click)="quantity < product.stock && quantity = quantity + 1"
                      class="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    </button>
                  </div>
                  <span class="text-sm text-slate-500 font-medium">
                    Có sẵn: <span class="text-slate-900 font-bold">{{ product.stock }}</span>
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-lg md:static md:bg-transparent md:border-t-0 md:shadow-none md:p-0 z-40 flex flex-row gap-4">
                <button 
                  (click)="addToCart()"
                  [disabled]="addingToCart || product.stock === 0"
                  class="btn btn-secondary flex-1 py-4 text-base gap-2 group"
                >
                  <svg class="w-5 h-5 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                  {{ addingToCart ? 'Đang xử lý...' : 'Thêm vào giỏ' }}
                </button>
                <button 
                  (click)="buyNow()"
                  [disabled]="product.stock === 0"
                  class="btn btn-primary flex-[2] py-4 text-lg shadow-xl shadow-primary-600/30 gap-2 group"
                >
                  <span class="group-hover:scale-105 transition-transform">Mua ngay</span>
                  <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </button>
              </div>

               @if (message) {
                 <div class="p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2" [class]="messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'">
                   @if (messageType === 'success') {
                     <svg class="w-5 h-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                   }
                   {{ message }}
                 </div>
               }
            </div>

            <!-- Specs Summary (Optional) -->
             <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
               @if (product.specs.cpu) {
                 <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                   <div class="text-xs text-slate-400 mb-1">CPU</div>
                   <div class="font-semibold text-slate-700 text-sm line-clamp-1">{{ product.specs.cpu }}</div>
                 </div>
               }
               @if (product.specs.ram) {
                 <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                   <div class="text-xs text-slate-400 mb-1">RAM</div>
                   <div class="font-semibold text-slate-700 text-sm">{{ product.specs.ram }}</div>
                 </div>
               }
               @if (product.specs.battery) {
                 <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                   <div class="text-xs text-slate-400 mb-1">Pin</div>
                   <div class="font-semibold text-slate-700 text-sm">{{ product.specs.battery }}</div>
                 </div>
               }
               @if (product.specs.screen) {
                 <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                   <div class="text-xs text-slate-400 mb-1">Màn hình</div>
                   <div class="font-semibold text-slate-700 text-sm line-clamp-1">{{ product.specs.screen }}</div>
                 </div>
               }
             </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="mt-16 grid lg:grid-cols-3 gap-8">
           <div class="lg:col-span-2 space-y-8">
             @if (product.description) {
               <div class="card p-8 bg-white">
                 <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <span class="w-1 h-8 bg-primary-600 rounded-full"></span>
                   Mô tả chi tiết
                 </h2>
                 <div class="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                   {{ product.description }}
                 </div>
               </div>
             }
           </div>
           
           <!-- Sidebar Specs -->
           <div class="lg:col-span-1">
             <div class="card p-6 bg-white sticky top-24">
               <h3 class="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Thông số kỹ thuật</h3>
               <div class="space-y-4">
                 @if (product.specs.screen) {
                   <div class="flex justify-between items-center text-sm">
                     <span class="text-slate-500">Màn hình</span>
                     <span class="font-medium text-slate-700 text-right w-1/2">{{ product.specs.screen }}</span>
                   </div>
                 }
                 @if (product.specs.os) {
                   <div class="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg">
                     <span class="text-slate-500">HĐH</span>
                     <span class="font-medium text-slate-700">{{ product.specs.os }}</span>
                   </div>
                 }
                 @if (product.specs.camera) {
                   <div class="flex justify-between items-center text-sm">
                     <span class="text-slate-500">Camera</span>
                     <span class="font-medium text-slate-700 text-right w-1/2">{{ product.specs.camera }}</span>
                   </div>
                 }
                 @if (product.specs.cpu) {
                   <div class="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg">
                     <span class="text-slate-500">CPU</span>
                     <span class="font-medium text-slate-700 text-right w-1/2">{{ product.specs.cpu }}</span>
                   </div>
                 }
                 @if (product.specs.ram) {
                   <div class="flex justify-between items-center text-sm">
                     <span class="text-slate-500">RAM</span>
                     <span class="font-medium text-slate-700">{{ product.specs.ram }}</span>
                   </div>
                 }
                 @if (product.specs.storage) {
                   <div class="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg">
                     <span class="text-slate-500">Bộ nhớ</span>
                     <span class="font-medium text-slate-700">{{ product.specs.storage }}</span>
                   </div>
                 }
                 @if (product.specs.battery) {
                   <div class="flex justify-between items-center text-sm">
                     <span class="text-slate-500">Pin</span>
                     <span class="font-medium text-slate-700">{{ product.specs.battery }}</span>
                   </div>
                 }
               </div>
             </div>
           </div>
        </div>

        <!-- Reviews Section -->
        <div class="mt-16 bg-white rounded-3xl p-8 border border-slate-100">
          <h2 class="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <span class="w-1 h-8 bg-amber-500 rounded-full"></span>
            Đánh giá khách hàng
          </h2>

          <div class="grid lg:grid-cols-12 gap-12">
            <!-- Review Stats -->
            <div class="lg:col-span-4 space-y-6">
              <div class="text-center p-6 bg-slate-50 rounded-2xl">
                <div class="text-5xl font-bold text-slate-900 mb-2">{{ product.rating | number:'1.1-1' }}</div>
                <div class="flex justify-center gap-1 text-amber-500 mb-2">
                  @for (star of [1,2,3,4,5]; track star) {
                    <svg class="w-6 h-6" [class.text-amber-500]="star <= Math.round(product.rating)" [class.text-slate-300]="star > Math.round(product.rating)" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  }
                </div>
                <div class="text-slate-500">{{ product.numReviews }} đánh giá</div>
              </div>

              <!-- Write Review Form -->
              <div class="bg-white border-2 border-slate-100 rounded-2xl p-6">
                <h3 class="font-bold text-lg mb-4">Viết đánh giá</h3>
                
                @if (reviewMessage) {
                  <div class="mb-4 p-3 rounded-lg text-sm" [class.bg-green-50]="reviewMessage.includes('thành công')" [class.text-green-700]="reviewMessage.includes('thành công')" [class.bg-red-50]="!reviewMessage.includes('thành công')" [class.text-red-700]="!reviewMessage.includes('thành công')">
                    {{ reviewMessage }}
                  </div>
                }

                @if (!authService.isLoggedIn) {
                  <div class="text-center py-4">
                    <p class="text-slate-500 mb-3">Vui lòng đăng nhập để đánh giá</p>
                    <a routerLink="/auth/login" class="btn btn-secondary w-full">Đăng nhập ngay</a>
                  </div>
                } @else {
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium mb-2">Đánh giá của bạn</label>
                      <div class="flex gap-2">
                        @for (star of [1,2,3,4,5]; track star) {
                          <button (click)="reviewRating = star" class="text-2xl focus:outline-none transition-transform hover:scale-110" [class.text-amber-500]="star <= reviewRating" [class.text-slate-200]="star > reviewRating">★</button>
                        }
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2">Nhận xét</label>
                      <textarea [(ngModel)]="reviewComment" rows="3" class="input resize-none" placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."></textarea>
                    </div>
                    <button (click)="submitReview()" [disabled]="submittingReview" class="btn btn-primary w-full">
                      {{ submittingReview ? 'Đang gửi...' : 'Gửi đánh giá' }}
                    </button>
                  </div>
                }
              </div>
            </div>

            <!-- Review List -->
            <div class="lg:col-span-8 space-y-6">
              @if (product.reviews && product.reviews.length > 0) {
                @for (review of product.reviews; track review._id) {
                  <div class="bg-slate-50 p-6 rounded-2xl">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                          {{ review.name.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <div class="font-bold text-slate-900">{{ review.name }}</div>
                          <div class="flex text-amber-500 text-sm">
                            @for (star of [1,2,3,4,5]; track star) {
                              <span [class.text-slate-300]="star > review.rating">★</span>
                            }
                          </div>
                        </div>
                      </div>
                      <div class="text-sm text-slate-400">{{ review.createdAt | date:'dd/MM/yyyy' }}</div>
                    </div>
                    <p class="text-slate-600 leading-relaxed">{{ review.comment }}</p>
                  </div>
                }
              } @else {
                <div class="text-center py-12 text-slate-500">
                  <div class="text-4xl mb-3">💬</div>
                  Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
           <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔍</div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy sản phẩm</h2>
          <p class="text-slate-500 mb-8">Sản phẩm này có thể đã bị ngừng kinh doanh hoặc đường dẫn không đúng.</p>
          <a routerLink="/products" class="btn btn-primary shadow-lg shadow-primary-600/20">Khám phá sản phẩm khác</a>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  protected Math = Math;
  product: Product | null = null;
  loading = true;
  selectedImage = '';
  selectedColor = '';
  quantity = 1;
  addingToCart = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  selectedMediaType: 'image' | 'video' = 'image';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadProduct(params['id']);
    });
  }

  loadProduct(id: string) {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.product = res.data;
          this.selectedImage = this.product.thumbnail || this.product.images[0];
          this.selectedMediaType = 'image';
          if (this.product.colors?.length) {
            this.selectedColor = this.product.colors[0];
          }
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  selectColor(color: string, index: number) {
    this.selectedColor = color;
    // Check if there is an image at the same index
    if (this.product && this.product.images && this.product.images[index]) {
      this.selectedImage = this.product.images[index];
      this.selectedMediaType = 'image';
    }
  }

  selectImage(image: string) {
    this.selectedImage = image;
    this.selectedMediaType = 'image';
  }

  selectVideo() {
    this.selectedMediaType = 'video';
  }

  addToCart() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.addingToCart = true;
    this.message = '';

    this.cartService.addToCart(this.product!._id, this.quantity, this.selectedColor).subscribe({
      next: (res) => {
        if (res.success) {
          this.message = 'Đã thêm vào giỏ hàng!';
          this.messageType = 'success';
        } else {
          this.message = res.message || 'Có lỗi xảy ra';
          this.messageType = 'error';
        }
        this.addingToCart = false;
      },
      error: (err) => {
        this.message = err.error?.message || 'Có lỗi xảy ra';
        this.messageType = 'error';
        this.addingToCart = false;
      }
    });
  }

  buyNow() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.cartService.addToCart(this.product!._id, this.quantity, this.selectedColor).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/checkout']);
        }
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://via.placeholder.com/500x500?text=Phone';
    if (path.startsWith('http')) return path;
    
    // Normalize path (handle Windows backslash)
    const normalizedPath = path.replace(/\\/g, '/');
    const baseUrl = environment.apiUrl.replace('/api', '');
    
    // Ensure slash separation
    return normalizedPath.startsWith('/') 
      ? `${baseUrl}${normalizedPath}`
      : `${baseUrl}/${normalizedPath}`;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/500x500?text=Phone';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  getDiscount(): number {
    if (!this.product?.originalPrice) return 0;
    return Math.round((1 - this.product.price / this.product.originalPrice) * 100);
  }

  // --- REVIEW LOGIC ---
  reviewRating = 5;
  reviewComment = '';
  submittingReview = false;
  reviewMessage = '';

  submitReview() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.reviewComment.trim()) {
      this.reviewMessage = 'Vui lòng nhập nội dung đánh giá';
      return;
    }

    this.submittingReview = true;
    this.reviewMessage = '';

    this.productService.createReview(this.product!._id, {
      rating: this.reviewRating,
      comment: this.reviewComment
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.reviewMessage = 'Đánh giá thành công!';
          // Reload product to see new review
          this.loadProduct(this.product!._id);
          this.reviewComment = '';
          this.reviewRating = 5;
        }
        this.submittingReview = false;
      },
      error: (err) => {
        this.reviewMessage = err.error?.message || 'Có lỗi xảy ra';
        this.submittingReview = false;
      }
    });
  }
}
