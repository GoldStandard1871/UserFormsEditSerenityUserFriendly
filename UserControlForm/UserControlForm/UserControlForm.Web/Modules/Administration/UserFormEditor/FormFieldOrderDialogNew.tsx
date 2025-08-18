import { Decorators, EntityDialog, ToolButton, Authorization, notifySuccess } from '@serenity-is/corelib';
import { UserFormEditorService } from '../../ServerTypes/Administration';

declare var $: any;

interface FieldOrder {
    fieldName: string;
    displayName: string;
    order: number;
    visible: boolean;
    width?: string;
    required?: boolean;
}

@Decorators.registerClass('UserControlForm.Administration.FormFieldOrderDialogNew')
export class FormFieldOrderDialogNew extends EntityDialog<any> {
    protected getFormKey() { return null; }
    protected getIdProperty() { return 'TemplateId'; }
    protected getLocalTextPrefix() { return 'Administration.UserFormEditor'; }
    protected getNameProperty() { return 'FormName'; }
    protected getService() { return UserFormEditorService.baseUrl; }
    
    public dialogType: string = 'UnknownDialog';
    public fields: FieldOrder[] = [];
    private fieldOrders: FieldOrder[] = [];
    private isDirty: boolean = false;

    constructor() {
        super();
        this.dialogTitle = "Form Alanlarını Özelleştir";
    }
    
    protected onDialogOpen() {
        super.onDialogOpen();
        
        // Dialog'a class ekle
        this.element.addClass('s-FormFieldOrderDialog');
        
        // İçeriği oluştur
        this.renderContent();
        
        // Alanları yükle
        this.loadFieldOrder();
    }
    
    private renderContent() {
        // Dialog içeriğini temizle ve yeni içerik ekle
        const dialogContent = $(this.element.getNode ? this.element.getNode() : this.element);
        
        // Form alanını gizle (EntityDialog'un default form alanı)
        dialogContent.find('.s-Form').hide();
        
        // Özel içeriği ekle
        const customContent = $(`
            <div class="field-order-toolbar">
                <button class="btn btn-primary save-order-btn">
                    <i class="fa fa-save"></i> Kaydet
                </button>
                <button class="btn btn-default reset-order-btn">
                    <i class="fa fa-undo"></i> Sıfırla
                </button>
                <button class="btn btn-default toggle-all-btn">
                    <i class="fa fa-eye"></i> Tümünü Göster/Gizle
                </button>
            </div>
            <div class="field-order-container">
                <div class="field-order-list"></div>
            </div>
        `);
        
        // Dialog body'sine ekle
        const dialogBody = dialogContent.find('.s-DialogContent');
        if (dialogBody.length > 0) {
            dialogBody.append(customContent);
        } else {
            dialogContent.append(customContent);
        }
    }

    protected afterLoadEntity() {
        super.afterLoadEntity();
    }

    private loadFieldOrder() {
        console.log('loadFieldOrder çağrıldı. Fields:', this.fields);
        
        // Önce varsayılan alanları yükle
        this.fieldOrders = this.getDefaultFieldOrder();
        
        console.log('fieldOrders set edildi:', this.fieldOrders);
        
        // Önceki kayıtları yükle ve birleştir
        this.loadSavedOrder();
    }

