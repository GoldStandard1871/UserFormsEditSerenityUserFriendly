import { StringEditor, TextAreaEditor, PrefixedContext, initFormType } from "@serenity-is/corelib";

export interface UserFormEditorForm {
    FormName: StringEditor;
    Description: TextAreaEditor;
    Purpose: TextAreaEditor;
    Instructions: TextAreaEditor;
    FormDesign: StringEditor;
}

export class UserFormEditorForm extends PrefixedContext {
    static readonly formKey = 'Administration.UserFormEditor';
    private static init: boolean;

    constructor(prefix: string) {
        super(prefix);

        if (!UserFormEditorForm.init)  {
            UserFormEditorForm.init = true;

            var w0 = StringEditor;
            var w1 = TextAreaEditor;

            initFormType(UserFormEditorForm, [
                'FormName', w0,
                'Description', w1,
                'Purpose', w1,
                'Instructions', w1,
                'FormDesign', w0
            ]);
        }
    }
}