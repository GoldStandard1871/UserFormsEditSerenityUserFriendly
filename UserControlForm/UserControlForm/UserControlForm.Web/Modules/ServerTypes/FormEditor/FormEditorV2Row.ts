import { fieldsProxy } from "@serenity-is/corelib";

export interface FormEditorV2Row {
    Id?: number;
    FormName?: string;
    DisplayOrder?: number;
    IsActive?: boolean;
}

export abstract class FormEditorV2Row {
    static readonly idProperty = 'Id';
    static readonly nameProperty = 'FormName';
    static readonly localTextPrefix = 'FormEditor.FormEditorV2';
    static readonly deletePermission = 'Administration:General';
    static readonly insertPermission = 'Administration:General';
    static readonly readPermission = 'Administration:General';
    static readonly updatePermission = 'Administration:General';

    static readonly Fields = fieldsProxy<FormEditorV2Row>();
}