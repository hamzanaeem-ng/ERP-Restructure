import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable} from 'rxjs';
import { catchError} from 'rxjs/operators';
import { AppHelpers } from 'src/app/shared/utilities/app.helper';
import { LoginService } from '../services/login.service';

@Injectable({
	providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
	private XSkipLoginCheck = 'X-Skip-Login-Check';

	constructor( private _router: Router, private loginService: LoginService ) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// When XSkipLoginCheck header exist, the request will always be sent and will be sent without any auth token
		// But if doesn't exist, isLoggedIn will be checked, thus auth token is set if logged in, otherwise routed to auth/login
		
		if (req.headers.has(this.XSkipLoginCheck)) {
			
			const headers = req.headers.delete(this.XSkipLoginCheck);
			return next.handle(req.clone({ headers }));
		} else {

			if (this.loginService.isLoggedIn()) {
				const modifiedReq = req.clone({
					headers: req.headers.set('Authorization', `Bearer ${this.loginService.getToken().toString() }`),
				});
				return next.handle(modifiedReq);
			}
			else {
				this._router.navigate(['auth/login']);
				return EMPTY; 
			}
		}
	}

}


@Injectable({
	providedIn: 'root'
})
export class ErrorHandlingInterceptor implements HttpInterceptor {
	private XSkipErrorHandling = 'X-Skip-Error-Handling';
	
	constructor() { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (req.headers.has(this.XSkipErrorHandling)) {
			return next.handle(req);
		}
		else{
			const headers = req.headers.delete(this.XSkipErrorHandling);
			return next.handle(req.clone({ headers }))
				.pipe(
					catchError((error: HttpErrorResponse) => {
						return AppHelpers.handleHttpError(error);
					}));
		}


	}

}