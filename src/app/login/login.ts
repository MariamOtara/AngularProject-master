import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiAuth } from '../services/api-auth';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  userId!: number;
  email: string = '';
  password: string = '';

  constructor(
    private apiAuth: ApiAuth,
    private router: Router,
    private auth: Auth
  ) {}

  login(form: any) {
    if (!this.email || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    this.apiAuth.login({ credentials: { email: this.email, password: this.password } }).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        if (response.data && response.data.accessToken) {
          this.auth.signIn(response.data);
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('email', this.email);
          console.log('Token saved:', response.data.accessToken);
          this.userId = response.data.id;

          // Fetch profile data before navigating
          this.apiAuth.getDatafromApiProfile({ token: response.data.accessToken }).subscribe({
            next: (profileResponse: any) => {
              this.auth.setProfileData(profileResponse);
              this.router.navigate(['/profile']);
            },
            error: (err: any) => {
              console.error('Failed to fetch profile:', err);
              // Still navigate, let profile handle it
              this.router.navigate(['/profile']);
            }
          });
        }
      },
      error: (err) => {
        const errorMessage = err.error?.detail || err.detail || '';
        console.log('Detected Error Message:', errorMessage);
        if (errorMessage.includes('Please check your email for verification code')) {
          this.router.navigate(['/verifyemail'], { queryParams: { email: this.email } });
        } else {
          alert('Ошибка входа: ' + (errorMessage || 'Неверные данные'));
          console.error(err);
        }
      }
    });
  }

  forgotpassword() {
    if (!this.email) {
      alert('Введите Email');
      return;
    }

    this.apiAuth.forgotpassword(this.email).subscribe({
      next: () => {
        alert('Инструкции отправлены. Пожалуйста, следуйте ссылке в письме для установки нового пароля. После этого вернитесь сюда для входа.');
        this.router.navigate(['/resetpassword']);
      },
      error: (err) => alert('Ошибка отправки')
    });
  }
}
