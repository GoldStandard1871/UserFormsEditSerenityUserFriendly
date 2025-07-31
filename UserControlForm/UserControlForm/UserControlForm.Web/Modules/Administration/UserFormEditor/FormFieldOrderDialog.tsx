import { Decorators, EntityDialog, ToolButton, Authorization, notifySuccess } from '@serenity-is/corelib';
import { UserFormEditorForm, UserFormEditorRow, UserFormEditorService } from '../../ServerTypes/Administration';

declare var $: any;

interface FieldOrder {
    fieldName: string;
    displayName: string;
    order: number;
    visible: boolean;
    width?: string;
}

@Decorators.registerClass()
export class FormFieldOrderDialog extends EntityDialog<UserFormEditorRow> {
    protected getFormKey() { return UserFormEditorForm.formKey; }
    protected getIdProperty() { return UserFormEditorRow.idProperty; }
    protected getLocalTextPrefix() { return UserFormEditorRow.localTextPrefix; }
    protected getNameProperty() { return UserFormEditorRow.nameProperty; }
    protected getService() { return UserFormEditorService.baseUrl; }
    
    private getDialogType(): string {
        return 'UserControlForm.Administration.FormFieldOrderDialog';
    }
    
    private getFormIdentifier(): string {
        // Form ID varsa kullan, yoksa form adını kullan
        if (this.entity?.TemplateId) {
            return `Form${this.entity.TemplateId}`;
        } else if (this.entity?.FormName) {
            // Form adındaki özel karakterleri temizle
            return `FormName_${this.entity.FormName.replace(/[^a-zA-Z0-9]/g, '_')}`;
        }
        return 'FormNew';
    }

    protected form = new UserFormEditorForm(this.idPrefix);
    private fieldOrders: FieldOrder[] = [];
    private draggedElement: JQuery;
    private controlsVisible: boolean;
    private showHiddenFields: boolean = false;

    constructor() {
        super();
        this.dialogTitle = "Customize Form Fields";
        this.element.addClass('s-FormFieldOrderDialog');
        
        // Show Controls ayarını localStorage'dan yükle
        const savedControlsVisibility = localStorage.getItem('FormFieldOrderDialog.controlsVisible');
        this.controlsVisible = savedControlsVisibility !== 'false'; // varsayılan true
    }

    protected afterLoadEntity() {
        super.afterLoadEntity();
        
        // Show Controls varsayılan olarak açık olsun (SQL'den yükleme)
        
        // Kullanıcının kayıtlı sıralamasını yükle
        this.loadUserFieldOrder();
        
        // Biraz gecikme ile kontrolleri ekle
        setTimeout(() => {
            this.addDragControls();
            // Kontrollerin görünürlüğünü ayarla
            if (!this.controlsVisible) {
                $(this.element).find('.field-drag-controls').hide();
            }
        }, 100);
    }

    private loadUserFieldOrder() {
        const userId = Authorization.userDefinition?.UserId || Authorization.userId;
        const formIdentifier = this.getFormIdentifier();
        const preferenceKey = `UserFormFieldOrder:${this.getDialogType()}:${formIdentifier}:User${userId}`;
        
        UserFormEditorService.GetUserFormPreference({
            PreferenceKey: preferenceKey
        }, response => {
            if (response.FormDesign) {
                try {
                    const savedOrder = JSON.parse(response.FormDesign);
                    this.fieldOrders = savedOrder.fields || this.getDefaultFieldOrder();
                } catch (e) {
                    this.fieldOrders = this.getDefaultFieldOrder();
                }
            } else {
                this.fieldOrders = this.getDefaultFieldOrder();
            }
            this.applyFieldOrder();
            this.addDragControls();
        });
    }

    private getDefaultFieldOrder(): FieldOrder[] {
        return [
            { fieldName: 'FormName', displayName: 'Form Name', order: 0, visible: true, width: '50' },
            { fieldName: 'Description', displayName: 'Description', order: 1, visible: true, width: '100' },
            { fieldName: 'Purpose', displayName: 'Purpose', order: 2, visible: true, width: '100' },
            { fieldName: 'Instructions', displayName: 'Instructions', order: 3, visible: true, width: '100' }
        ];
    }

