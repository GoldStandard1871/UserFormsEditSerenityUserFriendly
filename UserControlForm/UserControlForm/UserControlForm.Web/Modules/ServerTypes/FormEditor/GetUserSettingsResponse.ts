import { ServiceResponse } from "@serenity-is/corelib";

export interface GetUserSettingsResponse extends ServiceResponse {
    Settings?: string;
    UserId?: number;
    Username?: string;
    IsAdmin?: boolean;
    RequiredFields?: string[];
}