import { fieldsProxy } from "@serenity-is/corelib";

export interface AdminRequiredFieldsRow {
    Id?: number;
    DialogName?: string;
    FieldName?: string;
    IsRequired?: boolean;
    CreatedDate?: string;
    CreatedBy?: number;
    UpdatedDate?: string;
    UpdatedBy?: number;
}

export abstract class AdminRequiredFieldsRow {
    static readonly idProperty = 'Id';
    static readonly localTextPrefix = 'Administration.AdminRequiredFields';
    static readonly deletePermission = 'Administration:General';
    static readonly insertPermission = 'Administration:General';
    static readonly readPermission = 'Administration:General';
    static readonly updatePermission = 'Administration:General';

    static readonly Fields = fieldsProxy<AdminRequiredFieldsRow>();
}