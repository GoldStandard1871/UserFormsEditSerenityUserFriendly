import { Decorators, EntityDialog } from "@serenity-is/corelib";
import { CompanyForm, CompanyRow, CompanyService } from "../../ServerTypes/Administration";
import { EnableCustomization } from "../../Common/DialogExtensions";

@Decorators.registerClass()
@EnableCustomization(true) // Özelleştirmeyi aktif et
export class CompanyDialog extends EntityDialog<CompanyRow> {
    protected getFormKey() { return CompanyForm.formKey; }
    protected getIdProperty() { return CompanyRow.idProperty; }
    protected getLocalTextPrefix() { return CompanyRow.localTextPrefix; }
    protected getNameProperty() { return CompanyRow.nameProperty; }
    protected getService() { return CompanyService.baseUrl; }

    protected form = new CompanyForm(this.idPrefix);
}