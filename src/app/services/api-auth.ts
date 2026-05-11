import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Auth } from './auth';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiAuth {

  usersEditProfile(firstName: string, lastName: string, picture: string, phoneNumber: string, address: string, age: number) {
    const token = localStorage.getItem('token');
    const body = {
      firstName,
      lastName,
      picture,
      phoneNumber,
      address,
      age
    };
    return this.http.put(`${this.apiUrl}api/users/profile`, body, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }
  private apiUrl = 'https://restaurantapi.stepacademy.ge/'

  public resetToken = signal<string | null>(null);

  constructor (private http: HttpClient){} 

    login({ credentials }: { credentials: { email: string; password: string; }; }) {
  return this.http.post(`${this.apiUrl}api/auth/login`, credentials, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}
 
  register(userData: { email: string; password: string; firstName: string; lastName:string}) {
    return this.http.post(`${this.apiUrl}api/auth/register`, userData);
 
}  

  resendEmailVerification(email: string){
    return this.http.post(`${this.apiUrl}api/auth/resend-email-verification/${(email)}`, {});
  }  

  emailVerification(data: { email: string, code: string }) {
    const body = {
    email: data.email,
    code: data.code
    };
    return this.http.put(`${this.apiUrl}api/auth/verify-email`, body);
}


refreshAccessToken({ token }: { token: string; }): import("rxjs").Observable<Object> {
   const encodedToken = encodeURIComponent(token);
  return this.http.post(`${this.apiUrl}api/auth/refresh-access-token/${encodedToken}`, {});
}


forgotpassword(email: string) {
    return this.http.post<any>(`${this.apiUrl}api/auth/forgot-password/${email}`, {}).pipe(
      tap(res => {
        if (res && res.data) {
          this.resetToken.set(res.data);
        }
      })
    );
  }

resetpassword(data: { token: string, newPassword: string }) {
    // Note: Use the property names expected by your Backend (Token/NewPassword)
    const body = {
      Token: data.token,
      NewPassword: data.newPassword
    };
    return this.http.put(`${this.apiUrl}api/auth/reset-password`, body);
  }

getDatafromApiProfile({ token }: { token: string; }): any {
  
  return this.http.get(`${this.apiUrl}api/users/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'X-API-KEY': 'ваш_ключ_из_swagger'
    }
  });
}

getDatafromApiMe() {
  const token = localStorage.getItem('token');
  return this.http.get<{data: any, meta: any}>(`${this.apiUrl}api/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

}
