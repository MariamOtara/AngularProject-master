import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiAuth } from '../services/api-auth';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './resetpassword.html',
  styleUrls: ['./resetpassword.scss'],
})
export class Resetpassword implements OnInit {
  token = signal<string>('');
  newPassword = signal<string>('');
  isLoading = signal<boolean>(false);

  private route = inject(ActivatedRoute);
  private apiAuth = inject(ApiAuth);
  public router = inject(Router);

  ngOnInit() {
    // 1. Try to get token from URL (e.g., ?token=abc)
    const urlToken = this.route.snapshot.queryParamMap.get('token');
    
    // 2. Try to get token from the Service Signal
    const serviceTokenValue = this.apiAuth.resetToken(); 

    if (urlToken) {
      this.token.set(urlToken);
    } else if (serviceTokenValue) {
      this.token.set(serviceTokenValue);
    }
  }

  resetpassword() {
    const currentToken = this.token();
    const currentPassword = this.newPassword();

    if (!currentToken) {
      alert('Ошибка: Токен отсутствует.');
      return;
    }

    if (currentPassword.length < 6) {
      alert('Пароль должен быть не менее 6 символов');
      return;
    }

    this.isLoading.set(true);

    this.apiAuth.resetpassword({ 
      token: currentToken, 
      newPassword: currentPassword 
    }).subscribe({
      next: () => {
        alert('Пароль успешно изменен!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.detail || 'Ошибка при сбросе пароля');
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false)
    });
  }
}