import { SaveResponse, ServiceOptions, serviceRequest } from "@serenity-is/corelib";
import { GetSettingsRequest } from "./GetSettingsRequest";
import { GetSettingsResponse } from "./GetSettingsResponse";
import { SaveSettingsRequest } from "./SaveSettingsRequest";

export namespace FormFieldSettingsService {
    export const baseUrl = 'Administration/FormFieldSettings';

    export declare function SaveSettings(request: SaveSettingsRequest, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function GetSettings(request: GetSettingsRequest, onSuccess?: (response: GetSettingsResponse) => void, opt?: ServiceOptions<any>): PromiseLike<GetSettingsResponse>;

    export const Methods = {
        SaveSettings: "Administration/FormFieldSettings/SaveSettings",
        GetSettings: "Administration/FormFieldSettings/GetSettings"
    } as const;

    [
        'SaveSettings', 
        'GetSettings'
    ].forEach(x => {
        (<any>FormFieldSettingsService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}