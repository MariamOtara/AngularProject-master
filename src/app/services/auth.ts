import { Injectable, signal, computed } from '@angular/core';
import { ProfileData } from '../models/product';
import {UserMe} from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class Auth {

 isAuth = signal<boolean>(!!localStorage.getItem('token'));
  profileData = signal<ProfileData | UserMe | null>(null);
  
  userDisplayName = computed(() => {
    const data = this.profileData();
    return data ? `${data.firstName} ${data.lastName}` : 'Guest';
  });

  signIn(data: UserMe | ProfileData) {
    this.isAuth.set(true);
    this.profileData.set(data);
  }

  setProfileData(data: ProfileData) {
    this.profileData.set(data);
  }
  signOut() {
    this.isAuth.set(false);
    this.profileData.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
  }
}

