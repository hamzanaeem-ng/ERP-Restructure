import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AppStateService } from 'src/app/core/services/app-state.service';
import { LoginService } from 'src/app/core/services/login.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { AppConfig } from 'src/app/shared/utilities/app.config';
import { AppHelpers } from 'src/app/shared/utilities/app.helper';
import { PoliciesStateService } from '../../services/policy-state.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.less']
})
export class ListPageComponent implements OnInit {
  @ViewChild('dtTable', { static: false }) table: any;
 
  AppHelpers = AppHelpers;
  AppConfig = AppConfig;
  DataInitials;
  ConsoleLog = console.log;
  rows = [];
  totalData = [];
  
  pageSizes = [
    { value: 5 },
    { value: 10, selected: 'selected' },
    { value: 15 },
    { value: 20 },
  ]
  
  searchCriteria = [
    { Value: "PolicyCode", Label: "Policy Code" },
    { Value: "VehicleRegistrationNumber", Label: "Registration Number" },
    { Value: "Engine", Label: "Engine" },
    { Value: "Chasis", Label: "Chasis" },
    { Value: "Cnic", Label: "Cnic" },
    { Value: "ContactNumber", Label: "Contact Number" },
    { Value: "ParticipantName", Label: "Participant Name" },
  ];

  isClaimSearch = false;
  type = "policy"
  
  criteria = null;
  currentPageSize = 10;
  totalParsedStatuses = [];
  filterSearch = null;
  filterStatus = null;
  filterCategory = null;
  
  expandedId: any = [];

  permission?: any = []
  claimPermission?: any = []
  
  selectedPolicy = null;
  covernoteRemarks = [];
  
  loadingIndicator$: Observable<boolean>;
  private subscription: Subscription = new Subscription();
  
  constructor(
    private appStateService: AppStateService, 
    private moduleStateService: PoliciesStateService,
    private loginService: LoginService,
    private reportService: ReportsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
    ) {

    if (this._activatedRoute.routeConfig.path === 'search') {
      this.isClaimSearch = true;
    } else {
      this.isClaimSearch = false;
    }
  }

  ngOnInit(): void {

    this.subscription.add(
      this.appStateService.DataInitials$.subscribe((response)=>{
        if( response && Object.keys(response).length !== 0) {
          this.moduleStateService.getPolicies();
          this.DataInitials = response;
        }
      })
    );

    this.subscription.add(
      this.appStateService.permissions$.subscribe((response)=>{
        if(response.length > 0){
          this.permission = response.find(x => x.ActionName == 'Policy')
          this.claimPermission = response.find(x => x.ActionName == 'Claims')
        } 
      })
    );
    
    this.subscription.add(
      this.moduleStateService.policies$.subscribe((policies) => {
        this.totalData = policies;
        this.rows = policies;
        this.parsePolicyStatus();
        this.updateFilter();
      })
    );

    this.subscription.add(
      this.moduleStateService.remarksData$.subscribe((data)=>{
          this.covernoteRemarks = data.Remarks;
          this.selectedPolicy = data.Policy;
      })
    );

    this.subscription.add(
      this.reportService.responseReceived.subscribe(()=>{
        this.moduleStateService.loader = false;
      })
    );

    this.loadingIndicator$ = this.moduleStateService.loader$;
    
    // setTimeout(() => {
    //   if (this.isClaimSearch) {
    //     document.getElementById('nav-claims').classList.add('nav-expanded', 'nav-active');
    //   } else {
    //     document.getElementById('nav-policy').classList.add('nav-expanded', 'nav-active');
    //   }
    // }, 200);

    this.ngxDatatableResize();
  }

  checkEndorsementStatus(row){
    let invalidEndorsements = [];
    invalidEndorsements = row.Endorsements.map(end=>{
      return end.PolicyStatus=='New'
    });
    if(invalidEndorsements.includes(true)){
      return false;
    }
    else{
      return true;
    }
  }

  filterSearchCriteria(loadRemarks = null) {
    const requestBody = {};
    const prop = this.criteria ? this.criteria.Value : this.searchCriteria[0].Value;
    requestBody[prop] = this.filterSearch;

    if (this.filterSearch && this.filterSearch !== "") {
      this.moduleStateService.getPolicyFiltered( requestBody, loadRemarks );
    } else {
      this.moduleStateService.getPolicies(loadRemarks);
    }
  }

  parsePolicyStatus() {
    this.totalParsedStatuses = [];
    this.totalParsedStatuses.push({ Value: "all", Label: "All" });
    this.totalData.map(x => {
      const policyStatus = x.PolicyHeader.PolicyStatus;
      if (!this.totalParsedStatuses.find(x => x.Label == policyStatus)) {
        this.totalParsedStatuses.push({ Value: policyStatus.toLowerCase(), Label: policyStatus });
      }
      return x.PolicyHeader.PolicyStatus
    })
  }

