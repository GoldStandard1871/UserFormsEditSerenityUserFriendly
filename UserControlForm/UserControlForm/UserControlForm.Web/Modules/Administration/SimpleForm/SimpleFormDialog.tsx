import { Decorators, EntityDialog, ToolButton } from '@serenity-is/corelib';
import { UserFormEditorForm, UserFormEditorRow, UserFormEditorService } from '../../ServerTypes/Administration';

interface TextFieldConfig {
    id: string;
    label: string;
    value: string;
    visible: boolean;
    order: number;
}

@Decorators.registerClass()
export class SimpleFormDialog extends EntityDialog<UserFormEditorRow> {
    protected getFormKey() { return UserFormEditorForm.formKey; }
    protected getIdProperty() { return UserFormEditorRow.idProperty; }
    protected getLocalTextPrefix() { return UserFormEditorRow.localTextPrefix; }
    protected getNameProperty() { return UserFormEditorRow.nameProperty; }
    protected getService() { return UserFormEditorService.baseUrl; }

    protected form = new UserFormEditorForm(this.idPrefix);
    private textFields: TextFieldConfig[] = [];
    private fieldsContainer: JQuery;

    constructor() {
        super();
        this.dialogTitle = "Simple Form Editor";
    }

    protected afterLoadEntity() {
        super.afterLoadEntity();
        
        // Form tasarım alanını oluştur
        const container = $('<div class="simple-form-designer"></div>').insertAfter(this.form.FormName.element.closest('.field'));
        
        // Başlık
        $('<h4>Text Fields</h4>').appendTo(container);
        
        // Alan ekle butonu
        $('<button class="btn btn-primary add-field-btn"><i class="fa fa-plus"></i> Add Text Field</button>')
            .appendTo(container)
            .click(() => this.addTextField());
        
        // Alanlar için container
        this.fieldsContainer = $('<div class="fields-container"></div>').appendTo(container);
        
        // Kayıtlı ayarları yükle
        this.loadUserFields();
    }

    private addTextField() {
        const field: TextFieldConfig = {
            id: 'field_' + Date.now(),
            label: 'Text Field ' + (this.textFields.length + 1),
            value: '',
            visible: true,
            order: this.textFields.length
        };
        
        this.textFields.push(field);
        this.renderFields();
    }

    private renderFields() {
        this.fieldsContainer.empty();
        
        // Sıralı olarak render et
        const sortedFields = [...this.textFields].sort((a, b) => a.order - b.order);
        
        sortedFields.forEach((field, index) => {
            const fieldRow = $('<div class="field-row"></div>')
                .toggleClass('hidden', !field.visible)
                .appendTo(this.fieldsContainer);
            
            // Sol: Label ve input
            const fieldContent = $('<div class="field-content"></div>').appendTo(fieldRow);
            
            $('<input type="text" class="form-control field-label">')
                .val(field.label)
                .attr('placeholder', 'Field Label')
                .on('change', (e) => {
                    field.label = $(e.target).val() as string;
                })
                .appendTo(fieldContent);
            
            // Sağ: Kontrol butonları
            const controls = $('<div class="field-controls"></div>').appendTo(fieldRow);
            
            // Yukarı taşı
            if (index > 0) {
                $('<button class="btn btn-xs btn-default" title="Move Up"><i class="fa fa-arrow-up"></i></button>')
                    .click(() => this.moveField(field, -1))
                    .appendTo(controls);
            }
            
            // Aşağı taşı
            if (index < sortedFields.length - 1) {
                $('<button class="btn btn-xs btn-default" title="Move Down"><i class="fa fa-arrow-down"></i></button>')
                    .click(() => this.moveField(field, 1))
                    .appendTo(controls);
            }
            
            // Gizle/Göster
            $('<button class="btn btn-xs btn-' + (field.visible ? 'warning' : 'success') + '" title="' + (field.visible ? 'Hide' : 'Show') + '"><i class="fa fa-eye' + (field.visible ? '-slash' : '') + '"></i></button>')
                .click(() => this.toggleVisibility(field))
                .appendTo(controls);
            
            // Sil
            $('<button class="btn btn-xs btn-danger" title="Delete"><i class="fa fa-trash"></i></button>')
                .click(() => this.deleteField(field))
                .appendTo(controls);
        });
    }

    private moveField(field: TextFieldConfig, direction: number) {
        const currentIndex = this.textFields.findIndex(f => f.id === field.id);
        const newIndex = currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.textFields.length) {
            // Order değerlerini değiştir
            const temp = this.textFields[currentIndex].order;
            this.textFields[currentIndex].order = this.textFields[newIndex].order;
            this.textFields[newIndex].order = temp;
            
            this.renderFields();
        }
    }

    private toggleVisibility(field: TextFieldConfig) {
        field.visible = !field.visible;
        this.renderFields();
    }

    private deleteField(field: TextFieldConfig) {
        this.textFields = this.textFields.filter(f => f.id !== field.id);
        // Order değerlerini yeniden düzenle
        this.textFields.forEach((f, i) => f.order = i);
        this.renderFields();
    }

    protected getToolbarButtons(): ToolButton[] {
        const buttons = super.getToolbarButtons();
        
        // Kullanıcıya özel kaydet butonu
        buttons.push({
            title: 'Save My Layout',
            cssClass: 'save-layout-button',
            icon: 'fa-save',
            onClick: () => this.saveUserLayout()
        });
        
        return buttons;
    }

    private saveUserLayout() {
        const layoutData = {
            fields: this.textFields
        };
        
        UserFormEditorService.SaveUserFormPreference({
            PreferenceKey: `SimpleFormLayout:${this.entity.TemplateId || 'default'}`,
            FormDesign: JSON.stringify(layoutData)
        }, () => {
            Q.notifySuccess("Your layout has been saved!");
        });
    }

    private loadUserFields() {
        UserFormEditorService.GetUserFormPreference({
            PreferenceKey: `SimpleFormLayout:${this.entity.TemplateId || 'default'}`
        }, response => {
            if (response.FormDesign) {
                try {
                    const layoutData = JSON.parse(response.FormDesign);
                    this.textFields = layoutData.fields || [];
                    this.renderFields();
                } catch (e) {
                    // Varsayılan alanları ekle
                    this.addDefaultFields();
                }
            } else {
                // Varsayılan alanları ekle
                this.addDefaultFields();
            }
        });
    }

    private addDefaultFields() {
        // Varsayılan 3 text alanı ekle
        for (let i = 0; i < 3; i++) {
            this.addTextField();
        }
    }
}