    private addDragControls() {
        console.log('Adding drag controls...', this.fieldOrders);
        
        // Her form alanına drag kontrolü ekle
        this.fieldOrders.forEach(field => {
            const element = this.form[field.fieldName]?.element;
            if (!element) {
                console.log(`Field ${field.fieldName} not found`);
                return;
            }
            
            const fieldElement = $(element).closest('.field');
            console.log(`Field ${field.fieldName}:`, fieldElement);
            
            if (fieldElement && fieldElement.length) {
                // Mevcut kontrolleri temizle
                fieldElement.find('.field-drag-controls').remove();
                
                // Drag kontrol container'ı oluştur
                const controls = $('<div class="field-drag-controls"></div>');
                
                // Yukarı/Aşağı butonları
                $('<button class="move-up" title="Move Up"><i class="fa fa-chevron-up"></i></button>')
                    .on('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.moveField(field, -1);
                    })
                    .appendTo(controls);
                    
                $('<button class="move-down" title="Move Down"><i class="fa fa-chevron-down"></i></button>')
                    .on('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.moveField(field, 1);
                    })
                    .appendTo(controls);
                
                // Gizle/Göster butonu
                const visibilityBtn = $(`<button class="toggle-visibility" title="${field.visible ? 'Gizle' : 'Göster'}">
                    <i class="fa ${field.visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                </button>`);
                visibilityBtn.on('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Toggle visibility clicked for field:', field.fieldName);
                    this.toggleFieldVisibility(field, fieldElement);
                });
                visibilityBtn.appendTo(controls);
                
                // Width dropdown menü
                const widthSelect = $('<select class="field-width-select" title="Alan Genişliği"></select>');
                widthSelect.append('<option value="33">Küçük (33%)</option>');
                widthSelect.append('<option value="50">Orta (50%)</option>');
                widthSelect.append('<option value="75">Büyük (75%)</option>');
                widthSelect.append('<option value="100">Tam (100%)</option>');
                widthSelect.val(field.width || '100');
                widthSelect.on('change', () => {
                    field.width = widthSelect.val() as string;
                    this.applyFieldWidth(fieldElement, field.width);
                    // Değişikliği kaydet
                    this.saveFieldOrder();
                });
                widthSelect.appendTo(controls);
                
                // Kontrolü field'ın başına ekle
                fieldElement.prepend(controls);
                
                // Width'i başlangıçta uygula
                this.applyFieldWidth(fieldElement, field.width || '100');
                
