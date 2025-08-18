import { ServiceResponse } from "@serenity-is/corelib";
import { UserFieldSetting } from "./UserFieldSetting";

export interface GetUserFieldSettingsResponse extends ServiceResponse {
    Settings?: UserFieldSetting[];
}