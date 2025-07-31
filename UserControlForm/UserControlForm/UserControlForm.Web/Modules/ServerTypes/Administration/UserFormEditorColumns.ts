import { ColumnsBase, fieldsProxy } from "@serenity-is/corelib";
import { Column } from "@serenity-is/sleekgrid";
import { UserFormEditorRow } from "./UserFormEditorRow";

export interface UserFormEditorColumns {
    TemplateId: Column<UserFormEditorRow>;
    FormName: Column<UserFormEditorRow>;
    CreatedByUsername: Column<UserFormEditorRow>;
    CreatedDate: Column<UserFormEditorRow>;
    ModifiedByUsername: Column<UserFormEditorRow>;
    ModifiedDate: Column<UserFormEditorRow>;
}

export class UserFormEditorColumns extends ColumnsBase<UserFormEditorRow> {
    static readonly columnsKey = 'Administration.UserFormEditor';
    static readonly Fields = fieldsProxy<UserFormEditorColumns>();
}