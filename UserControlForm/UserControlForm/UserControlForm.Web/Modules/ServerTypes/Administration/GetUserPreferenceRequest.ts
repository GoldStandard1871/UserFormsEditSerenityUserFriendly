import { ServiceRequest } from "@serenity-is/corelib";

export interface GetUserPreferenceRequest extends ServiceRequest {
    PreferenceKey?: string;
}