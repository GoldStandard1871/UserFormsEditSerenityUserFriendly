import { SaveRequest, SaveResponse, ServiceOptions, DeleteRequest, DeleteResponse, RetrieveRequest, RetrieveResponse, ListResponse, serviceRequest } from "@serenity-is/corelib";
import { GetUserPreferenceRequest } from "./GetUserPreferenceRequest";
import { GetUserPreferenceResponse } from "./GetUserPreferenceResponse";
import { SaveUserSettingsRequest } from "./SaveUserSettingsRequest";
import { UserListRequest } from "./UserListRequest";
import { UserRow } from "./UserRow";

export namespace UserService {
    export const baseUrl = 'Administration/User';

    export declare function Create(request: SaveRequest<UserRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Update(request: SaveRequest<UserRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Delete(request: DeleteRequest, onSuccess?: (response: DeleteResponse) => void, opt?: ServiceOptions<any>): PromiseLike<DeleteResponse>;
    export declare function Retrieve(request: RetrieveRequest, onSuccess?: (response: RetrieveResponse<UserRow>) => void, opt?: ServiceOptions<any>): PromiseLike<RetrieveResponse<UserRow>>;
    export declare function List(request: UserListRequest, onSuccess?: (response: ListResponse<UserRow>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<UserRow>>;
    export declare function SaveUserSettings(request: SaveUserSettingsRequest, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function GetUserPreference(request: GetUserPreferenceRequest, onSuccess?: (response: GetUserPreferenceResponse) => void, opt?: ServiceOptions<any>): PromiseLike<GetUserPreferenceResponse>;

    export const Methods = {
        Create: "Administration/User/Create",
        Update: "Administration/User/Update",
        Delete: "Administration/User/Delete",
        Retrieve: "Administration/User/Retrieve",
        List: "Administration/User/List",
        SaveUserSettings: "Administration/User/SaveUserSettings",
        GetUserPreference: "Administration/User/GetUserPreference"
    } as const;

    [
        'Create', 
        'Update', 
        'Delete', 
        'Retrieve', 
        'List', 
        'SaveUserSettings', 
        'GetUserPreference'
    ].forEach(x => {
        (<any>UserService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}