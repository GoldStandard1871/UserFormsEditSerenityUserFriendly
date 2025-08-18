import { ServiceOptions, ServiceRequest, serviceRequest } from "@serenity-is/corelib";
import { CheckPermissionsResponse } from "./CheckPermissionsResponse";
import { GetRequiredFieldsRequest } from "./GetRequiredFieldsRequest";
import { GetRequiredFieldsResponse } from "./GetRequiredFieldsResponse";
import { GetUserFieldSettingsRequest } from "./GetUserFieldSettingsRequest";
import { GetUserFieldSettingsResponse } from "./GetUserFieldSettingsResponse";
import { SaveRequiredFieldsRequest } from "./SaveRequiredFieldsRequest";
import { SaveRequiredFieldsResponse } from "./SaveRequiredFieldsResponse";
import { SaveUserFieldSettingsRequest } from "./SaveUserFieldSettingsRequest";
import { SaveUserFieldSettingsResponse } from "./SaveUserFieldSettingsResponse";

export namespace FieldCustomizationService {
    export const baseUrl = 'Administration/FieldCustomization';

    export declare function GetRequiredFields(request: GetRequiredFieldsRequest, onSuccess?: (response: GetRequiredFieldsResponse) => void, opt?: ServiceOptions<any>): PromiseLike<GetRequiredFieldsResponse>;
    export declare function SaveRequiredFields(request: SaveRequiredFieldsRequest, onSuccess?: (response: SaveRequiredFieldsResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveRequiredFieldsResponse>;
    export declare function GetUserFieldSettings(request: GetUserFieldSettingsRequest, onSuccess?: (response: GetUserFieldSettingsResponse) => void, opt?: ServiceOptions<any>): PromiseLike<GetUserFieldSettingsResponse>;
    export declare function SaveUserFieldSettings(request: SaveUserFieldSettingsRequest, onSuccess?: (response: SaveUserFieldSettingsResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveUserFieldSettingsResponse>;
    export declare function CheckPermissions(request: ServiceRequest, onSuccess?: (response: CheckPermissionsResponse) => void, opt?: ServiceOptions<any>): PromiseLike<CheckPermissionsResponse>;

    export const Methods = {
        GetRequiredFields: "Administration/FieldCustomization/GetRequiredFields",
        SaveRequiredFields: "Administration/FieldCustomization/SaveRequiredFields",
        GetUserFieldSettings: "Administration/FieldCustomization/GetUserFieldSettings",
        SaveUserFieldSettings: "Administration/FieldCustomization/SaveUserFieldSettings",
        CheckPermissions: "Administration/FieldCustomization/CheckPermissions"
    } as const;

    [
        'GetRequiredFields', 
        'SaveRequiredFields', 
        'GetUserFieldSettings', 
        'SaveUserFieldSettings', 
        'CheckPermissions'
    ].forEach(x => {
        (<any>FieldCustomizationService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}