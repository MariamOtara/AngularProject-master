import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiAuth } from '../services/api-auth';
import { Router } from '@angular/router';;

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class Signin {
     signInForm: FormGroup;
   constructor (
   private apiAuth : ApiAuth,
   private router : Router,
   private fb: FormBuilder
  ) {

this.signInForm = this.fb.group ({
  firstName: ["", [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
  lastName: ["",[Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
  email: ["", [Validators.required, Validators.email]],
  password: ["", [Validators.required,Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/)
  ]]
})

}
showResendButton = false
  register(){
console.log(this.signInForm.value);
console.log(this.signInForm.invalid);

    if (this.signInForm.valid) {
    this.apiAuth.register(this.signInForm.value).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.apiAuth.registern8n(this.signInForm.value).subscribe({
          next: (n8nResp) => console.log('Данные продублированы в n8n:', n8nResp),
          error: (n8nErr) => console.error('Ошибка отправки в n8n:', n8nErr)
        });
        this.router.navigateByUrl('/verifyemail')
        localStorage.setItem('email', this.signInForm.value.email)
      },
      error: (er) => {
        if (er.error.detail.includes('already exists')) {
          this.showResendButton = true;
        }
        alert(er.error.detail);
      }
    });
  }
}

}