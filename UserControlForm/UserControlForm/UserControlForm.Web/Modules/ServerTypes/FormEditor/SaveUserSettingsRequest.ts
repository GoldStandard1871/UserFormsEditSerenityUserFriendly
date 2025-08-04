import { ServiceRequest } from "@serenity-is/corelib";

export interface SaveUserSettingsRequest extends ServiceRequest {
    UserId?: number;
    Settings?: string;
}