  onPageSizeChange(value) {
    this.currentPageSize = parseInt(value.value);
  }

  toggleExpandRow(rowExpanded) {
    document.querySelector(".js-dropdown-placer").innerHTML = ""
    this.table.rowDetail.toggleExpandRow(rowExpanded);
    const index=this.expandedId.indexOf(rowExpanded.id);
    if(index > -1){
      this.expandedId.splice(index,1);
    }
    else{
      this.expandedId.push(rowExpanded.id);
    }
  }

  onSort(event) {
    // event was triggered, start sort sequence
  }

  openRemarks(row) {
    this.covernoteRemarks = row.PolicyRemarks;
    this.selectedPolicy = row;
    // AppHelpers.toggleSidebar(null, 'RemarksBar');
  }

  onRemarkAdded(body) {
    this.filterSearchCriteria(body);
  }

  ngxDatatableResize() {
    // this.randomData.bookmarkBarToggle.subscribe(() => {
    //   this.refreshRows();
    // });

    window.onresize = () => {
      this.refreshRows();
    }
  }

  refreshRows(){
    setTimeout(() => {
      this.rows = [...this.rows];
    }, 400);
    setTimeout(()=> {
      this.expand();
    },402);
  }
  

  expand(){
    this.table.rowDetail.collapseAllRows();
    for(let i=0;i<this.rows.length;i++){
      if(this.expandedId.indexOf(this.rows[i].id) > -1){
        this.toggleExpandRow(this.rows[i])
      }
    }
  }
  

  search(event) {
    this.filterSearch = event;
    // this.updateFilter()
  }

  updateFilter() {
    const category = (this.filterCategory && this.filterCategory != "") ? this.filterCategory : null;
    const status = this.filterStatus && this.filterStatus !== "" && this.filterStatus !== "all" ? this.filterStatus.toLowerCase() : null;

    if (status && category) {
      // filter our data
      this.rows = this.totalData.filter(x => (x.PolicyHeader.PolicyStatus.toLowerCase() === status) && (x.PolicyHeader.FkPolicyCategoryId === category));
    } else if (status) {
      this.rows = this.totalData.filter(x => (x.PolicyHeader.PolicyStatus.toLowerCase() === status));
    } else if (category) {
      this.rows = this.totalData.filter(x => (x.PolicyHeader.FkPolicyCategoryId === category));
    } else {
      this.rows = this.totalData;
    }

    // Whenever the filter changes, always go back to the first page
    if(this.table) this.table.offset = 0;
    
  }

  postPolicy(row) {
    const requestBody = {
      PkPolicyHeaderId: row.PolicyHeader.PkPolicyHeaderId,
    }
    this.moduleStateService.postPolicy(requestBody);
  }

  postEndorsement(rowItem: any) {
    this.moduleStateService.postEndorsement(rowItem);
  }  

  onKeyup(event) {
    if (event.keyCode === 13) { // Enter Pressed
      this.filterSearchCriteria();
    }
  }

  generateURL(scope, {FkPolicyId = undefined, FkMotorId = undefined, PolicyCode = undefined}) {
   
      const urlObj = {
        FkPolicyId,
        FkMotorId,
        PolicyCode,
      };
     console.log(urlObj.FkMotorId);
     const randomKey = this.loginService.generateURLHash(urlObj);

    switch (scope) {
      

      case 'edit':
        this._router.navigate(['policy/update', randomKey])
        break;

      case 'view':
        this._router.navigate(['policy/view', randomKey])
        break;

      case 'claim':
        this._router.navigate(['/claim/registration', randomKey])
        break;
    
      default:
        break;
    }
  }

  generateURLEndorsement(scope, {FkPolicyId = undefined, FkEndorsementTypeId = undefined }) {
   
    const urlObj = {
      FkPolicyId,
      FkEndorsementTypeId
    };
   const randomKey = this.loginService.generateURLHash(urlObj);

  switch (scope) {
   
    case 'endorsement':
      this._router.navigate(['/endorsement/add', randomKey])
      break;

    case 'view-endorsement':
      this._router.navigate(['endorsement/view', randomKey])
      break;

    default:
      break;
  }
}

  generateReport(name, params){
    this.moduleStateService.loader = true;
    const requestBody = {
      ReportName: name,
      Parameters: params,
      ReportType: "ERP"
    }
    this.reportService.generateThisReport(requestBody);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}

