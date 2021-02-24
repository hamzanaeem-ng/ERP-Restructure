import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { AppHelpers } from '../utilities/app.helper';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }
  responseReceived = new Subject<any>();

  generateReport(requestBody){
    return this.http.post(environment.report_api_url, requestBody, {observe: 'response', responseType: 'blob'})
  }

  generateThisReport(requestBody){
    this.generateReport(requestBody).subscribe(res=>{
      if(res.body){
        var url = URL.createObjectURL(res.body);
        window.open(
          url,
          '_blank' 
        );
        this.responseReceived.next();
      }
    },err=>{
      AppHelpers.handleHttpError(err);
      this.responseReceived.next();
    })
  }

}
