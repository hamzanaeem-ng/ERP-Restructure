import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class AppConfig{
    public privateCryptoKey = "0987654321.."
    
    private _DataConfig = {
        "ProductSetup": {
          "TableName": [
            "PolicyTypes",
            "ClaimSources",
            "CoverTypes",
            "Benefits",
            "ClaimDecisions",
            "ClaimStatuses",
            "Diagnoses",
            "MaritalStatuses",
            "HealthPostedPolicy",
            "TableNames",
            "Users",
            "Clients",
            "Agencies",
            "Agent",
            "Taxes",
            "Trackers",
            "Riders",
            "Conditions",
            "Warranties",
            "Provinces",
            "Modules",
            "Departments",
            "ReportTo",
            "Designations",
            "Educations",
            "Roles",
            "Actions",
            "ClientCategories",
            "ClientCategoryTypes",
            "Branches",
            "BusinessCategories",
            "BusinessCategoryTypes",
            "Sectors",
            "Countries",
            "Cities",
            "Areas",
            "KYCCategory",
            "KYCCategoryDoc",
            "Products",
            "HealthProduct",
            "TakafulType",
            "VehicleMakes",
            "VehicleSubMakes",
            "VehicleVariants",
            "VehicleModels",
            "VehicleBodyType",
            "BDO",
            "Occupation",
            "Color",
            "DocumentType",
            "PeriodType",
            "PaymentMode",
            "Accessory",
            "Relation",
            "WorkshopType",
            "Workshop",
            "LossType",
            "PaymentAccount",
            "RecoveryItem",
            "Fund",
            "AgeBand",
            "Plan",
            "LimitType",
            "ProductTypes",
            "ChildBenefit",
            "ParentBenefit",
            "EndorsementType",
            "CancellationReasons",
            "CoverNotes",
            "ConvertedCovernotes",
            "HealthCoverNotes",
            "PostedPolicy",
            "UnPostedPolicy",
            "Surveyors"
          ]
        },
      }
    get DataConfig(){
        return this._DataConfig;
    }
}