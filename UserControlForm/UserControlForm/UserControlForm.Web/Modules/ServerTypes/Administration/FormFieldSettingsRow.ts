import { fieldsProxy } from "@serenity-is/corelib";

export interface FormFieldSettingsRow {
    Id?: number;
    DialogName?: string;
    FieldName?: string;
    IsRequired?: boolean;
    DisplayOrder?: number;
    IsHidden?: boolean;
    CreatedBy?: number;
    CreatedDate?: string;
    ModifiedBy?: number;
    ModifiedDate?: string;
}

export abstract class FormFieldSettingsRow {
    static readonly idProperty = 'Id';
    static readonly localTextPrefix = 'Administration.FormFieldSettings';
    static readonly deletePermission = 'Administration:General';
    static readonly insertPermission = 'Administration:General';
    static readonly readPermission = 'Administration:General';
    static readonly updatePermission = 'Administration:General';

    static readonly Fields = fieldsProxy<FormFieldSettingsRow>();
}