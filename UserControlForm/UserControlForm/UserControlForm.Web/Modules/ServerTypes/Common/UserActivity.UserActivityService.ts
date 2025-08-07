import { ServiceRequest, ListResponse, ServiceOptions, serviceRequest } from "@serenity-is/corelib";
import { UserActivityInfo } from "./UserActivity.UserActivityInfo";

export namespace UserActivityService {
    export const baseUrl = 'Common/UserActivity';

    export declare function List(request: ServiceRequest, onSuccess?: (response: ListResponse<UserActivityInfo>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<UserActivityInfo>>;

    export const Methods = {
        List: "Common/UserActivity/List"
    } as const;

    [
        'List'
    ].forEach(x => {
        (<any>UserActivityService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}