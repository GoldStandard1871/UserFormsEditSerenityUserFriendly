import { ServiceRequest } from "@serenity-is/corelib";
import { UserFieldSetting } from "./UserFieldSetting";

export interface SaveUserFieldSettingsRequest extends ServiceRequest {
    DialogName?: string;
    Settings?: UserFieldSetting[];
}