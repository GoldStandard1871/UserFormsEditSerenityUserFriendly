import { ServiceRequest, ServiceResponse, RetrieveResponse, ListResponse } from "@serenity-is/corelib";

export interface FormEditorV2Row {
    Id?: number;
    FormName?: string;
    DisplayOrder?: number;
    IsActive?: boolean;
}

export namespace FormEditorV2Row {
    export const idProperty = 'Id';
    export const nameProperty = 'FormName';
    export const localTextPrefix = 'UserControlForm.FormEditorV2';

    export namespace Fields {
        export declare const Id: string;
        export declare const FormName: string;
        export declare const DisplayOrder: string;
        export declare const IsActive: string;
    }
}

export namespace FormEditorV2Form {
    export const formKey = 'UserControlForm.FormEditorV2';
}

export interface SaveUserSettingsRequest extends ServiceRequest {
    UserId: number;
    Settings: string;
}

export interface SaveUserSettingsResponse extends ServiceResponse {
}

export interface GetUserSettingsRequest extends ServiceRequest {
    UserId: number;
}

export interface GetUserSettingsResponse extends ServiceResponse {
    Settings?: string;
}