import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtInterceptor } from '../shared/shared_service/jwt.interceptor';
import { CommonService } from '../shared/shared_service/common.service';
import { BackendSainikData } from '../shared/shared_service/sainikdata';
import { environment } from '../../environments/environment.development';




providers: [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
]

@Injectable({
  providedIn: 'root'
})


export class AdminService {
  private apiUrl = environment.base_url;
  UserName: any;

  constructor(private http: HttpClient, private router: Router, private authService: CommonService) { }

  createuser(user: any): Observable<any> {
    this.authService.getuserName().subscribe(username => {
      this.UserName = username;
      console.log('UserName', this.UserName);
    });
    const payload = {
 email: user.email,
  password: user.password,
  role: user.role,
  district: user.district, // ✅ Add this line
  created_by: this.UserName,
  modified_by: this.UserName,
  first_name: user.first_name,
  last_name: user.last_name      };
    console.log("user", payload)
    return this.http.post<any>(`${this.apiUrl}/register `, payload).pipe(
      catchError(error => {
        console.error('Error in resetPassword:', error);
        return throwError(error);
      })
    );
  }


  saveCategory(data: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/categories/`, data);
  }
  saveSubCategory(data: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/subcategories/`, data);
  }
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/categories/`);
  }
  getSubCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/subcategories/`);
  }
  saveAuthor(data: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/authors/`, data);
  }
 getAuthors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/authors/`);
  }
   getPublisher(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/auth/publishers/`);
  }
  getAllOrders(page: number = 1): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/admin/orders/?page=${page}`);
}
  deleteAuthor(id: number) {
  return this.http.delete(`${this.apiUrl}/api/authors/${id}/`);
}
updateAuthor(id: number, data: any) {
  return this.http.put(`${this.apiUrl}/api/authors/${id}/`, data);
}
getAuthorById(id: number) {
  return this.http.get(`${this.apiUrl}/api/authors/${id}/`);
}
  saveBooks(data: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/books/create/`, data);
  }


deleteBook(id: number) {
  return this.http.delete(`${this.apiUrl}/api/admin/books/${id}/`);
}
updateBook(id: number, data: any) {
  return this.http.put(`${this.apiUrl}/api/admin/books/${id}/update/`, data);
}
getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/admin/books/`);
  }
getBookById(id: number) {
  return this.http.get(`${this.apiUrl}/api/admin/books/${id}/`);
}
getOrderById(orderId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/admin/orders/${orderId}/`);
}

getOrderByStatus(status: string, page: number): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/api/admin/orders-by-status/`,
    {
      params: {
        status,
        page
      }
    }
  );
}


getSubOrderByStatus(status: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/publisher/suborders/status/`, { params: { status } });
}

forwardOrderToPublisher(orderId: number): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/admin/orders/${orderId}/forward/`, {});
}


   updateOrderItemStatus(orderItemId: number, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/order-items/${orderItemId}/update-status/`, payload);
  }

getCount(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/stats/`); 
}
getAllSubOrder(page: number = 1): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/publisher/suborders/?page=${page}`);
}
}
