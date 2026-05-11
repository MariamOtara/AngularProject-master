import { Component , OnInit} from '@angular/core';
import { ApiAuth } from '../services/api-auth';
import { ActivatedRoute, Router } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verifyemail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './verifyemail.html',
  styleUrls: ['./verifyemail.scss'],
})
export class Verifyemail implements OnInit {
  email: string = localStorage.getItem('email') || '';
  verificationCode: string = '';

  constructor(
    private apiAuth: ApiAuth,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    // this.route.queryParamMap.subscribe(params => {
    //   this.email = params.get('email') || '';
      
      
    //   const tokenFromUrl = params.get('token');
    //   if (tokenFromUrl) {
    //     this.verificationCode = tokenFromUrl;
    //     this.verifyByCode();
    //   }
    // });
  }

 verifyByCode() {
  const payload = { 
    email: this.email.trim(), 
    code: this.verificationCode.trim()
  };
  console.log('Отправляемые данные:', payload);

 
    this.apiAuth.emailVerification(payload).subscribe({
      next: () => {
        alert('Почта подтверждена! Теперь вы можете войти.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log('Детали ошибки:', err.error);
        alert(err.error?.detail ||'Неверный код или срок действия истек');
      }
    });
  }

  resend() {
    if (!this.email) {
      alert('Email не найден');
      return;
    }
    this.apiAuth.resendEmailVerification(this.email).subscribe({
      next: () => alert('Новый код отправлен на почту'),
      error: (err) => alert('Ошибка при отправке')
    });
  }
}
