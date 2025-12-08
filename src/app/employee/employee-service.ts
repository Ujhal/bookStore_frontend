import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtInterceptor } from '../shared/shared_service/jwt.interceptor';
import { CommonService } from '../shared/shared_service/common.service';
import { SainikFormData } from './sainik-form/models/sainik.models';

import { BackendSainikData } from '../shared/shared_service/sainikdata';
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






 
submitSainikData(payload: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/sainikdetails/sainiks/`, payload);
}
  
  getDistricts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/districts/`);
  }

   getCorps(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/corps/`);
  }
  getbanks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/banks/`);  
  }
  getBranches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/branches/`);
  }
  getCommissionTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/commissions/`);
  }
  getQualifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/qualifications/`);
  }

  getEsmIssuePlaces(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/esm-places/`);
  }

  getAwardTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/award-types/`);
  }
  getAwardCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/award-categories/`);
  }
  getclass12Streams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/class12-streams/`);
  }
   getundergraduatedegrees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/undergraduate-degrees/`);
  }
   getpostgraduatedegrees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/postgraduate-degrees/`);
  }
  getEducationalLevels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/educational-levels/`);
  }
  getSainiks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/sainikdetails/sainiks/`);
  }
  getSainikDetails(id_ic: string): Observable<BackendSainikData> {
    return this.http.get<BackendSainikData>(`${this.apiUrl}/api/sainikdetails/sainiks/${id_ic}`);
  }
 get_total_counts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/sainikdetails/stats/total/`);
  
  }
  get_districtwise_counts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/sainikdetails/stats/district-wise/`);
  }
  get_corpswise_counts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/sainikdetails/stats/corps/`);
  }
  get_alive_counts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/sainikdetails/stats/status/`);
  }
  get_qualificationwise_counts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/sainikdetails/stats/qualification-levels/`);
  }
   get_awards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/master/award-masters/`);
  }

}
