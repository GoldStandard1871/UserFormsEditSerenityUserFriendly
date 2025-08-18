import { fieldsProxy } from "@serenity-is/corelib";

export interface UserFieldSettingsRow {
    Id?: number;
    UserId?: number;
    DialogName?: string;
    FieldName?: string;
    IsVisible?: boolean;
    DisplayOrder?: number;
    CreatedDate?: string;
    UpdatedDate?: string;
}

export abstract class UserFieldSettingsRow {
    static readonly idProperty = 'Id';
    static readonly localTextPrefix = 'Administration.UserFieldSettings';
    static readonly deletePermission = '';
    static readonly insertPermission = '';
    static readonly readPermission = '';
    static readonly updatePermission = '';

    static readonly Fields = fieldsProxy<UserFieldSettingsRow>();
}