import { Decorators, EntityDialog } from "@serenity-is/corelib"
import { LanguageRow, LanguageForm, LanguageService } from "../../ServerTypes/Administration";
// import { FieldCustomizer } from "../../Common/FieldCustomizer"; // UniversalDialogCustomizer kullanılıyor

@Decorators.registerClass('UserControlForm.Administration.LanguageDialog')
export class LanguageDialog extends EntityDialog<LanguageRow> {
    protected getFormKey() { return LanguageForm.formKey; }
    protected getIdProperty() { return LanguageRow.idProperty; }
    protected getLocalTextPrefix() { return LanguageRow.localTextPrefix; }
    protected getNameProperty() { return LanguageRow.nameProperty; }
    protected getService() { return LanguageService.baseUrl; }

    protected form = new LanguageForm(this.idPrefix);
    
    // UniversalDialogCustomizer otomatik olarak özelleştir butonu ekleyecek
    // protected onDialogOpen(): void {
    //     super.onDialogOpen();
    //     
    //     // Toolbar'a özelleştir butonu ekle
    //     FieldCustomizer.addCustomizeButton(this);
    // }
}