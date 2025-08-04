import { ColumnsBase, fieldsProxy } from "@serenity-is/corelib";
import { Column } from "@serenity-is/sleekgrid";
import { FormEditorV2Row } from "./FormEditorV2Row";

export interface FormEditorV2Columns {
    Id: Column<FormEditorV2Row>;
    FormName: Column<FormEditorV2Row>;
    DisplayOrder: Column<FormEditorV2Row>;
    IsActive: Column<FormEditorV2Row>;
}

export class FormEditorV2Columns extends ColumnsBase<FormEditorV2Row> {
    static readonly columnsKey = 'FormEditor.FormEditorV2';
    static readonly Fields = fieldsProxy<FormEditorV2Columns>();
}