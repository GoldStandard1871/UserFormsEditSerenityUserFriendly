import { ServiceResponse } from "@serenity-is/corelib";

export interface GetUserFormPreferenceResponse extends ServiceResponse {
    FormDesign?: string;
}