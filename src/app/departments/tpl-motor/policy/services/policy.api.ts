
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';


@Injectable({
    providedIn:'root'
})
export class PolicyAPIService{
    constructor( private api: ApiService) {

    }

    getPolicies() {
        return this.api.get('/Policy/GetAllPoliciesWithEndorsements'); 
    }

    getPolicyFiltered(requestBody) {
        return this.api.post('/Policy/GetPolicy', requestBody);
    }

    postPolicy(requestBody) {
        return this.api.post('/Policy/PostPolicy', requestBody);
    }

    postEndorsement(requestBody) {
        return this.api.post('/Policy/PostEndorsement', requestBody);
    }

}