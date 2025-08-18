import { ServiceResponse } from "@serenity-is/corelib";
import { FieldSetting } from "./FieldSetting";

export interface GetSettingsResponse extends ServiceResponse {
    Fields?: FieldSetting[];
}