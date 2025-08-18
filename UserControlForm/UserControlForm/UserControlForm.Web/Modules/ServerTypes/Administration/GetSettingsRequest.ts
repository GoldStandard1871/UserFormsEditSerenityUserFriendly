import { ServiceRequest } from "@serenity-is/corelib";

export interface GetSettingsRequest extends ServiceRequest {
    DialogName?: string;
}