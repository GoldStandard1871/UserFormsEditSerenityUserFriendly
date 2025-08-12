import { ServiceRequest } from "@serenity-is/corelib";

export interface SaveUserSettingsRequest extends ServiceRequest {
    Settings?: string;
}