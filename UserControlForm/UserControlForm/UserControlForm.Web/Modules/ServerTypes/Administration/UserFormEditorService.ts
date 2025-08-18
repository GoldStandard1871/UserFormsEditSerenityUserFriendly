import { SaveRequest, SaveResponse, ServiceOptions, DeleteRequest, DeleteResponse, RetrieveRequest, RetrieveResponse, ListRequest, ListResponse, serviceRequest } from "@serenity-is/corelib";
import { GetGlobalPreferenceRequest } from "./GetGlobalPreferenceRequest";
import { GetGlobalPreferenceResponse } from "./GetGlobalPreferenceResponse";
import { GetUserFormPreferenceRequest } from "./GetUserFormPreferenceRequest";
import { GetUserFormPreferenceResponse } from "./GetUserFormPreferenceResponse";
import { SaveGlobalPreferenceRequest } from "./SaveGlobalPreferenceRequest";
import { SaveUserFormPreferenceRequest } from "./SaveUserFormPreferenceRequest";
import { UserFormEditorRow } from "./UserFormEditorRow";

export namespace UserFormEditorService {
    export const baseUrl = 'Administration/UserFormEditor';

    export declare function Create(request: SaveRequest<UserFormEditorRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Update(request: SaveRequest<UserFormEditorRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Delete(request: DeleteRequest, onSuccess?: (response: DeleteResponse) => void, opt?: ServiceOptions<any>): PromiseLike<DeleteResponse>;
    export declare function Retrieve(request: RetrieveRequest, onSuccess?: (response: RetrieveResponse<UserFormEditorRow>) => void, opt?: ServiceOptions<any>): PromiseLike<RetrieveResponse<UserFormEditorRow>>;
    export declare function List(request: ListRequest, onSuccess?: (response: ListResponse<UserFormEditorRow>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<UserFormEditorRow>>;
    export declare function SaveUserFormPreference(request: SaveUserFormPreferenceRequest, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function GetUserFormPreference(request: GetUserFormPreferenceRequest, onSuccess?: (response: GetUserFormPreferenceResponse) => void, opt?: ServiceOptions<any>): PromiseLike<GetUserFormPreferenceResponse>;
    export declare function SaveGlobalPreference(request: SaveGlobalPreferenceRequest, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function GetGlobalPreference(request: GetGlobalPreferenceRequest, onSuccess?: (response: GetGlobalPreferenceResponse) => void, opt?: ServiceOptions<any>): PromiseLike<GetGlobalPreferenceResponse>;

    export const Methods = {
        Create: "Administration/UserFormEditor/Create",
        Update: "Administration/UserFormEditor/Update",
        Delete: "Administration/UserFormEditor/Delete",
        Retrieve: "Administration/UserFormEditor/Retrieve",
        List: "Administration/UserFormEditor/List",
        SaveUserFormPreference: "Administration/UserFormEditor/SaveUserFormPreference",
        GetUserFormPreference: "Administration/UserFormEditor/GetUserFormPreference",
        SaveGlobalPreference: "Administration/UserFormEditor/SaveGlobalPreference",
        GetGlobalPreference: "Administration/UserFormEditor/GetGlobalPreference"
    } as const;

    [
        'Create', 
        'Update', 
        'Delete', 
        'Retrieve', 
        'List', 
        'SaveUserFormPreference', 
        'GetUserFormPreference', 
        'SaveGlobalPreference', 
        'GetGlobalPreference'
    ].forEach(x => {
        (<any>UserFormEditorService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}