import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from 'rxjs';
import { AppStateService } from 'src/app/core/services/app-state.service';
import { AppHelpers } from 'src/app/shared/utilities/app.helper';
import { RemarkDetail } from '../models/policy.model';
import { PolicyAPIService } from './policy.api';

@Injectable({
    providedIn:'root'
})
export class PoliciesStateService{
    
    private readonly _policies = new BehaviorSubject<any>([]);
    readonly policies$ = this._policies.asObservable();
    get policies(): any {
        return this._policies.getValue();
    }
    set policies(val: any) {
        this._policies.next(val);
    }
    
    private readonly _remarksData = new Subject<RemarkDetail>();
    readonly remarksData$ = this._remarksData.asObservable();
    
    private readonly _status = new Subject<boolean>();
    readonly status$ = this._status.asObservable();
    set status(val: any) {
        this._status.next(val);
    }

    private readonly _loader = new Subject<boolean>();
    readonly loader$ = this._loader.asObservable();
    set loader(val: any) {
        this._loader.next(val);
    }

    constructor( private APIService: PolicyAPIService, private appStateService: AppStateService ){

    }

    getPolicies(loadRemarks = null) {
        this.loader = true; 
        this.APIService.getPolicies().subscribe(response => {
            this.loader = false;
            this.manageResponse(response, loadRemarks);
        }, err => {
            this.loader = false;
            // AppHelpers.handleHttpError(err);
        })
    }

    getPolicyFiltered(requestBody, loadRemarks = null){
        this.loader = true;
        this.APIService.getPolicyFiltered(requestBody).subscribe(response => {
            this.loader = false;
            this.manageResponse(response, loadRemarks);
        }, err => {
            this.loader = false;
            // AppHelpers.handleHttpError(err);
        });
    }

    private manageResponse(response, loadRemarks){
        response.forEach((policy, index) => {
            policy.id = index;
            policy.Endorsements.map(endorsement => {
                endorsement.EndorsementType = this.appStateService.DataInitials.EndorsementType.find(x => x['PkReferenceId'] == endorsement.LeaderEndorsmentNumber)?.Description
            });
        });
        
        this.policies = [...response];

        if (loadRemarks) {
            const sentPolicy = response.find(x => x.PolicyHeader.PkPolicyHeaderId === loadRemarks.FkPolicyId);
            this._remarksData.next({
                Remarks: sentPolicy.PolicyRemarks,
                Policy: sentPolicy
            });
        }
    }

    postPolicy(requestBody) {
        this.APIService.postPolicy(requestBody).subscribe(() => {
            AppHelpers.showNotification("success", "", "Policy has been posted successfully!");
            // Get All Policies Again            
            this.getPolicies();
        });
    }

    postEndorsement(rowItem) {
        const requestBody = {
          PkPolicyHeaderId: rowItem.PkPolicyHeaderId,
          EndorsementType: rowItem.EndorsementType,
        }
        this.APIService.postEndorsement(requestBody).subscribe((res: any) => {
          AppHelpers.showNotification("success", "", "Endorsement has been posted successfully!");
            rowItem.PolicyStatus = 'Posted';
        })
    } 
 
}