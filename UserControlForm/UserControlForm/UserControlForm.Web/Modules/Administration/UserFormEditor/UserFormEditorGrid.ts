import { Decorators, EntityGrid, ToolButton } from '@serenity-is/corelib';
import { UserFormEditorColumns, UserFormEditorRow, UserFormEditorService } from '../../ServerTypes/Administration';
import { UserFormEditorDialog } from './UserFormEditorDialog';
import { SimpleFormDialog } from '../SimpleForm/SimpleFormDialog';
import { FormFieldOrderDialog } from './FormFieldOrderDialog';

@Decorators.registerClass()
export class UserFormEditorGrid extends EntityGrid<UserFormEditorRow> {
    protected getColumnsKey() { return UserFormEditorColumns.columnsKey; }
    protected getDialogType() { return FormFieldOrderDialog; }
    protected getIdProperty() { return UserFormEditorRow.idProperty; }
    protected getInsertPermission() { return UserFormEditorRow.insertPermission; }
    protected getLocalTextPrefix() { return UserFormEditorRow.localTextPrefix; }
    protected getService() { return UserFormEditorService.baseUrl; }

    constructor(container: HTMLElement) {
        super(container);
    }

    protected getButtons(): ToolButton[] {
        const buttons = super.getButtons();
        
        // Simple Form butonu kaldırıldı - artık varsayılan dialog FormFieldOrderDialog

        return buttons;
    }
}