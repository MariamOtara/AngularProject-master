import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})

export class Api {


private apiUrl = 'https://restaurantapi.stepacademy.ge/'

constructor(private http: HttpClient) {}

getDatafromApi( url: string ){
  return this.http.get(this.apiUrl + url);
}

addToCart(productId: number, quantity: number) {
   const body = { productId, quantity };
    return this.http.post(`${this.apiUrl}api/cart/add-to-cart`, body);
}

getCart(take: number, page: number) {
  return this.http.get(`${this.apiUrl}api/cart`);
}

editquantity(itemId: number, quantity: number) {
  const body = { itemId, quantity };
   return this.http.put(`${this.apiUrl}api/cart/edit-quantity`, body);
}

checkout(take: number, page: number) {  
  return this.http.post(`${this.apiUrl}api/cart/checkout?Take=${take}&Page=${page}`,{});
}

deleteProductfromCart({ productId }: { productId: number; }) {
  return this.http.delete(`${this.apiUrl}api/cart/remove-from-cart/${productId}`);
}

usersEditProfile(firstName: string, lastName: string, picture: string, phoneNumber: string, address: string, age: number) {
  const body = { 
    FirstName: firstName, 
    LastName: lastName, 
    Picture: picture, 
    PhoneNumber: phoneNumber, 
    Address: address, 
    Age: age 
  };
  return this.http.put(`${this.apiUrl}api/users/edit`,body);
}

usersChangePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
  const body = { 
    OldPassword: oldPassword, 
    NewPassword: newPassword, 
    ConfirmPassword: confirmPassword 
  }
  return this.http.put(`${this.apiUrl}api/users/change-password`, body);
}

deleteUser() {
  return this.http.delete(`${this.apiUrl}api/users/delete`);
}

postCategory(name: string) {
  const body = { Name: name };
  return this.http.post(`${this.apiUrl}api/categories`, body);

}

putCategory(id: number, data: any) {
  return this.http.put(`${this.apiUrl}api/categories/${id}`, data);
}

deleteCategory(id: number) {
  return this.http.delete(`${this.apiUrl}api/categories/${id}`);

}

postProduct(productData: any) { 
  return this.http.post(`${this.apiUrl}api/products`, productData);
}

putProduct(id: number, data: any) {
  return this.http.put(`${this.apiUrl}api/products/${id}`, data);
}

deleteProduct(id: number) {
  return this.http.delete(`${this.apiUrl}api/products/${id}`);
}
}