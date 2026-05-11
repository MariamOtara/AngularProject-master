import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import{CartItem, CartClass} from '../models/product';
import { from } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { CartService } from '../services/cart-service';


@Component({
  selector: 'app-cart',
  imports: [RouterModule, CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit{

  constructor(
    private api: Api, 
    private cdr: ChangeDetectorRef,
    public cartService: CartService) {}


ngOnInit() {
    this.cartService.loadCart();
  }

nextPage() {
  this.cartService.nextPage();
}
prevPage() {
  this.cartService.prevPage();
}
// cartData?: Cart; 
// cartItems: any;
//   constructor(
//     private api: Api, 
//     private cdr: ChangeDetectorRef,
    
//   ) {}

//   ngOnInit() {
//     this.loadCart();
//   }


//    loadCart():void {
  
// this.api.getDatafromApi(`api/cart`).subscribe({
//     next: (response: any) => {
//       console.log(response.data);
//       this.cartData = response.data;
//       console.log('Данные загружены:', this.cartData);
//       this.cdr.detectChanges();
      
// },
//     error: (err): void => {
//       alert('Failed to load cart');
   
//     }
//   });  
//    }

// addProductToCart(productId: number, quantity: number): void {
//   this.api.addToCart(productId, quantity).subscribe({
//     next: (response) => {
//       console.log('Product added to cart:', response);
//       this.loadCart();
//     },
//     error: (err) => {
//       console.error('Failed to add product to cart:', err);
//       alert('Failed to add product to cart');
//     }
//   });
// }



 

}
