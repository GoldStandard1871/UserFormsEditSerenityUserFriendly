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
    static readonly deletePermission = 'Administration:General';
    static readonly insertPermission = 'Administration:General';
    static readonly readPermission = 'Administration:General';
    static readonly updatePermission = 'Administration:General';

    static readonly Fields = fieldsProxy<UserFormSettingsRow>();
}