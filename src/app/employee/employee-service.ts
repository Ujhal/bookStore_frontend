import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtInterceptor } from '../shared/shared_service/jwt.interceptor';
import { CommonService } from '../shared/shared_service/common.service';
import { environment } from '../../environments/environment.development';
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
]

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
   private apiUrl = environment.base_url;
  UserName: any;



  constructor(private http: HttpClient, private router: Router, private authService: CommonService) { }

getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/books/`);
  }
getBookById(id: number) {
  return this.http.get(`${this.apiUrl}/api/books/${id}/`);
}
 getAddresses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/auth/addresses/`);
  }

  // Save a new address
  saveAddress(address: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/addresses/` ,address);
  }

  // Edit an existing address by ID
  editAddress(id: number, address: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/auth/addresses/${id}/`, address);
  }
// employee-service.ts

 getCart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/cart/`);
  }

  addToCart(payload: { book_id: number; quantity: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/cart/`, payload);
  }

  removeFromCart(book_id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/cart/remove/${book_id}/`);
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/cart/clear/`);
  }

getmyOrders(url?: string): Observable<any> {
    return this.http.get<any>(url || `${this.apiUrl}/api/orders/customer/`);
  }

getOrderById(orderId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/user/orders/${orderId}/`);
}




}
