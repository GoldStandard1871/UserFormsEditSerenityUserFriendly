import { ServiceRequest } from "@serenity-is/corelib";

export interface GetGlobalPreferenceRequest extends ServiceRequest {
    PreferenceKey?: string;
    UserId?: number;
}