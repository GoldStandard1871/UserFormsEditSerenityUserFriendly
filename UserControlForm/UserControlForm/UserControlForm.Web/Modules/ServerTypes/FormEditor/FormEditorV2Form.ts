import { StringEditor, IntegerEditor, BooleanEditor, PrefixedContext, initFormType } from "@serenity-is/corelib";

export interface FormEditorV2Form {
    FormName: StringEditor;
    DisplayOrder: IntegerEditor;
    IsActive: BooleanEditor;
}

export class FormEditorV2Form extends PrefixedContext {
    static readonly formKey = 'FormEditor.FormEditorV2';
    private static init: boolean;

    constructor(prefix: string) {
        super(prefix);

        if (!FormEditorV2Form.init)  {
            FormEditorV2Form.init = true;

            var w0 = StringEditor;
            var w1 = IntegerEditor;
            var w2 = BooleanEditor;

            initFormType(FormEditorV2Form, [
                'FormName', w0,
                'DisplayOrder', w1,
                'IsActive', w2
            ]);
        }
    }
}