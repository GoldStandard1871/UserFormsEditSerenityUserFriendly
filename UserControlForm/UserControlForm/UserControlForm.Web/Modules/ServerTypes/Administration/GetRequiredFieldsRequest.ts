import { ServiceRequest } from "@serenity-is/corelib";

export interface GetRequiredFieldsRequest extends ServiceRequest {
    DialogName?: string;
}