    private loadSavedOrder() {
        const userId = Authorization.userDefinition?.UserId || Authorization.userId;
        const userKey = `FieldCustomization:${this.dialogType}:User${userId}`;
        const globalRequiredKey = `FieldCustomization:${this.dialogType}:GlobalRequired`;
        
        console.log('Yükleme - Dialog Type:', this.dialogType);
        console.log('Yükleme - User Key:', userKey);
        
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
                if (response.FormDesign) {
                    try {
                        const savedData = JSON.parse(response.FormDesign);
                        if (savedData.fields && savedData.fields.length > 0) {
                            // Global zorunlu alan bilgilerini birleştir
                            savedData.fields.forEach((field: any) => {
                                // Eğer global zorunlu alanlar listesinde varsa, zorunlu olarak işaretle
                                if (globalRequiredFields.includes(field.fieldName)) {
                                    field.required = true;
                                }
                            });
                            
                            // Kaydedilmiş ayarları mevcut field'larla birleştir
                            this.mergeWithSavedOrder(savedData.fields);
                        }
                    } catch (e) {
                        console.error('Kayıtlı ayarlar yüklenemedi:', e);
                    }
                } else {
                    // Kullanıcı özelleştirmesi yoksa, sadece global zorunlu alanları uygula
                    this.fieldOrders.forEach(field => {
                        if (globalRequiredFields.includes(field.fieldName)) {
                            field.required = true;
                        }
                    });
                }
                this.renderFieldList();
            }, error => {
                // Hata durumunda da render et
                this.renderFieldList();
            });
        }, error => {
            // Global bilgi yüklenemese bile kullanıcı özelleştirmelerini yükle
            UserFormEditorService.GetUserFormPreference({
                PreferenceKey: userKey
            }, response => {
                if (response.FormDesign) {
                    try {
                        const savedData = JSON.parse(response.FormDesign);
                        if (savedData.fields && savedData.fields.length > 0) {
                            this.mergeWithSavedOrder(savedData.fields);
                        }
                    } catch (e) {
                        console.error('Kayıtlı ayarlar yüklenemedi:', e);
                    }
                }
                this.renderFieldList();
            }, error => {
                this.renderFieldList();
            });
        });
    }

    private mergeWithSavedOrder(savedFields: FieldOrder[]) {
        const savedMap = new Map<string, FieldOrder>();
        savedFields.forEach(field => {
            savedMap.set(field.fieldName, field);
        });

        // Mevcut field'ları kaydedilmiş ayarlarla güncelle
        this.fieldOrders = this.fieldOrders.map(field => {
            const saved = savedMap.get(field.fieldName);
            if (saved) {
                return {
                    ...field,
                    order: saved.order,
                    visible: saved.visible,
                    width: saved.width || field.width,
                    required: saved.required !== undefined ? saved.required : field.required
                };
            }
            return field;
        });

        // Sıralama
        this.fieldOrders.sort((a, b) => a.order - b.order);
    }

    private getDefaultFieldOrder(): FieldOrder[] {
        // Eğer dışarıdan field geldiyse onları kullan
        if (this.fields && this.fields.length > 0) {
            return this.fields.map((field, index) => ({
                ...field,
                order: field.order || index
            }));
        }
        
        // Varsayılan alanlar
        return [
            { fieldName: 'Field1', displayName: 'Alan 1', order: 0, visible: true, width: '100', required: false }
        ];
    }

    private renderFieldList() {
        const container = $(this.element.getNode ? this.element.getNode() : this.element).find('.field-order-list');
        container.empty();

        this.fieldOrders.forEach((field, index) => {
            const fieldRow = this.createFieldRow(field, index);
            container.append(fieldRow);
        });

        this.attachEventHandlers();
    }

    private createFieldRow(field: FieldOrder, index: number): JQuery {
        const isAdmin = Authorization.userDefinition?.Username === 'admin' || 
                       Authorization.userDefinition?.Username === 'Admin';
        
        const row = $(`
            <div class="field-order-item ${!field.visible ? 'field-hidden' : ''}" data-field="${field.fieldName}">
                <div class="field-order-handle">
                    <i class="fa fa-bars"></i>
                </div>
                <div class="field-order-name">
                    <span class="field-display-name">${field.displayName}</span>
                    <span class="field-technical-name">(${field.fieldName})</span>
                </div>
                <div class="field-order-controls">
                    <button class="btn btn-xs btn-default move-up" title="Yukarı Taşı">
                        <i class="fa fa-chevron-up"></i>
                    </button>
                    <button class="btn btn-xs btn-default move-down" title="Aşağı Taşı">
                        <i class="fa fa-chevron-down"></i>
                    </button>
                    <button class="btn btn-xs btn-default toggle-visibility" title="${field.visible ? 'Gizle' : 'Göster'}">
                        <i class="fa ${field.visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                    </button>
                    <select class="field-width-select" title="Alan Genişliği">
                        <option value="100">100%</option>
                        <option value="50">50%</option>
                        <option value="33">33%</option>
                        <option value="25">25%</option>
                        <option value="75">75%</option>
                    </select>
                    ${isAdmin ? `
                    <label class="field-required-checkbox" title="Zorunlu Alan">
                        <input type="checkbox" ${field.required ? 'checked' : ''} />
                        <span class="required-star" style="color: red; font-weight: bold;">*</span>
                    </label>` : (field.required ? '<span class="required-star" style="color: red; font-weight: bold; margin-left: 5px;">*</span>' : '')}
                </div>
            </div>
        `);

        // Width değerini set et
        row.find('.field-width-select').val(field.width || '');

        return row;
    }

    private attachEventHandlers() {
        const container = $(this.element.getNode ? this.element.getNode() : this.element);

        // Yukarı taşı
        container.off('click', '.move-up').on('click', '.move-up', (e: any) => {
            const item = $(e.currentTarget).closest('.field-order-item');
            const fieldName = item.data('field');
            this.moveField(fieldName, -1);
        });

        // Aşağı taşı
        container.off('click', '.move-down').on('click', '.move-down', (e: any) => {
            const item = $(e.currentTarget).closest('.field-order-item');
            const fieldName = item.data('field');
            this.moveField(fieldName, 1);
        });

        // Görünürlük
        container.off('click', '.toggle-visibility').on('click', '.toggle-visibility', (e: any) => {
            const item = $(e.currentTarget).closest('.field-order-item');
            const fieldName = item.data('field');
            this.toggleVisibility(fieldName);
        });

        // Genişlik
        container.off('change', '.field-width-select').on('change', '.field-width-select', (e: any) => {
            const item = $(e.currentTarget).closest('.field-order-item');
            const fieldName = item.data('field');
            const width = $(e.currentTarget).val();
            this.updateWidth(fieldName, width);
        });

        // Zorunlu alan
        container.off('change', '.field-required-checkbox input').on('change', '.field-required-checkbox input', (e: any) => {
            const item = $(e.currentTarget).closest('.field-order-item');
            const fieldName = item.data('field');
            const required = $(e.currentTarget).is(':checked');
            this.updateRequired(fieldName, required);
        });

        // Toolbar butonları
        container.find('.save-order-btn').off('click').on('click', () => {
            this.saveFieldOrder();
        });

        container.find('.reset-order-btn').off('click').on('click', () => {
            this.resetToDefault();
        });

        container.find('.toggle-all-btn').off('click').on('click', () => {
            this.toggleAllVisibility();
        });
    }

    private moveField(fieldName: string, direction: number) {
        const index = this.fieldOrders.findIndex(f => f.fieldName === fieldName);
        if (index === -1) return;

        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= this.fieldOrders.length) return;

        // Swap
        [this.fieldOrders[index], this.fieldOrders[newIndex]] = 
        [this.fieldOrders[newIndex], this.fieldOrders[index]];

        // Update orders
        this.fieldOrders.forEach((field, i) => {
            field.order = i;
        });

        this.isDirty = true;
        this.renderFieldList();
    }

    private toggleVisibility(fieldName: string) {
        const field = this.fieldOrders.find(f => f.fieldName === fieldName);
        if (field) {
            field.visible = !field.visible;
            this.isDirty = true;
            this.renderFieldList();
        }
    }

    private updateWidth(fieldName: string, width: string) {
        const field = this.fieldOrders.find(f => f.fieldName === fieldName);
        if (field) {
            field.width = width;
            this.isDirty = true;
        }
    }

    private updateRequired(fieldName: string, required: boolean) {
        const field = this.fieldOrders.find(f => f.fieldName === fieldName);
        if (field) {
            field.required = required;
            this.isDirty = true;
        }
    }

    private toggleAllVisibility() {
        const hasHidden = this.fieldOrders.some(f => !f.visible);
        this.fieldOrders.forEach(field => {
            field.visible = hasHidden;
        });
        this.isDirty = true;
        this.renderFieldList();
    }

    private resetToDefault() {
        if (confirm('Tüm özelleştirmeler sıfırlanacak. Emin misiniz?')) {
            // Orijinal field listesini yeniden yükle
            if (this.fields && this.fields.length > 0) {
                this.fieldOrders = [...this.fields];
            } else {
                this.fieldOrders = this.getDefaultFieldOrder();
            }
            this.isDirty = true;
            this.renderFieldList();
        }
    }

    private saveFieldOrder() {
        const userId = Authorization.userDefinition?.UserId || Authorization.userId;
        const isAdmin = Authorization.userDefinition?.Username === 'admin' || 
                       Authorization.userDefinition?.Username === 'Admin';
        
        const userKey = `FieldCustomization:${this.dialogType}:User${userId}`;
        const globalRequiredKey = `FieldCustomization:${this.dialogType}:GlobalRequired`;
        
        console.log('Kaydetme - Dialog Type:', this.dialogType);
        console.log('Kaydetme - User Key:', userKey);
        console.log('Kaydetme - Fields:', this.fieldOrders);
        
        // Kullanıcıya özel verileri hazırla (zorunlu alan bilgisi hariç)
        const userData = {
            fields: this.fieldOrders.map(field => ({
                ...field,
                // Admin değilse zorunlu alan bilgisini kaydetme
                required: isAdmin ? field.required : undefined
            })),
            savedAt: new Date().toISOString()
        };

        // Önce kullanıcı özelleştirmelerini kaydet
        UserFormEditorService.SaveUserFormPreference({
            PreferenceKey: userKey,
            FormDesign: JSON.stringify(userData)
        }, response => {
            // Eğer admin ise, zorunlu alan bilgilerini global olarak da kaydet
            if (isAdmin) {
                const requiredFields = this.fieldOrders
                    .filter(f => f.required)
                    .map(f => f.fieldName);
                
                const globalData = {
                    requiredFields: requiredFields,
                    savedAt: new Date().toISOString(),
                    savedBy: userId
                };
                
                UserFormEditorService.SaveUserFormPreference({
                    PreferenceKey: globalRequiredKey,
                    FormDesign: JSON.stringify(globalData)
                }, globalResponse => {
                    notifySuccess('Alan özelleştirmeleri ve zorunlu alan ayarları kaydedildi');
                    console.log('Kaydetme başarılı!');
                    this.isDirty = false;
                    super.dialogClose();
                }, error => {
                    console.error('Global zorunlu alan kaydetme hatası:', error);
                    notifySuccess('Zorunlu alan kaydetme hatası: ' + error.Error?.Message);
                });
            } else {
                notifySuccess('Alan özelleştirmeleri kaydedildi');
                console.log('Kaydetme başarılı!');
                this.isDirty = false;
                super.dialogClose();
            }
        }, error => {
            console.error('Kaydetme hatası:', error);
            notifySuccess('Kaydetme hatası: ' + error.Error?.Message);
        });
    }

    protected getToolbarButtons(): ToolButton[] {
        const buttons = super.getToolbarButtons();
        
        // Varsayılan butonları kaldır
        return buttons.filter(b => !b.cssClass?.includes('save') && !b.cssClass?.includes('apply'));
    }

    protected onDialogClose() {
        if (this.isDirty) {
            if (confirm('Kaydedilmemiş değişiklikler var. Çıkmak istediğinize emin misiniz?')) {
                super.onDialogClose();
            }
        } else {
            super.onDialogClose();
        }
    }
}

