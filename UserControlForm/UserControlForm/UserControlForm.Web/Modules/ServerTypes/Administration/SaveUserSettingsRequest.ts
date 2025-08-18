import { ServiceRequest } from "@serenity-is/corelib";

export interface SaveUserSettingsRequest extends ServiceRequest {
    PreferenceKey?: string;
    Value?: string;
}