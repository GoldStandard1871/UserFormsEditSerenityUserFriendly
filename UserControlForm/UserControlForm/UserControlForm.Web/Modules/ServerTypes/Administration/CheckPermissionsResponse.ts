import { ServiceResponse } from "@serenity-is/corelib";

export interface CheckPermissionsResponse extends ServiceResponse {
    IsAdmin?: boolean;
}