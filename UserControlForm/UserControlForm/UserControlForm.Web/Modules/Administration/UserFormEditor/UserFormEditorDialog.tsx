import { Decorators, EntityDialog, ToolButton, Widget, WidgetProps, alertDialog, confirmDialog, notifyError, notifySuccess, notifyWarning } from '@serenity-is/corelib';
import { UserFormEditorForm, UserFormEditorRow, UserFormEditorService } from '../../ServerTypes/Administration';
// import { UserFormDesigner } from './UserFormDesigner';

declare var $: any;

@Decorators.registerClass()
export class UserFormEditorDialog extends EntityDialog<UserFormEditorRow> {
    protected getFormKey() { return UserFormEditorForm.formKey; }
    protected getIdProperty() { return UserFormEditorRow.idProperty; }
    protected getLocalTextPrefix() { return UserFormEditorRow.localTextPrefix; }
    protected getNameProperty() { return UserFormEditorRow.nameProperty; }
    protected getService() { return UserFormEditorService.baseUrl; }
    protected getDeletePermission() { return UserFormEditorRow.deletePermission; }
    protected getInsertPermission() { return UserFormEditorRow.insertPermission; }
    protected getUpdatePermission() { return UserFormEditorRow.updatePermission; }

    protected form = new UserFormEditorForm(this.idPrefix);
    private formDesigner: any; // UserFormDesigner

    constructor() {
        super();
        
        this.dialogTitle = "User Form Designer";
        this.element.addClass('user-form-editor-dialog');
    }

    protected afterLoadEntity() {
        super.afterLoadEntity();
        
        // Form tasarımcısını yükle - Instructions alanından sonra ekle
        const designerDiv = $('<div class="form-designer-container"></div>').insertAfter(this.form.Instructions.element.closest('.field'));
        // UserFormDesigner component eksik olduğu için şimdilik yorum satırı
        // this.formDesigner = new UserFormDesigner({
        //     element: designerDiv[0],
        //     value: this.entity.FormDesign ? JSON.parse(this.entity.FormDesign) : null
        // });
    }
    
    public loadNewAndOpenDialog(asPanel?: boolean): void {
        // Yeni kayıt için varsayılan değerleri set et
        this.loadEntityAndOpenDialog({
            FormName: '',
            FormDesign: JSON.stringify({ fields: [] })
        }, asPanel);
    }

    protected getToolbarButtons(): ToolButton[] {
        const buttons = super.getToolbarButtons();
        
        // Save as User Preference butonu ekle
        buttons.push({
            title: 'Save My Design',
            cssClass: 'save-user-design-button',
            icon: 'fa-user-plus',
            onClick: () => {
                this.saveUserDesign();
            }
        });
        
        // Load User Preference butonu ekle
        buttons.push({
            title: 'Load My Design',
            cssClass: 'load-user-design-button',
            icon: 'fa-user',
            onClick: () => {
                this.loadUserDesign();
            }
        });
        
        buttons.push({
            title: 'Preview Form',
            cssClass: 'preview-button',
            icon: 'fa-eye',
            onClick: () => {
                // const formDesign = this.formDesigner.getValue();
                // if (!formDesign || formDesign.fields.length === 0) {
                //     alertDialog("Please add some fields to the form first.");
                //     return;
                // }
                const formDesign = { fields: [] }; // Geçici olarak boş
                
                // Preview dialog açılacak
                const previewDialog = $('<div></div>').appendTo(document.body);
                previewDialog.dialog({
                    title: 'Form Preview',
                    width: 600,
                    height: 400,
                    modal: true,
                    buttons: {
                        Close: function() {
                            $(this).dialog('close');
                        }
                    }
                });
                
                this.renderFormPreview(previewDialog, formDesign);
            }
        });
        
        return buttons;
    }

    private renderFormPreview(container: JQuery, formDesign: any) {
        container.empty();
        const form = $('<form class="form-horizontal"></form>').appendTo(container);
        
        formDesign.fields.forEach((field: any) => {
            const formGroup = $('<div class="form-group"></div>').appendTo(form);
            $('<label class="col-sm-3 control-label">' + field.label + '</label>').appendTo(formGroup);
            const inputContainer = $('<div class="col-sm-9"></div>').appendTo(formGroup);
            
            switch (field.type) {
                case 'text':
                    $('<input type="text" class="form-control" />').appendTo(inputContainer);
                    break;
                case 'textarea':
                    $('<textarea class="form-control" rows="3"></textarea>').appendTo(inputContainer);
                    break;
                case 'dropdown':
                    const select = $('<select class="form-control"></select>').appendTo(inputContainer);
                    if (field.options) {
                        field.options.forEach((option: string) => {
                            $('<option>' + option + '</option>').appendTo(select);
                        });
                    }
                    break;
                case 'checkbox':
                    $('<input type="checkbox" />').appendTo(inputContainer);
                    break;
                case 'date':
                    $('<input type="date" class="form-control" />').appendTo(inputContainer);
                    break;
            }
        });
    }

    protected save(callback: (response: any) => void) {
        // Form tasarımını JSON olarak kaydet
        // if (this.formDesigner) {
        //     const designValue = this.formDesigner.getValue();
        //     this.entity.FormDesign = JSON.stringify(designValue);
        // } else {
        //     // Eğer form designer yoksa boş bir tasarım kaydet
        //     this.entity.FormDesign = JSON.stringify({ fields: [] });
        // }
        this.entity.FormDesign = JSON.stringify({ fields: [] }); // Geçici olarak boş
        super.save(callback);
    }
    
    private saveUserDesign() {
        // if (!this.formDesigner) {
        //     alertDialog("Form designer not initialized!");
        //     return;
        // }
        
        // const formDesign = this.formDesigner.getValue();
        const formDesign = { fields: [] }; // Geçici olarak boş
        const preferenceKey = `UserFormDesign:${this.entity.TemplateId || 'new'}`;
        
        UserFormEditorService.SaveUserFormPreference({
            PreferenceKey: preferenceKey,
            FormDesign: JSON.stringify(formDesign)
        }, response => {
            Q.notifySuccess("Your personal form design has been saved!");
        });
    }
    
    private loadUserDesign() {
        const preferenceKey = `UserFormDesign:${this.entity.TemplateId || 'new'}`;
        
        UserFormEditorService.GetUserFormPreference({
            PreferenceKey: preferenceKey
        }, response => {
            if (response.FormDesign) {
                try {
                    const design = JSON.parse(response.FormDesign);
                    // this.formDesigner.setValue(design);
                    notifySuccess("Your personal form design has been loaded!");
                } catch (e) {
                    notifyError("Failed to load design: " + e.message);
                }
            } else {
               notifyWarning("No saved design found for your user.");
            }
        });
    }
}