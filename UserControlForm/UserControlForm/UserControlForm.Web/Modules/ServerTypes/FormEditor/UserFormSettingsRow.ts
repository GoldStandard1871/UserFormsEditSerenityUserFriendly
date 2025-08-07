import { fieldsProxy } from "@serenity-is/corelib";

export interface UserFormSettingsRow {
    Id?: number;
    UserId?: number;
    Settings?: string;
    InsertDate?: string;
    InsertUserId?: number;
    UpdateDate?: string;
    UpdateUserId?: number;
}

export abstract class UserFormSettingsRow {
    static readonly idProperty = 'Id';
    static readonly localTextPrefix = 'FormEditor.UserFormSettings';
    static readonly deletePermission = 'FormEditor:Edit';
    static readonly insertPermission = 'FormEditor:Edit';
    static readonly readPermission = 'FormEditor:View';
    static readonly updatePermission = 'FormEditor:Edit';

    static readonly Fields = fieldsProxy<UserFormSettingsRow>();
}