import { ServiceRequest } from "@serenity-is/corelib";

export interface GetUserFieldSettingsRequest extends ServiceRequest {
    DialogName?: string;
}