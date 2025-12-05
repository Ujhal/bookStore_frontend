// jwt.interceptor.ts
import { HttpEvent, HttpInterceptorFn, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { inject } from '@angular/core';
import { CommonService } from './common.service';

export const JwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const apiUrl = 'http://127.0.0.1:8000';

  const authService = inject(CommonService);

  const token = authService.getAccessToken();
  const csrfToken = getCookie('csrftoken');
  let headers = req.headers;

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  if (csrfToken) {
    headers = headers.set('X-CSRFToken', csrfToken);
  }

  const authReq = req.clone({ headers });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !authReq.url.includes(`${apiUrl}/token/refresh/`)) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

const handle401Error = (req: HttpRequest<any>, next: HttpHandlerFn, authService: CommonService): Observable<HttpEvent<any>> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((token: any) => {
        isRefreshing = false;
        refreshTokenSubject.next(token.access);
        return next(req.clone({ setHeaders: { Authorization: `Bearer ${token.access}` } }));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap((accessToken) => {
        return next(req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }));
      })
    );
  }
};
