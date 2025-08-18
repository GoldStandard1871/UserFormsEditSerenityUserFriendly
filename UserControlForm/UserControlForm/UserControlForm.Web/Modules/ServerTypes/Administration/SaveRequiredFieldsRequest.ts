import { ServiceRequest } from "@serenity-is/corelib";

export interface SaveRequiredFieldsRequest extends ServiceRequest {
    DialogName?: string;
    RequiredFields?: string[];
}