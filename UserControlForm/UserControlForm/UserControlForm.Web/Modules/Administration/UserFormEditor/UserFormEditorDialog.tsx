    import { Decorators, EntityDialog, ToolButton, Widget, WidgetProps, alertDialog, confirmDialog, notifyError, notifySuccess, notifyWarning, Authorization } from '@serenity-is/corelib';
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
        
        // Özelleştirmeleri uygula
        setTimeout(() => {
            this.applyFormCustomizations();
        }, 100);
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
        
        // Özelleştir butonu - UniversalDialogCustomizer kullanılıyor, bu kapatıldı
        // buttons.push({
        //     title: 'Özelleştir',
        //     cssClass: 'customize-fields-button',
        //     icon: 'fa-sliders',
        //     onClick: () => {
        //         this.openCustomizationDialog();
        //     }
        // });
        
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
    
    private openCustomizationDialog() {
        // Form alanlarını hazırla
        const fields = [];
        const self = this;
        
        // Form property'lerini kullan
        const form = this.form;
        if (form) {
            for (const propertyName in form) {
                if (form.hasOwnProperty(propertyName) && form[propertyName]) {
                    const widget = form[propertyName];
                    
                    // Element kontrolü
                    if (!widget.element) continue;
                    
                    const element = $(widget.element);
                    const field = element.closest('.field');
                    
                    if (field.length === 0) continue;
                    
                    const caption = field.find('.caption');
                    let displayName = caption.contents()
                        .filter(function() { return this.nodeType === 3; })
                        .text().trim();
                        
                    if (!displayName) {
                        displayName = propertyName;
                    }
                    
                    // FormDesign alanını hariç tut
                    if (propertyName === 'FormDesign') continue;
                    
                    // Zorunlu alan kontrolü
                    const isRequired = caption.find('sup').length > 0 || 
                                      element.attr('required') === 'required';
                    
                    fields.push({
                        fieldName: propertyName,
                        displayName: displayName,
                        order: fields.length,
                        visible: field.is(':visible'),
                        width: '100',
                        required: isRequired
                    });
                }
            }
        }
        
        // FormFieldOrderDialogNew'i import et ve aç
        import('./FormFieldOrderDialogNew').then(module => {
            const dialog = new module.FormFieldOrderDialogNew();
            
            // Dialog tipini ayarla
            dialog.dialogType = 'UserFormEditorDialog';
            
            // Alanları geçir
            dialog.fields = fields;
            
            // Dialog kapandığında özelleştirmeleri uygula
            dialog.dialogClose = () => {
                // Özelleştirmeleri yeniden yükle ve uygula
                setTimeout(() => {
                    self.applyFormCustomizations();
                }, 100);
            };
            
            dialog.dialogOpen();
        });
    }
    
    private applyFormCustomizations() {
        const userId = Authorization.userDefinition?.UserId || Authorization.userId;
        const userKey = `FieldCustomization:UserFormEditorDialog:User${userId}`;
        const globalRequiredKey = `FieldCustomization:UserFormEditorDialog:GlobalRequired`;
        
        // Önce global zorunlu alan bilgilerini yükle
        UserFormEditorService.GetUserFormPreference({
            PreferenceKey: globalRequiredKey
        }, globalResponse => {
            let globalRequiredFields: string[] = [];
            
            if (globalResponse.FormDesign) {
                try {
                    const globalData = JSON.parse(globalResponse.FormDesign);
                    globalRequiredFields = globalData.requiredFields || [];
                    console.log('Global zorunlu alanlar yüklendi:', globalRequiredFields);
                } catch (e) {
                    console.error('Global zorunlu alan bilgileri yüklenemedi:', e);
                }
            }
            
            // Sonra kullanıcı özelleştirmelerini yükle
            UserFormEditorService.GetUserFormPreference({
                PreferenceKey: userKey
            }, response => {
                const form = this.form;
                if (!form) return;
                
                // Önce global zorunlu alanları uygula
                globalRequiredFields.forEach(fieldName => {
                    const widget = form[fieldName];
                    if (!widget || !widget.element) return;
                    
                    const fieldElement = $(widget.element).closest('.field');
                    if (fieldElement.length === 0) return;
                    
                    const caption = fieldElement.find('.caption');
                    const existingRequired = caption.find('sup');
                    
                    if (existingRequired.length === 0) {
                        caption.append('<sup style="color: red;">*</sup>');
                    }
                });
                
                // Sonra kullanıcı özelleştirmelerini uygula (görünürlük, genişlik vb.)
                if (response.FormDesign) {
                    try {
                        const savedData = JSON.parse(response.FormDesign);
                        if (!savedData.fields || savedData.fields.length === 0) return;
                        
                        savedData.fields.forEach((customField: any) => {
                            const widget = form[customField.fieldName];
                            if (!widget || !widget.element) return;
                            
                            const fieldElement = $(widget.element).closest('.field');
                            if (fieldElement.length === 0) return;
                            
                            // Görünürlük
                            if (!customField.visible) {
                                fieldElement.hide();
                            } else {
                                fieldElement.show();
                            }
                            
                            // Zorunluluk - Global zorunlu alanlar listesinde varsa zorunlu yap
                            const caption = fieldElement.find('.caption');
                            const existingRequired = caption.find('sup');
                            
                            // Global zorunlu alan veya kullanıcı tarafından zorunlu işaretlenmiş
                            const isRequired = globalRequiredFields.includes(customField.fieldName) || customField.required;
                            
                            if (isRequired) {
                                if (existingRequired.length === 0) {
                                    caption.append('<sup style="color: red;">*</sup>');
                                }
                            } else if (!globalRequiredFields.includes(customField.fieldName)) {
                                // Global zorunlu değilse ve kullanıcı da zorunlu yapmamışsa kaldır
                                existingRequired.remove();
                            }
                        });
                        
                        notifySuccess('Form özelleştirmeleri uygulandı');
                    } catch (e) {
                        console.error('Özelleştirme uygulama hatası:', e);
                    }
                } else {
                    // Kullanıcı özelleştirmesi yoksa sadece global zorunlu alanlar uygulandı
                    if (globalRequiredFields.length > 0) {
                        notifySuccess('Zorunlu alan ayarları uygulandı');
                    }
                }
            });
        }, error => {
            // Global bilgi yüklenemese bile kullanıcı özelleştirmelerini yükle
            UserFormEditorService.GetUserFormPreference({
                PreferenceKey: userKey
            }, response => {
                if (!response.FormDesign) return;
                
                try {
                    const savedData = JSON.parse(response.FormDesign);
                    if (!savedData.fields || savedData.fields.length === 0) return;
                    
                    const form = this.form;
                    if (!form) return;
                    
                    // Özelleştirmeleri uygula
                    savedData.fields.forEach((customField: any) => {
                        const widget = form[customField.fieldName];
                        if (!widget || !widget.element) return;
                        
                        const fieldElement = $(widget.element).closest('.field');
                        if (fieldElement.length === 0) return;
                        
                        // Görünürlük
                        if (!customField.visible) {
                            fieldElement.hide();
                        } else {
                            fieldElement.show();
                        }
                        
                        // Zorunluluk
                        const caption = fieldElement.find('.caption');
                        const existingRequired = caption.find('sup');
                        
                        if (customField.required) {
                            if (existingRequired.length === 0) {
                                caption.append('<sup style="color: red;">*</sup>');
                            }
                        } else {
                            existingRequired.remove();
                        }
                    });
                    
                    notifySuccess('Form özelleştirmeleri uygulandı');
                } catch (e) {
                    console.error('Özelleştirme uygulama hatası:', e);
                }
            });
        });
    }
}