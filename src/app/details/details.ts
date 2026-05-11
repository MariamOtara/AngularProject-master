import { ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import { Api } from '../services/api';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart-service';


@Component({
  selector: 'app-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './details.html',
  styleUrl: './details.scss',
  
})
export class Details implements OnInit{

  selectedID: string = "";
  data: any; 
  quantity: number = 1;


  constructor(
    private route :ActivatedRoute, 
    private api: Api, 
    private cdr : ChangeDetectorRef, 
   

    @Inject(CartService) private cartService: CartService
  ){}   
    
   ngOnInit(): void {
    // Use route to extract query params (e.g., id)
    this.route.queryParams.subscribe(params => {
      this.selectedID = params['id'];
      console.log('Selected ID:', this.selectedID);
      this.loadProductDetails();
    });
  }
      private loadProductDetails(): void {
    this.api.getDatafromApi(`api/products/${this.selectedID}`).subscribe({
      next: (response: any) => {
        console.log(response.data);
        this.data = response.data;
        this.cdr.detectChanges();
      },
      error: (_err): void => {  
        alert('Failed to load product details');
      }
    });
  }
    increment() {
    if (this.quantity < 100) {
      this.quantity++;
    }
  }

  decrement() {
    if (this.quantity > 1) { 
      this.quantity--;
    }
  }

  // addToCart(productId: number) {
  // this.cartService.addToCart(productId, this.quantity).subscribe(() => {
  //   this.cartService.loadCart(); 
  // });}

  addProductToCart(productId: number, quantity: number) {
  this.cartService.addProductToCart(productId, quantity);
}
}
