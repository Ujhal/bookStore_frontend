import { Injectable, signal } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtInterceptor } from './jwt.interceptor';
import { environment } from '../../../environments/environment.development';


// providers: [
//   { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
// ]

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  private apiUrl = environment.base_url; // Replace with your API endpoint
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private userNameKey = 'userName';
  private roleKey = 'role';
  private FirstName = 'first_name';
  private LastName = 'last_name';

  
  private headerLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
  public headerLogin$ = this.headerLoginSubject.asObservable();


  public loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public userNameSubject = new BehaviorSubject<string>(this.getStoredUserName());
  public roleSubject = new BehaviorSubject<string>(this.getStoredRole());
  public firstName = new BehaviorSubject<string>(this.getfirstName());
  public lastName = new BehaviorSubject<string>(this.getlastName());


  
public updateHeaderLogin(status: boolean) {
  this.headerLoginSubject.next(status);
}


  constructor(private http: HttpClient, private router: Router) { }

getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/books/`);
  }
getBookById(id: number) {
  return this.http.get(`${this.apiUrl}/api/books/${id}/`);
}
placeOrder(payload: any) {
  return this.http.post(`${this.apiUrl}/api/orders/`, payload);
}

createPayment(orderId: number): Observable<any> {
    const payload = { order_id: orderId };
    return this.http.post(`${this.apiUrl}/api/payments/create/`, payload);
}


  // Verify Razorpay payment signature
  verifyPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/payments/verify/`, data);
  }

  // 2️⃣ Create Payment (WITH TOKEN)
  createPaymentGuest(orderId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      `${this.apiUrl}/api/payments/create/`,
      { order_id: orderId },
      { headers }
    );
  }

  // 3️⃣ Verify PaymentGuest (WITH TOKEN)
  verifyPaymentGuest(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      `${this.apiUrl}/api/payments/verify/`,
      data,
      { headers }
    );
  }

getmyOrders(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/orders/`);
}

checkoutAndRegister(data: any) {
  return this.http.post(`${this.apiUrl}/api/checkout-register/`, data);
}

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/token/refresh/`, {
      refresh: this.getRefreshToken()
    }).pipe(
      tap((tokens) => {
        localStorage.setItem(this.accessTokenKey, tokens.access);
        if (tokens.refresh) {
          localStorage.setItem(this.refreshTokenKey, tokens.refresh);
        }
      })
    );
  }

  getCaptcha(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_captcha`, { observe: 'response' })
  }

  login(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/login/`, { loginData }).pipe(
      map(response => {
        if (response) {
          this.setTokens(response.access_token, response.refresh_token, response.user.username, response.user.role, response.first_name, response.last_name);
          console.log(this.setTokens)
          this.loggedIn.next(true);
          this.updateHeaderLogin(true);
        }
        return response;
      })
    );
  }

  register(registerData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/auth/register/`, registerData).pipe(
    map(response => {
      if (response.message) {
        return { success: true, message: response.message };
      }
      return response; // return full response if needed
    }),
    catchError(error => {
      console.error('Registration error (HttpErrorResponse):', error);
      // Pass the full error object to the component
      return throwError(() => error);
    })
  );
}

  resetPassword(old_password: string, new_password1: string, new_password2: string): Observable<any> {
    const payload = { old_password, new_password1, new_password2 };
    return this.http.put<any>(`${this.apiUrl}/passwordReset`, payload).pipe(
      catchError(error => {
        console.error('Error in resetPassword:', error);
        return throwError(error);
      })
    );
  }
addToCart(data: any) {
  return this.http.post(`${this.apiUrl}/api/cart/`, data);
}

getCart() {
  return this.http.get(`${this.apiUrl}/api/cart/`);
}

  logout(): void {
  this.removeTokens();
  this.loggedIn.next(false);

  // New: Notify header about logout
  this.updateHeaderLogin(false);

  this.router.navigate(['/']);
  console.log('Logged out, loggedIn:', this.loggedIn.value);
}


  private hasToken(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }

  isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  setTokens(accessToken: string, refreshToken: string, userName: string, role: any, firstName: string, lastName: string ): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    localStorage.setItem(this.userNameKey, userName);
    localStorage.setItem(this.roleKey, role);
    localStorage.setItem(this.FirstName, firstName);
    localStorage.setItem(this.LastName, lastName);
    this.notifyChanges();
  }

  private notifyChanges(): void {
    this.loggedIn.next(this.hasToken());
    this.userNameSubject.next(this.getStoredUserName());
    this.roleSubject.next(this.getStoredRole());
    this.firstName.next(this.getfirstName());
    this.lastName.next(this.getlastName());
    console.log('setUserAuthenticated called', { userName: this.getStoredUserName(), role: this.getStoredRole() });
  }

  private removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userNameKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.FirstName);
    localStorage.removeItem(this.LastName);
    this.notifyChanges();
  }
  

  private getStoredUserName(): string {
    return localStorage.getItem(this.userNameKey) || '';
  }

  private getStoredRole(): string {
    return localStorage.getItem(this.roleKey) || '';
  }
  private getfirstName(): string {
    return localStorage.getItem(this.FirstName) || '';
  }
  private getlastName(): string {
    return localStorage.getItem(this.LastName) || '';
  }
 
  

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getuserName(): Observable<string> {
    return this.userNameSubject.asObservable();
  }

  getRole(): Observable<string> {
    return this.roleSubject.asObservable();
  }
  getFirstName(): Observable<string> {
    return this.firstName.asObservable();
  }
  getLastName(): Observable<string> {
    return this.lastName.asObservable();
  }


  getUserRoleSync(): string {
    return localStorage.getItem(this.roleKey) || '';
  }
  
  
   getMyProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/auth/me/`);
  }

  deleteMyAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/auth/users/delete-self/`);
  }
getStates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/auth/states/`);
  }
  forgotPassword(data: { username: string }) {
  return this.http.post(`${this.apiUrl}/api/auth/forgot-password/`, data);
}
changePassword(data: any) {
  return this.http.post('/api/auth/change-password/', data,);
}
}
