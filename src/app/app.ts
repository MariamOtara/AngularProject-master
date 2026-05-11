import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { ApiAuth } from './services/api-auth';


@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  private apiAuth = inject(ApiAuth);
  private router = inject(Router);
  protected readonly title = signal('AngularProject');
   
  ngOnInit(): void {
    this.checkAndRefreshSession();
  }
   checkAndRefreshSession() {
    const oldToken = localStorage.getItem('refreshToken');
    
    if (!oldToken) {
    console.log('Пользователь не авторизован, сессия не продлена');
    return;
  }
    
   this.apiAuth.refreshAccessToken({ token: oldToken }).subscribe({
  next: (response: any) => {
    const newToken = response?.data?.accessToken ?? response?.accessToken ?? response?.refreshToken;
    const newRefreshToken = response?.data?.refreshToken ?? response?.refreshToken;

    if (newToken) {
      localStorage.setItem('token', newToken);
      console.log('Сессия автоматически продлена');
    }

    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }

    if (!newToken) {
      console.warn('Токен не найден в ответе сервера', response);
    }
  },
  error: (err: any) => {
    console.error('Ошибка при обновлении токена:', err);
    localStorage.removeItem('token');       
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
});}


  handleSubscribe(): void {
    
    console.log('Subscribe button clicked!');
  }
 
}
