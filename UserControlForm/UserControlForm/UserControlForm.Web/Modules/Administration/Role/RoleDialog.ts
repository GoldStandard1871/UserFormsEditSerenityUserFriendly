import { Decorators, EntityDialog } from "@serenity-is/corelib";
import { RolePermissionDialog } from "../RolePermission/RolePermissionDialog";
import { RoleRow, RoleForm, RoleService } from "../../ServerTypes/Administration";
import { RolePermissionDialogTexts } from "../../ServerTypes/Texts";
// import { FieldCustomizer } from "../../Common/FieldCustomizer"; // UniversalDialogCustomizer kullanılıyor

const editPermissions = "edit-permissions";

@Decorators.registerClass('UserControlForm.Administration.RoleDialog')
export class RoleDialog extends EntityDialog<RoleRow> {
    protected getFormKey() { return RoleForm.formKey; }
    protected getIdProperty() { return RoleRow.idProperty; }
    protected getLocalTextPrefix() { return RoleRow.localTextPrefix; }
    protected getNameProperty() { return RoleRow.nameProperty; }
    protected getService() { return RoleService.baseUrl; }

    protected form = new RoleForm(this.idPrefix);
    
    // UniversalDialogCustomizer otomatik olarak özelleştir butonu ekleyecek
    // protected onDialogOpen(): void {
    //     super.onDialogOpen();
    //     
    //     // Form içine özelleştir butonu ekle (RoleName alanından sonra)
    //     FieldCustomizer.addCustomizeButtonToForm(this, 'RoleName', 'Alanları Düzenle');
    // }

    protected getToolbarButtons() {
        let buttons = super.getToolbarButtons();

        buttons.push({
            title: RolePermissionDialogTexts.EditButton,
            cssClass: editPermissions,
            icon: 'fa-lock text-green',
            onClick: () => {
                new RolePermissionDialog({
                    roleID: this.entity.RoleId,
                    roleName: this.entity.RoleName
                } as any).dialogOpen();
            }
        });

        return buttons;
    }

    protected updateInterface() {
        super.updateInterface();

        this.toolbar.findButton(editPermissions).toggleClass("disabled", this.isNewOrDeleted());
    }
}