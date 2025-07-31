import { ServiceRequest } from "@serenity-is/corelib";

export interface GetUserFormPreferenceRequest extends ServiceRequest {
    PreferenceKey?: string;
}