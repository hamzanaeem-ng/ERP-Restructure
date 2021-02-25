import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, exhaustMap, take } from 'rxjs/operators';
import { AppHelpers } from 'src/app/shared/utilities/app.helper';
import { LoginService } from '../services/login.service';

@Injectable({
	providedIn: 'root'
})
export class AvoidRequestInterceptor implements HttpInterceptor {

	constructor(private loginService: LoginService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return this.loginService.user.pipe(
			take(1),
			exhaustMap(user => {
				if (!user) {
					return next.handle(req)
				}
				const modifiedReq = req.clone({
					headers: req.headers.set('Authorization', `Bearer ${this.loginService.getToken().toString()}`),
				});
				return next.handle(modifiedReq);
			})
		);
	}

}

@Injectable({
	providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

	constructor(private loginService: LoginService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return this.loginService.user.pipe(
			take(1),
			exhaustMap(user => {
				if (!user) {
					return next.handle(req)
				}
				const modifiedReq = req.clone({
					headers: req.headers.set('Authorization', `Bearer ${this.loginService.getToken().toString()}`),
				});
				return next.handle(modifiedReq);
			})
		);
	}

}

export const XSkipErrorHandling = 'X-Skip-Error-Handling';

@Injectable({
	providedIn: 'root'
})
export class ErrorHandlingInterceptor implements HttpInterceptor {

	constructor() { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (req.headers.has(XSkipErrorHandling)) {
			console.log('Handle Error in Component')
			return next.handle(req);
		}
		else{
			console.log('Handle Error in Request')
			const headers = req.headers.delete(XSkipErrorHandling);
			return next.handle(req.clone({ headers }))
				.pipe(
					catchError((error: HttpErrorResponse) => {
						return AppHelpers.handleHttpError(error);
					}));
		}


	}

}