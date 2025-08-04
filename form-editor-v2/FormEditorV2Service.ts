import { ServiceOptions, serviceRequest } from "@serenity-is/corelib";
import { SaveUserSettingsRequest, SaveUserSettingsResponse, GetUserSettingsRequest, GetUserSettingsResponse } from "./FormEditorV2Types";

export namespace FormEditorV2Service {
    export const baseUrl = 'UserControlForm/FormEditorV2';

    export declare function SaveUserSettings(request: SaveUserSettingsRequest, onSuccess?: (response: SaveUserSettingsResponse) => void, opt?: ServiceOptions<any>): JQueryXHR;
    export declare function GetUserSettings(request: GetUserSettingsRequest, onSuccess?: (response: GetUserSettingsResponse) => void, opt?: ServiceOptions<any>): JQueryXHR;

    export const Methods = {
        SaveUserSettings: "UserControlForm/FormEditorV2/SaveUserSettings",
        GetUserSettings: "UserControlForm/FormEditorV2/GetUserSettings"
    } as const;

    [
        'SaveUserSettings',
        'GetUserSettings'
    ].forEach(x => {
        (<any>FormEditorV2Service)[x] = function (r: any, s?: any, o?: any) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}