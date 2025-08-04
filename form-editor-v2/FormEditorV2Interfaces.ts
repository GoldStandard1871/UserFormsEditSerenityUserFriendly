export interface FormFieldSettings {
    width?: number; // 25, 50, 75, 100
    hidden?: boolean;
    fieldHidden?: boolean;
}

export interface FormLayoutSettings {
    widthMode: 'compact' | 'normal' | 'wide';
    formOrder: string[];
}

export interface UserFormSettings {
    layoutSettings: FormLayoutSettings;
    fieldSettings: {
        fieldId: string;
        width?: number;
        hidden?: boolean;
        fieldHidden?: boolean;
    }[];
}