import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Slider -->
    <section class="relative bg-slate-900 text-white min-h-[600px] flex items-center overflow-hidden group">
      <!-- Background Effects -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <!-- Slides -->
      @for (slide of slides; track $index) {
        <div 
          class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          [class.opacity-100]="currentSlide === $index"
          [class.opacity-0]="currentSlide !== $index"
          [class.z-10]="currentSlide === $index"
          [class.z-0]="currentSlide !== $index"
        >
          @if (slide.type === 'banner') {
             <div class="w-full h-full relative group">
               <img [src]="slide.image" class="w-full h-full object-cover lg:object-fill" alt="Banner">
               <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
             </div>
          } @else {
             <!-- Legacy Slide Content -->
             <div class="absolute inset-0 flex items-center bg-slate-900">
                <div class="max-w-7xl mx-auto px-4 w-full">
                  <div class="grid lg:grid-cols-2 gap-12 items-center">
                    <div class="space-y-8 text-center lg:text-left">
                       <h1 class="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                         <span class="block text-white">{{ slide.title1 }}</span>
                         <span class="text-transparent bg-clip-text bg-gradient-to-r" [ngClass]="slide.gradientClass">
                           {{ slide.title2 }}
                         </span>
                       </h1>
                       <p class="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">{{ slide.description }}</p>
                       <a routerLink="/products" class="btn btn-primary px-8 py-4 shadow-xl">{{ slide.ctaText }}</a>
                    </div>
                    <div class="hidden lg:flex justify-center relative">
                       <span class="text-[15rem] filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] animate-float">{{ slide.imageEmoji }}</span>
                    </div>
                  </div>
                </div>
             </div>
          }
        </div>
      }

      <!-- Indicators -->
      <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        @for (slide of slides; track $index) {
          <button 
            (click)="setSlide($index)"
            class="h-1.5 rounded-full transition-all duration-300"
            [ngClass]="currentSlide === $index ? 'w-8 bg-white' : 'w-4 bg-white/40'">
          </button>
        }
      </div>
      
      <!-- Arrows -->
      <button (click)="prevSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/10 hover:bg-black/30 text-white backdrop-blur-sm transition-colors z-20 hidden group-hover:block">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button (click)="nextSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/10 hover:bg-black/30 text-white backdrop-blur-sm transition-colors z-20 hidden group-hover:block">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </section>

    <!-- Brands -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <p class="text-center text-slate-500 font-medium mb-8">Đối tác chính thức của các thương hiệu hàng đầu</p>
        <div class="flex flex-wrap justify-center items-center gap-4 lg:gap-8">
          @for (brand of brands; track brand) {
            <a 
              [routerLink]="['/products']" 
              [queryParams]="{brand: brand}"
              class="group relative px-8 py-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 border border-slate-100 hover:border-primary-100 min-w-[120px] text-center"
            >
              <span class="text-lg font-bold text-slate-600 group-hover:text-primary-600 transition-colors">{{ brand }}</span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 class="text-4xl font-bold text-slate-900 mb-4">Sản phẩm nổi bật</h2>
            <div class="h-1 w-20 bg-primary-500 rounded-full"></div>
          </div>
          <a routerLink="/products" class="group flex items-center font-semibold text-primary-600 hover:text-primary-700">
            Xem tất cả 
            <span class="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        @if (loading) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            @for (i of [1,2,3,4]; track i) {
              <div class="card p-4 animate-pulse h-[400px]">
                <div class="bg-gray-200 h-48 rounded-2xl mb-4"></div>
                <div class="space-y-3">
                  <div class="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div class="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            @for (product of featuredProducts; track product._id) {
              <a [routerLink]="['/products', product._id]" class="card group h-full flex flex-col relative overflow-hidden">
                <!-- Badge -->
                @if (product.originalPrice && product.originalPrice > product.price) {
                  <div class="absolute top-4 left-4 z-10">
                    <span class="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
                      -{{ getDiscount(product) }}%
                    </span>
                  </div>
                }

                <!-- Image -->
                <div class="aspect-[4/3] p-6 bg-gray-50 relative overflow-hidden group-hover:bg-primary-50/30 transition-colors duration-300">
                  <img 
                    [src]="getImageUrl(product.thumbnail || product.images[0])" 
                    [alt]="product.name"
                    class="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-sm group-hover:drop-shadow-xl"
                    (error)="onImageError($event)"
                  >
                  
                  <!-- Quick Action Overlay - Visible on Hover (Desktop) -->
                  <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden lg:block">
                    <button class="btn btn-primary w-full shadow-xl">Xem chi tiết</button>
                  </div>
                </div>

                <!-- Content -->
                <div class="p-6 flex flex-col flex-1">
                  <div class="mb-auto">
                    <p class="text-sm font-medium text-primary-600 mb-2">{{ product.brand }}</p>
                    <h3 class="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{{ product.name }}</h3>
                    
                    <!-- Rating & Sold -->
                    <div class="flex items-center justify-between text-xs mb-3">
                       <div class="flex items-center text-amber-500 gap-1">
                         <span class="font-bold">{{ product.rating | number:'1.1-1' }}</span>
                         <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                         <span class="text-slate-400">({{ product.numReviews }})</span>
                       </div>
                       <span class="text-slate-500">Đã bán {{ product.sold || 0 }}</span>
                    </div>
                  </div>
                  
                  <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div class="flex flex-col">
                      <span class="text-lg font-bold text-slate-900">{{ formatPrice(product.price) }}</span>
                      @if (product.originalPrice && product.originalPrice > product.price) {
                        <span class="text-sm text-slate-400 line-through">{{ formatPrice(product.originalPrice) }}</span>
                      }
                    </div>
                    <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </section>

    <!-- Features -->
    <section class="py-24 bg-white relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute top-0 left-0 w-64 h-64 bg-slate-50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-primary-50/50 rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div class="max-w-7xl mx-auto px-4 relative z-10">
        <div class="grid md:grid-cols-4 gap-8 lg:gap-12">
          <div class="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
            <div class="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition-transform duration-300 text-4xl">
              🚚
            </div>
            <h3 class="font-bold text-xl mb-3 text-slate-900">Giao hàng siêu tốc</h3>
            <p class="text-slate-500 leading-relaxed">Nhận hàng trong 2h nội thành Hà Nội & TP.HCM</p>
          </div>
          <div class="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
            <div class="w-20 h-20 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:-rotate-6 transition-transform duration-300 text-4xl">
              ✅
            </div>
            <h3 class="font-bold text-xl mb-3 text-slate-900">Cam kết chính hãng</h3>
            <p class="text-slate-500 leading-relaxed">Phát hiện hàng giả đền bù gấp 10 lần giá trị</p>
          </div>
          <div class="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
             <div class="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition-transform duration-300 text-4xl">
              🔄
            </div>
            <h3 class="font-bold text-xl mb-3 text-slate-900">30 ngày đổi trả</h3>
            <p class="text-slate-500 leading-relaxed">Lỗi là đổi mới, thủ tục đơn giản nhanh chóng</p>
          </div>
          <div class="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
             <div class="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:-rotate-6 transition-transform duration-300 text-4xl">
              💬
            </div>
            <h3 class="font-bold text-xl mb-3 text-slate-900">Hỗ trợ tận tâm</h3>
            <p class="text-slate-500 leading-relaxed">Đội ngũ kỹ thuật hỗ trợ 24/7 trọn đời sản phẩm</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  brands: string[] = [];
  loading = true;
  
  // Slide Logic
  currentSlide = 0;
  slideInterval: any;
  
  slides: any[] = [
    {
      type: 'banner',
      image: 'https://shopdunk.com/images/thumbs/0021962_iphone-15-nam-nay-duoc-nhieu-chuyen-gia-danh-gia-cao_1600.png',
      title1: 'iPhone 15',
      title2: 'Sẵn sàng',
      description: 'Thiết kế mới, Camera 48MP. Trải nghiệm ngay hôm nay.',
      ctaText: 'Mua ngay'
    },
    {
      type: 'banner',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop',
      title1: 'Công nghệ',
      title2: 'Đỉnh cao 2024',
      description: 'Khám phá iPhone 15 Series, Samsung Z Fold5 và các dòng Flagship mới nhất.',
      ctaText: 'Mua ngay'
    },
    {
      type: 'banner',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
      title1: 'Chiến Game',
      title2: 'Không giới hạn',
      description: 'PC Gaming, Laptop cấu hình khủng, tản nhiệt siêu tốc.',
      ctaText: 'Khám phá ngay'
    },
    {
      type: 'banner',
      image: 'https://cdn.tgdd.vn/Files/2023/09/13/1547133/1-300923-014812.jpg',
      title1: 'Ưu đãi',
      title2: 'Đặc biệt',
      description: 'Cập nhật tin tức và khuyến mãi mới nhất tại hệ thống.',
      ctaText: 'Xem ngay'
    },
    {
      type: 'banner',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop',
      title1: 'iPhone 15 Pro',
      title2: 'Titanium',
      description: 'Thiết kế Titan bền bỉ nhẹ nhàng. Chip A17 Pro mạnh mẽ nhất.',
      ctaText: 'Mua iPhone 15'
    }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadFeaturedProducts();
    this.loadBrands();
    this.startSlideShow();
  }
  
  ngOnDestroy() {
    this.stopSlideShow();
  }

  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 10000); // 10 seconds
  }
  
  stopSlideShow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }
  
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
  
  setSlide(index: number) {
    this.currentSlide = index;
    // Reset timer when manually interacting
    this.stopSlideShow();
    this.startSlideShow();
  }

  loadFeaturedProducts() {
    this.productService.getFeaturedProducts().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.featuredProducts = res.data.products;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadBrands() {
    this.productService.getBrands().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.brands = res.data;
        }
      }
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://via.placeholder.com/300x300?text=Phone';
    if (path.startsWith('http')) return path;
    return environment.apiUrl.replace('/api', '') + path;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Phone';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  getDiscount(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round((1 - product.price / product.originalPrice) * 100);
  }
}