                // Gizli alanları işaretle ve gizle
                if (!field.visible && !this.showHiddenFields) {
                    // Field'ı gizle
                    fieldElement.addClass('field-hidden');
                    fieldElement.find('.toggle-visibility i').removeClass('fa-eye').addClass('fa-eye-slash');
                    fieldElement.find('.toggle-visibility').attr('title', 'Göster');
                    fieldElement.hide();
                } else if (!field.visible && this.showHiddenFields) {
                    // Show Hidden Fields aktifse gizli alanları göster
                    fieldElement.addClass('field-hidden-showing');
                    fieldElement.find('.toggle-visibility i').removeClass('fa-eye').addClass('fa-eye-slash');
                    fieldElement.find('.toggle-visibility').attr('title', 'Göster');
                    fieldElement.css('opacity', '0.6');
                    fieldElement.css('background-color', '#fff3cd');
                }
            }
        });
    }
    
    private moveField(field: FieldOrder, direction: number) {
        const currentIndex = this.fieldOrders.findIndex(f => f.fieldName === field.fieldName);
        const newIndex = currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.fieldOrders.length) {
            // Swap positions
            const temp = this.fieldOrders[currentIndex];
            this.fieldOrders[currentIndex] = this.fieldOrders[newIndex];
            this.fieldOrders[newIndex] = temp;
            
            this.updateFieldOrder();
            this.applyFieldOrder();
            this.addDragControls();
            
            // Değişikliği kaydet
            this.saveFieldOrder();
        }
    }
    
    private toggleFieldVisibility(field: FieldOrder, fieldElement: JQuery) {
        console.log('Toggling visibility for field:', field.fieldName, 'Current visible:', field.visible);
        
        field.visible = !field.visible;
        
        if (field.visible) {
            console.log('Making field visible:', field.fieldName);
            fieldElement.removeClass('field-hidden');
            fieldElement.find('.toggle-visibility i').removeClass('fa-eye-slash').addClass('fa-eye');
            fieldElement.find('.toggle-visibility').attr('title', 'Gizle');
            
            // CSS stillerini temizle
            fieldElement.css({
                'width': '',
                'min-width': '',
                'max-width': '',
                'padding': '',
                'background': '',
                'border': ''
            });
            
            // Field drag controls'ü normale döndür
            fieldElement.find('.field-drag-controls').css({
                'float': '',
                'margin': '',
                'display': '',
                'background': '',
                'border': ''
            });
            
            // Alanı ve içeriğini göster
            fieldElement.show();
            fieldElement.children().show();
            
            // Alan genişliğini tekrar uygula
            this.applyFieldWidth(fieldElement, field.width || '100');
        } else {
            console.log('Hiding field:', field.fieldName);
            fieldElement.addClass('field-hidden');
            fieldElement.find('.toggle-visibility i').removeClass('fa-eye').addClass('fa-eye-slash');
            fieldElement.find('.toggle-visibility').attr('title', 'Göster');
            
            // Alanı gizle
            if (!this.showHiddenFields) {
                fieldElement.hide();
            }
        }
        
        // Değişikliği kaydet
        this.saveFieldOrder();
    }
    
    
    private updateFieldOrder() {
        this.fieldOrders.forEach((field, index) => {
            field.order = index;
        });
    }

    private applyFieldOrder() {
        // Form alanlarını yeni sıraya göre düzenle
        const formNameElement = this.form.FormName?.element;
        if (!formNameElement) return;
        
        const formContainer = $(formNameElement).closest('.categories');
        
        // Container'a clearfix ve row class ekle
        formContainer.addClass('clearfix row');
        
        // Önce tüm alanları ekle
        this.fieldOrders.sort((a, b) => a.order - b.order).forEach(field => {
            const element = this.form[field.fieldName]?.element;
            if (element) {
                const fieldElement = $(element).closest('.field');
                if (fieldElement && fieldElement.length) {
                    if (field.visible) {
                        // Görünür alan
                        fieldElement.removeClass('field-hidden field-hidden-showing');
                        fieldElement.find('input, textarea, select').removeAttr('disabled');
                        fieldElement.show();
                        
                        // CSS stillerini temizle
                        fieldElement.css({
                            'width': '',
                            'min-width': '',
                            'max-width': '',
                            'padding': '',
                            'margin': '',
                            'background': '',
                            'border': '',
                            'opacity': '',
                            'background-color': ''
                        });
                        
                        // Tüm içeriği göster
                        fieldElement.children().show();
                    } else {
                        // Gizli alan
                        fieldElement.addClass('field-hidden');
                        
                        // Show Hidden Fields açıksa farklı stil uygula
                        if (this.showHiddenFields) {
                            fieldElement.addClass('field-hidden-showing');
                            fieldElement.show();
                            fieldElement.css({
                                'opacity': '0.6',
                                'background-color': '#fff3cd'
                            });
                        } else {
                            fieldElement.removeClass('field-hidden-showing');
                            // Alanı gizle
                            fieldElement.hide();
                        }
                    }
                    
                    formContainer.append(fieldElement);
                    
                    // Width'i sadece görünür alanlara uygula
                    if (field.visible || this.showHiddenFields) {
                        this.applyFieldWidth(fieldElement, field.width || '100');
                    }
                }
            }
        });
    }

    private applyFieldWidth(fieldElement: JQuery, width: string) {
        // Tüm Bootstrap col class'larını kaldır
        fieldElement.removeClass('col-1 col-2 col-3 col-4 col-5 col-6 col-7 col-8 col-9 col-10 col-11 col-12 col-sm-1 col-sm-2 col-sm-3 col-sm-4 col-sm-5 col-sm-6 col-sm-7 col-sm-8 col-sm-9 col-sm-10 col-sm-11 col-sm-12 col-md-1 col-md-2 col-md-3 col-md-4 col-md-5 col-md-6 col-md-7 col-md-8 col-md-9 col-md-10 col-md-11 col-md-12 col-lg-1 col-lg-2 col-lg-3 col-lg-4 col-lg-5 col-lg-6 col-lg-7 col-lg-8 col-lg-9 col-lg-10 col-lg-11 col-lg-12');
        
        // Width değerine göre Bootstrap class ekle
        if (width === '33') {
            fieldElement.addClass('col-12 col-sm-6 col-md-4 col-lg-4');
        } else if (width === '50') {
            fieldElement.addClass('col-12 col-sm-12 col-md-6 col-lg-6');
        } else if (width === '75') {
            fieldElement.addClass('col-12 col-sm-12 col-md-9 col-lg-9');
        } else {
            fieldElement.addClass('col-12');
        }
        
        console.log(`Applied col class for width ${width} to field`, fieldElement);
    }

    protected getToolbarButtons(): ToolButton[] {
        const buttons = super.getToolbarButtons();
        
        // Save Order butonunu ekle
        buttons.splice(0, 0, {
            title: 'Save My Field Order',
            cssClass: 'save-order-button',
            icon: 'fa-save',
            onClick: () => this.saveFieldOrder()
        });
        
        // Reset butonu
        buttons.splice(1, 0, {
            title: 'Reset to Default',
            cssClass: 'reset-order-button',
            icon: 'fa-refresh',
            onClick: () => {
                // Varsayılan sıralama ve görünürlükleri al
                this.fieldOrders = this.getDefaultFieldOrder();
                
                // Tüm alanları görünür yap
                this.fieldOrders.forEach(field => {
                    field.visible = true;
                });
                
                // Değişiklikleri uygula
                this.applyFieldOrder();
                this.addDragControls();
                
                // Reset sonrası kaydet
                this.saveFieldOrder();
                
                // Show Hidden Fields'ı kapat
                if (this.showHiddenFields) {
                    this.showHiddenFields = false;
                    $(this.element).removeClass('show-hidden-fields');
                    const showHiddenButton = this.toolbar.findButton('.show-hidden-fields-button');
                    if (showHiddenButton && showHiddenButton.length) {
                        $(showHiddenButton).attr('title', 'Gizli Alanları Göster');
                        $(showHiddenButton).attr('data-original-title', 'Gizlediğiniz alanları tekrar getirmek için tıklayınız');
                    }
                }
                
                notifySuccess("Form alanları varsayılan ayarlara döndürüldü!");
            }
        });
        
        
        // Toggle Controls butonu - Delete butonunun sağına ekle
        const deleteButtonIndex = buttons.findIndex(b => b.cssClass?.includes('delete-button'));
        if (deleteButtonIndex >= 0) {
            buttons.splice(deleteButtonIndex + 1, 0, {
                title: this.controlsVisible ? 'Form Düzen Araçlarını Gizle' : 'Form Düzen Araçlarını Göster',
                cssClass: 'toggle-controls-button',
                icon: this.controlsVisible ? 'fa-eye-slash' : 'fa-eye',
                onClick: () => this.toggleFieldControls()
            });
            
            // Show Hidden Fields butonu
            buttons.splice(deleteButtonIndex + 2, 0, {
                title: this.showHiddenFields ? 'Gizli Alanları Gizle' : 'Gizli Alanları Göster',
                cssClass: 'show-hidden-fields-button',
                icon: 'fa-low-vision',
                hint: this.showHiddenFields ? 'Gizli alanları tekrar gizlemek için tıklayınız' : 'Gizlediğiniz alanları tekrar getirmek için tıklayınız',
                onClick: () => this.toggleShowHiddenFields()
            });
        }
        
        return buttons;
    }

    private toggleFieldControls() {
        this.controlsVisible = !this.controlsVisible;
        
        // Dialog'a class ekle/kaldır
        if (this.controlsVisible) {
            $(this.element).removeClass('controls-hidden');
        } else {
            $(this.element).addClass('controls-hidden');
        }
        
        // Tüm field kontrollerini göster/gizle
        $(this.element).find('.field-drag-controls').toggle(this.controlsVisible);
        
        // Toolbar butonunun icon ve title'ını güncelle
        const button = this.toolbar.findButton('.toggle-controls-button');
        if (button && button.length) {
            $(button).find('i').removeClass('fa-eye fa-eye-slash').addClass(this.controlsVisible ? 'fa-eye-slash' : 'fa-eye');
            $(button).attr('title', this.controlsVisible ? 'Form Düzen Araçlarını Gizle' : 'Form Düzen Araçlarını Göster');
        }
        
        // Show Controls durumu localStorage'a kaydedilir
        localStorage.setItem('FormFieldOrderDialog.controlsVisible', this.controlsVisible.toString());
    }

    private saveFieldOrder() {
        const userId = Authorization.userDefinition?.UserId || Authorization.userId;
        const formIdentifier = this.getFormIdentifier();
        const key = `UserFormFieldOrder:${this.getDialogType()}:${formIdentifier}:User${userId}`;
        
        console.log('Saving field order for user:', userId);
        console.log('PreferenceKey:', key);
        console.log('Field order:', this.fieldOrders);
        
        UserFormEditorService.SaveUserFormPreference({
            PreferenceKey: key,
            FormDesign: JSON.stringify({ fields: this.fieldOrders })
        }, (response) => {
            console.log('Save response:', response);
            notifySuccess("Your field order has been saved!");
        });
    }

    protected save(callback: (response: any) => void) {
        // Kaydetmeden önce tüm alanları göster ve gizli alanları validation'dan hariç tut
        this.fieldOrders.forEach(field => {
            const element = this.form[field.fieldName]?.element;
            if (element) {
                const fieldElement = $(element).closest('.field');
                if (fieldElement && fieldElement.length) {
                    if (field.visible) {
                        fieldElement.show();
                        fieldElement.removeClass('field-hidden');
                        // Görünür alanlar için validation'ı aktif et
                        fieldElement.find('input, textarea, select').removeAttr('disabled');
                    } else {
                        // Gizli alanları göster ama disable et
                        fieldElement.show();
                        fieldElement.removeClass('field-hidden');
                        // Gizli alanları disable ederek validation'dan hariç tut
                        fieldElement.find('input, textarea, select').attr('disabled', 'disabled');
                    }
                }
            }
        });
        
        // Kaydetme işlemini yap
        const originalCallback = callback;
        super.save((response) => {
            // Kaydetme sonrası alanları tekrar düzenle
            this.applyFieldOrder();
            this.addDragControls();
            
            if (originalCallback) {
                originalCallback(response);
            }
        });
    }
    
    
    private toggleShowHiddenFields() {
        this.showHiddenFields = !this.showHiddenFields;
        
        // Dialog'a class ekle/kaldır
        if (this.showHiddenFields) {
            $(this.element).addClass('show-hidden-fields');
        } else {
            $(this.element).removeClass('show-hidden-fields');
        }
        
        // Gizli alanları göster/gizle
        this.fieldOrders.forEach(field => {
            if (!field.visible) {
                const element = this.form[field.fieldName]?.element;
                if (element) {
                    const fieldElement = $(element).closest('.field');
                    if (fieldElement && fieldElement.length) {
                        if (this.showHiddenFields) {
                            // Gizli alanları geçici olarak göster
                            fieldElement.removeClass('field-hidden-temp');
                            fieldElement.addClass('field-hidden-showing');
                            
                            // Alanı göster
                            fieldElement.show();
                            
                            // Alan genişliğini geri getir
                            fieldElement.css({
                                'width': '',
                                'min-width': '',
                                'max-width': '',
                                'padding': '',
                                'margin': '',
                                'overflow': ''
                            });
                            
                            // İçeriği göster ama yarı şeffaf yap
                            fieldElement.children().show();
                            fieldElement.css('opacity', '0.6');
                            
                            // Arka plan rengi ekle
                            fieldElement.css('background-color', '#fff3cd');
                            
                            // Field drag controls'ü normale döndür
                            fieldElement.find('.field-drag-controls').css({
                                'float': 'left',
                                'margin-right': '10px',
                                'display': 'inline-flex',
                                'background': '#f8f9fa',
                                'border': '1px solid #ddd'
                            });
                            
                            // Alan genişliğini tekrar uygula
                            this.applyFieldWidth(fieldElement, field.width || '100');
                        } else {
                            // Gizli alanları tekrar gizle
                            fieldElement.removeClass('field-hidden-showing');
                            fieldElement.addClass('field-hidden');
                            
                            // Stilleri temizle
                            fieldElement.css({
                                'opacity': '',
                                'background-color': ''
                            });
                            
                            // Alanı tekrar gizle
                            fieldElement.hide();
                        }
                    }
                }
            }
        });
        
        // Toolbar butonunun icon ve title'ını güncelle
        const button = this.toolbar.findButton('.show-hidden-fields-button');
        if (button && button.length) {
            $(button).find('i').removeClass('fa-low-vision').addClass('fa-low-vision');
            $(button).attr('title', this.showHiddenFields ? 'Gizli Alanları Gizle' : 'Gizli Alanları Göster');
            // Tooltip (hint) güncelle
            $(button).attr('data-original-title', this.showHiddenFields ? 
                'Gizli alanları tekrar gizlemek için tıklayınız' : 
                'Gizlediğiniz alanları tekrar getirmek için tıklayınız');
        }
    }
}