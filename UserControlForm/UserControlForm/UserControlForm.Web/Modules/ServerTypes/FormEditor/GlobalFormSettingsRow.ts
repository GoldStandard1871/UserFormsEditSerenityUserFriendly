import { fieldsProxy } from "@serenity-is/corelib";

export interface GlobalFormSettingsRow {
    Id?: number;
    SettingKey?: string;
    SettingValue?: string;
    InsertDate?: string;
    InsertUserId?: number;
    UpdateDate?: string;
    UpdateUserId?: number;
}

export abstract class GlobalFormSettingsRow {
    static readonly idProperty = 'Id';
    static readonly localTextPrefix = 'FormEditor.GlobalFormSettings';
    static readonly deletePermission = 'Administration:General';
    static readonly insertPermission = 'Administration:General';
    static readonly readPermission = '*';
    static readonly updatePermission = 'Administration:General';

    static readonly Fields = fieldsProxy<GlobalFormSettingsRow>();
}