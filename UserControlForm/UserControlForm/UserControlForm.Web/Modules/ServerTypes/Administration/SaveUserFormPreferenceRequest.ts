import { ServiceRequest } from "@serenity-is/corelib";

export interface SaveUserFormPreferenceRequest extends ServiceRequest {
    PreferenceKey?: string;
    FormDesign?: string;
}