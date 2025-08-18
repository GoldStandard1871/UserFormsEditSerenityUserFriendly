import { ServiceRequest } from "@serenity-is/corelib";

export interface SaveGlobalPreferenceRequest extends ServiceRequest {
    PreferenceKey?: string;
    FormDesign?: string;
    UserId?: number;
}