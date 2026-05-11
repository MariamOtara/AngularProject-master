import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Api } from '../services/api';
import { CartService } from '../services/cart-service';
import { ProductsClass, Categories } from '../models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  featuredProducts: ProductsClass[] = [];
  categories = Categories.list;
  quantity: number = 1;
  loading = false;

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.loading = true;
    this.api.getDatafromApi('api/products?Take=6&Page=1').subscribe({
      next: (response: any) => {
        this.featuredProducts = response.data || [];
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load featured products', err);
        this.loading = false;
      }
    });
  }

  addProductToCart(productId: number, quantity: number): void {
    this.cartService.addProductToCart(productId, quantity);
  }
}
