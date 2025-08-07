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
    static readonly deletePermission = 'FormEditor:Edit';
    static readonly insertPermission = 'FormEditor:Edit';
    static readonly readPermission = 'FormEditor:View';
    static readonly updatePermission = 'FormEditor:Edit';

    static readonly Fields = fieldsProxy<FormEditorV2Row>();
}