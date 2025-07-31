import { StringEditor, IntegerEditor, PrefixedContext, initFormType } from "@serenity-is/corelib";

export interface MovieForm {
    Name: StringEditor;
    Type: IntegerEditor;
    Description: StringEditor;
}

export class MovieForm extends PrefixedContext {
    static readonly formKey = 'Integration.Movie';
    private static init: boolean;

    constructor(prefix: string) {
        super(prefix);

        if (!MovieForm.init)  {
            MovieForm.init = true;

            var w0 = StringEditor;
            var w1 = IntegerEditor;

            initFormType(MovieForm, [
                'Name', w0,
                'Type', w1,
                'Description', w0
            ]);
        }
    }
}