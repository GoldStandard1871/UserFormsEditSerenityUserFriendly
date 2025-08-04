import { SaveRequest, SaveResponse, ServiceOptions, DeleteRequest, DeleteResponse, RetrieveRequest, RetrieveResponse, ListRequest, ListResponse, ServiceResponse, serviceRequest } from "@serenity-is/corelib";
import { FormEditorV2Row } from "./FormEditorV2Row";
import { GetUserSettingsRequest } from "./GetUserSettingsRequest";
import { GetUserSettingsResponse } from "./GetUserSettingsResponse";
import { SaveUserSettingsRequest } from "./SaveUserSettingsRequest";

export namespace FormEditorV2Service {
    export const baseUrl = 'FormEditor/FormEditorV2';

    export declare function Create(request: SaveRequest<FormEditorV2Row>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Update(request: SaveRequest<FormEditorV2Row>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Delete(request: DeleteRequest, onSuccess?: (response: DeleteResponse) => void, opt?: ServiceOptions<any>): PromiseLike<DeleteResponse>;
    export declare function Retrieve(request: RetrieveRequest, onSuccess?: (response: RetrieveResponse<FormEditorV2Row>) => void, opt?: ServiceOptions<any>): PromiseLike<RetrieveResponse<FormEditorV2Row>>;
    export declare function List(request: ListRequest, onSuccess?: (response: ListResponse<FormEditorV2Row>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<FormEditorV2Row>>;
    export declare function SaveUserSettings(request: SaveUserSettingsRequest, onSuccess?: (response: ServiceResponse) => void, opt?: ServiceOptions<any>): PromiseLike<ServiceResponse>;
    export declare function GetUserSettings(request: GetUserSettingsRequest, onSuccess?: (response: GetUserSettingsResponse) => void, opt?: ServiceOptions<any>): PromiseLike<GetUserSettingsResponse>;

    export const Methods = {
        Create: "FormEditor/FormEditorV2/Create",
        Update: "FormEditor/FormEditorV2/Update",
        Delete: "FormEditor/FormEditorV2/Delete",
        Retrieve: "FormEditor/FormEditorV2/Retrieve",
        List: "FormEditor/FormEditorV2/List",
        SaveUserSettings: "FormEditor/FormEditorV2/SaveUserSettings",
        GetUserSettings: "FormEditor/FormEditorV2/GetUserSettings"
    } as const;

    [
        'Create', 
        'Update', 
        'Delete', 
        'Retrieve', 
        'List', 
        'SaveUserSettings', 
        'GetUserSettings'
    ].forEach(x => {
        (<any>FormEditorV2Service)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}