// CSS stilleri
const style = document.createElement('style');
style.textContent = `
.s-FormFieldOrderDialog .field-order-toolbar {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    background: #f5f5f5;
}

.s-FormFieldOrderDialog .field-order-container {
    max-height: 500px;
    overflow-y: auto;
    padding: 10px;
}

.s-FormFieldOrderDialog .field-order-item {
    display: flex;
    align-items: center;
    padding: 8px;
    margin-bottom: 5px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: all 0.3s;
}

.s-FormFieldOrderDialog .field-order-item.field-hidden {
    opacity: 0.5;
    background: #f9f9f9;
}

.s-FormFieldOrderDialog .field-order-item:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.s-FormFieldOrderDialog .field-order-handle {
    cursor: move;
    margin-right: 10px;
    color: #999;
}

.s-FormFieldOrderDialog .field-order-name {
    flex: 1;
    font-weight: 500;
}

.s-FormFieldOrderDialog .field-technical-name {
    font-size: 11px;
    color: #999;
    margin-left: 5px;
}

.s-FormFieldOrderDialog .field-order-controls {
    display: flex;
    gap: 5px;
    align-items: center;
}

.s-FormFieldOrderDialog .field-width-select {
    width: 80px;
    height: 24px;
    font-size: 12px;
}

.s-FormFieldOrderDialog .field-required-checkbox {
    display: flex;
    align-items: center;
    margin: 0;
}

.s-FormFieldOrderDialog .field-required-checkbox input {
    margin-right: 3px;
}

.s-FormFieldOrderDialog .field-required-checkbox .required-star {
    color: red;
    font-weight: bold;
}
`;
document.head.appendChild(style);