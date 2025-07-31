import { fieldsProxy } from "@serenity-is/corelib";

export interface UserPreferenceRow {
    UserPreferenceId?: number;
    UserId?: number;
    PreferenceType?: string;
    Name?: string;
    Value?: string;
}

export abstract class UserPreferenceRow {
    static readonly idProperty = 'UserPreferenceId';
    static readonly localTextPrefix = 'Administration.UserPreference';
    static readonly deletePermission = 'Administration:UserFormEditor';
    static readonly insertPermission = 'Administration:UserFormEditor';
    static readonly readPermission = 'Administration:UserFormEditor';
    static readonly updatePermission = 'Administration:UserFormEditor';

    static readonly Fields = fieldsProxy<UserPreferenceRow>();
}