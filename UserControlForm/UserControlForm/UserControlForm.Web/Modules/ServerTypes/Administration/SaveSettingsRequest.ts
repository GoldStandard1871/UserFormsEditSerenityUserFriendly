import { ServiceRequest } from "@serenity-is/corelib";
import { FieldSetting } from "./FieldSetting";

export interface SaveSettingsRequest extends ServiceRequest {
    DialogName?: string;
    Fields?: FieldSetting[];
}