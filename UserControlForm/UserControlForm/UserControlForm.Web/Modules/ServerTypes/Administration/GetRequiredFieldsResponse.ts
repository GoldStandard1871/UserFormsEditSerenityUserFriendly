import { ServiceResponse } from "@serenity-is/corelib";

export interface GetRequiredFieldsResponse extends ServiceResponse {
    RequiredFields?: string[];
}