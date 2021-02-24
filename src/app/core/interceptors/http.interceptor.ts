import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, exhaustMap, take } from 'rxjs/operators';
import { LoginService } from '../services/login.service';

@Injectable({
    providedIn: 'root'
})
export class HttpAuthInterceptor implements HttpInterceptor {

    constructor(private loginService: LoginService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.loginService.user.pipe(
            take(1),
            exhaustMap(user => {
                if (!user) {
                    return next.handle(req)
                }
                const modifiedReq = req.clone({
                    params: new HttpParams().set("Authorization", "Bearer " + this.loginService.getToken().toString())
                });
                return next.handle(modifiedReq);
            })
        );
    }

}

export const SkipErrorHeader = 'Skip-Error-Header';

// @Injectable({
//     providedIn: 'root'
// })
// export class HttpErrorInterceptor implements HttpInterceptor {

//     constructor(private loginService: LoginService) { }

//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//         if (req.headers.has(SkipErrorHeader)) {
//             const headers = req.headers.delete(SkipErrorHeader);
//             return next.handle(req.clone({ headers }))
//         }

//         return next.handle(req)
//             .pipe(
//                 catchError((error: HttpErrorResponse) => {
//                     //   let errorMessage = '';
//                     //   if (error.error instanceof ErrorEvent) {
//                     //     // client-side error
//                     //     errorMessage = `Error: ${error.error.message}`;
//                     //   } else {
//                     //     // server-side error
//                     //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//                     //   }
//                     //   window.alert(errorMessage);
//                     //   return throwError(errorMessage);
//                     return throwError('some error');
//                 }))

//     }

// }