import { fieldsProxy } from "@serenity-is/corelib";

export interface UserFormEditorRow {
    TemplateId?: number;
    FormName?: string;
    Description?: string;
    Purpose?: string;
    Instructions?: string;
    FormDesign?: string;
    CreatedBy?: number;
    CreatedDate?: string;
    ModifiedBy?: number;
    ModifiedDate?: string;
    IsActive?: boolean;
    CreatedByUsername?: string;
    ModifiedByUsername?: string;
}

export abstract class UserFormEditorRow {
    static readonly idProperty = 'TemplateId';
    static readonly nameProperty = 'FormName';
    static readonly localTextPrefix = 'Administration.UserFormEditor';
    static readonly deletePermission = 'Administration:UserFormEditor';
    static readonly insertPermission = 'Administration:UserFormEditor';
    static readonly readPermission = 'Administration:UserFormEditor';
    static readonly updatePermission = 'Administration:UserFormEditor';

    static readonly Fields = fieldsProxy<UserFormEditorRow>();
}