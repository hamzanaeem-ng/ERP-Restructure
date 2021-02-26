import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable} from 'rxjs';
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
