import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { AppHelpers } from 'src/app/shared/utilities/app.helper';


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
				catchError((error: HttpErrorResponse)=>{
					return AppHelpers.handleHttpError(error);
				})
			);
		}
	}

}