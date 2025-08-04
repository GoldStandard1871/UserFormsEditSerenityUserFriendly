import { ServiceResponse } from "@serenity-is/corelib";

export interface GetUserSettingsResponse extends ServiceResponse {
    Settings?: string;
}