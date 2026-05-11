import { Component, OnInit ,inject, signal} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../services/auth';
import { ApiAuth } from '../services/api-auth';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {  
 
  
  private auth = inject(Auth);
  private router = inject(Router);
  private apiAuth = inject(ApiAuth);
  private cartService = inject(CartService);

  cart = this.cartService.cart;
  isLoggedIn = this.auth.isAuth; 
  userData = this.auth.profileData;
  isMenuOpen = signal(false);

constructor() {}
  // header.ts
ngOnInit() {
  if (this.isLoggedIn()) {
    // Загружаем данные пользователя
    this.apiAuth.getDatafromApiMe().subscribe({
      next: (response) => {
        this.auth.signIn(response.data);
        // СРАЗУ ПОСЛЕ ВХОДА ЗАГРУЖАЕМ КОРЗИНУ
        this.cartService.loadCart(); 
      },
      error: () => this.logoutFunc()
    });
    
    // Также можно вызвать здесь на случай, если профиль уже есть
    this.cartService.loadCart();
  }
}

  logoutFunc() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}