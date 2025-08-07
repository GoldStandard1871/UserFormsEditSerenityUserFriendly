import { Decorators, EntityDialog, EntityGrid, ToolButton, localText, notifySuccess, notifyError, notifyWarning, Authorization } from "@serenity-is/corelib";
import { FormEditorV2Service } from "./FormEditorV2Service";
import { FormEditorV2Form, FormEditorV2Row } from "./FormEditorV2Types";
import { FormFieldSettings, FormLayoutSettings } from "./FormEditorV2Interfaces";

@Decorators.registerClass('UserControlForm.FormEditorV2Dialog')
export class FormEditorV2Dialog extends EntityDialog<FormEditorV2Row, any> {
    protected getFormKey() { return FormEditorV2Form.formKey; }
    protected getRowDefinition() { return FormEditorV2Row; }
    protected getService() { return FormEditorV2Service.baseUrl; }
}

@Decorators.registerClass('UserControlForm.FormEditorV2Grid')
export class FormEditorV2Grid extends EntityGrid<FormEditorV2Row, any> {
    protected getColumnsKey() { return 'UserControlForm.FormEditorV2'; }
    protected getDialogType() { return FormEditorV2Dialog; }
    protected getRowDefinition() { return FormEditorV2Row; }
    protected getService() { return FormEditorV2Service.baseUrl; }

    private layoutSettings: FormLayoutSettings;
    private fieldSettings: Map<string, FormFieldSettings> = new Map();

    constructor(container: JQuery<HTMLElement>) {
        super(container);
        this.initializeFormEditor();
    }


    protected createToolbarExtensions(): void {
        super.createToolbarExtensions();

        this.toolbar.element.find('.add-button').remove();
        
        this.toolbar.element.append(
            <ToolButton 
                title="Kaydet"
                cssClass="save-settings-button"
                icon="fa-save"
                onClick={() => this.saveSettings()}
            />
        );

        this.toolbar.element.append(
            <ToolButton
                title="Varsayılana Dön"
                cssClass="reset-settings-button" 
                icon="fa-refresh"
                onClick={() => this.resetToDefault()}
            />
        );
        
        // Satır taşıma butonları
        this.toolbar.element.append(
            <div className="row-move-buttons" style={{ display: 'inline-block', marginLeft: '10px' }}>
                <ToolButton
                    title="Seçili satırı yukarı taşı"
                    cssClass="move-up-button"
                    icon="fa-arrow-up"
                    onClick={() => this.moveSelectedRow(-1)}
                />
                <ToolButton
                    title="Seçili satırı aşağı taşı"
                    cssClass="move-down-button" 
                    icon="fa-arrow-down"
                    onClick={() => this.moveSelectedRow(1)}
                />
            </div>
        );

        this.toolbar.element.append(
            <div className="hidden-fields-container">
                <button className="hidden-fields-toggle" onClick={(e) => this.toggleHiddenFieldsDropdown(e)}>
                    <i className="fa fa-eye-slash"></i> Gizlenen Alanlar <span className="hidden-count">(0)</span>
                </button>
                <div className="hidden-fields-dropdown" style={{ display: 'none' }}>
                    <div className="dropdown-header">Gizlenen Alanlar</div>
                    <div className="hidden-fields-list">
                        <div className="no-hidden-fields">Gizlenmiş alan yok</div>
                    </div>
                </div>
            </div>
        );

        this.toolbar.element.append(
            <select className="width-mode-selector" onChange={(e) => this.changeWidthMode(e.target.value)}>
                <option value="compact">Kompakt</option>
                <option value="normal">Normal</option>
                <option value="wide">Geniş</option>
            </select>
        );
    }

    private async initializeFormEditor(): Promise<void> {
        // Önce kullanıcı ayarlarını yükle (admin bilgisi dahil)
        await this.loadUserSettings();
        
        // Sonra kontrolleri kur
        this.setupFieldControls();
        this.setupHiddenFieldsEvents();
        this.applyLayoutSettings();
        
        // Grid yüklendikten sonra field kontrollerini ekle
        setTimeout(() => {
            this.addFieldControls();
        }, 100);
    }

    protected createSlickGrid(): Slick.Grid {
        const grid = super.createSlickGrid();
        
        // Grid render olduktan sonra kontrolleri ekle
        grid.onViewportChanged.subscribe(() => {
            this.addFieldControls();
        });
        
        grid.onColumnsResized.subscribe(() => {
            this.addFieldControls();
        });
        
        return grid;
    }

    protected afterRender(): void {
        // Grid tamamen yüklendikten sonra
        setTimeout(() => {
            this.addFieldControls();
        }, 500);
    }

    private addFieldControls(): void {
        // Önce toolbar'daki hidden fields sayısını kontrol et
        if (this.toolbar.element.find('.hidden-fields-container').length === 0) {
            return; // Henüz toolbar hazır değil
        }

        // Grid container'ı içindeki tüm row'ları bul
        const gridContainer = this.slickGrid.getContainerNode();
        const rows = $(gridContainer).find('.slick-row');
        
        console.log("Grid rows found:", rows.length);
        
        rows.each((index, rowElement) => {
            const $row = $(rowElement);
            const rowIndex = parseInt($row.attr('row') || index.toString());
            const item = this.view.getItem(rowIndex);
            
            if (!item) return;
            
            // Row'u form-row olarak işaretle
            $row.addClass('form-row');
            $row.attr('data-form-id', item.Id || `form-${rowIndex}`);
            
            // Her cell'e field kontrolleri ekle
            $row.find('.slick-cell').each((cellIndex, cellElement) => {
                const $cell = $(cellElement);
                const column = this.slickGrid.getColumns()[cellIndex];
                
                if (!column || column.field === 'Id') {
                    return;
                }
                
                // Eğer kontroller zaten eklenmişse, tekrar ekleme
                if ($cell.find('.hide-field-toggle').length > 0) {
                    return;
                }
                
                const fieldId = `field_${rowIndex}_${cellIndex}`;
                const fieldName = column.name || column.field || `Field ${cellIndex}`;
                
                $cell.css('position', 'relative');
                $cell.attr('data-field-id', fieldId);
                $cell.attr('data-field-name', fieldName);
                
                // Gizleme butonu ekle (herkes görebilir)
                const hideButton = $(`
                    <button class="hide-field-toggle" title="Alanı Gizle">
                        <i class="fa fa-eye-slash"></i>
                    </button>
                `);
                
                $cell.append(hideButton);
            });
        });
        
        // Field listesini güncelle
        this.updateHiddenFieldsList();
    }



    private setupFieldControls(): void {
        this.element.on('click', '.hide-form-toggle', (e) => {
            const formRow = $(e.currentTarget).closest('.form-row');
            const formId = formRow.data('form-id');
            
            formRow.toggleClass('hidden-form');
            
            if (formRow.hasClass('hidden-form')) {
                formRow.prependTo(this.element);
                this.fieldSettings.set(formId, { ...this.fieldSettings.get(formId), hidden: true });
            } else {
                this.fieldSettings.set(formId, { ...this.fieldSettings.get(formId), hidden: false });
            }
        });

        this.element.on('click', '.hide-field-toggle', (e) => {
            const field = $(e.currentTarget).closest('.form-field');
            const fieldId = field.data('field-id');
            
            field.toggleClass('hidden-field');
            
            const settings = this.fieldSettings.get(fieldId) || {} as FormFieldSettings;
            settings.fieldHidden = field.hasClass('hidden-field');
            this.fieldSettings.set(fieldId, settings);
            
            // Gizlenen alan sayısını hemen güncelle
            setTimeout(() => {
                this.updateHiddenFieldsList();
            }, 10);
            
            this.reorganizeFields();
        });

        this.element.on('change', '.field-width-selector', (e) => {
            const field = $(e.currentTarget).closest('.form-field');
            const fieldId = field.data('field-id');
            const width = parseInt($(e.currentTarget).val() as string);
            
            field.removeClass('width-25 width-50 width-75 width-100');
            field.addClass(`width-${width}`);
            
            const settings = this.fieldSettings.get(fieldId) || {} as FormFieldSettings;
            settings.width = width;
            this.fieldSettings.set(fieldId, settings);
            
            this.reorganizeFields();
        });
    }

    private reorganizeFields(): void {
        this.element.find('.form-row').each((i, row) => {
            const fields = $(row).find('.form-field:not(.hidden-field)');
            let currentRowWidth = 0;
            let currentRow = $('<div class="field-row"></div>');
            
            $(row).find('.field-row').remove();
            
            fields.each((j, field) => {
                const width = parseInt($(field).attr('class').match(/width-(\d+)/)?.[1] || '100');
                
                if (currentRowWidth + width > 100) {
                    $(row).append(currentRow);
                    currentRow = $('<div class="field-row"></div>');
                    currentRowWidth = 0;
                }
                
                currentRow.append(field);
                currentRowWidth += width;
            });
            
            if (currentRow.children().length > 0) {
                $(row).append(currentRow);
            }
        });
    }

    private changeWidthMode(mode: string): void {
        this.layoutSettings.widthMode = mode;
        this.element.removeClass('width-mode-compact width-mode-normal width-mode-wide');
        this.element.addClass(`width-mode-${mode}`);
    }

    private updateFormOrder(): void {
        const order: string[] = [];
        this.element.find('.form-row').each((i, el) => {
            order.push($(el).data('form-id'));
        });
        this.layoutSettings.formOrder = order;
    }
    
    private moveSelectedRow(direction: number): void {
        const selectedRows = this.slickGrid.getSelectedRows();
        if (selectedRows.length === 0) {
            notifyWarning("Lütfen taşımak istediğiniz satırı seçin");
            return;
        }
        
        const currentIndex = selectedRows[0];
        const items = this.view.getItems();
        const newIndex = currentIndex + direction;
        
        // Sınır kontrolü
        if (newIndex < 0 || newIndex >= items.length) {
            return;
        }
        
        // Veriyi yer değiştir
        const item = items[currentIndex];
        items.splice(currentIndex, 1);
        items.splice(newIndex, 0, item);
        
        // Grid'i güncelle
        this.view.setItems(items);
        this.slickGrid.invalidate();
        this.slickGrid.render();
        
        // Yeni pozisyonu seç
        this.slickGrid.setSelectedRows([newIndex]);
        
        // Form sırasını güncelle
        this.updateFormOrder();
        
        console.log(`Satır ${currentIndex} -> ${newIndex} taşındı`);
    }

    private async saveSettings(): Promise<void> {
        try {
            // Form yapısını topla
            const formStructure = this.collectFormStructure();
            
            const settings = {
                layoutSettings: {
                    ...this.layoutSettings,
                    formStructure: formStructure
                },
                fieldSettings: Array.from(this.fieldSettings.entries()).map(([key, value]) => ({
                    fieldId: key,
                    ...value
                }))
            };

            console.log("Kaydedilecek ayarlar:", settings);
            console.log("JSON string:", JSON.stringify(settings));

            const response = await FormEditorV2Service.SaveUserSettings({
                Settings: JSON.stringify(settings)
            });

            console.log("Kaydetme response:", response);
            notifySuccess("Ayarlar başarıyla kaydedildi");
        } catch (error) {
            console.error("Kaydetme hatası:", error);
            notifyError("Ayarlar kaydedilirken hata oluştu: " + error.message);
        }
    }

    private collectFormStructure(): any[] {
        const structure = [];
        
        // Grid'deki tüm form ve alanları topla
        this.element.find('.form-row').each((rowIndex, rowEl) => {
            const $row = $(rowEl);
            const formId = $row.data('form-id') || `form-${rowIndex}`;
            const fields = [];
            
            $row.find('.slick-cell').each((cellIndex, cellEl) => {
                const $cell = $(cellEl);
                const column = this.slickGrid.getColumns()[cellIndex];
                
                if (column && column.field !== 'Id') {
                    fields.push({
                        fieldId: $cell.data('field-id') || `field_${rowIndex}_${cellIndex}`,
                        fieldName: $cell.data('field-name') || column.name || column.field,
                        columnName: column.field,
                        width: parseInt($cell.attr('class')?.match(/width-(\d+)/)?.[1] || '100'),
                        hidden: $cell.hasClass('hidden-field'),
                        order: cellIndex
                    });
                }
            });
            
            structure.push({
                formId: formId,
                formName: $row.data('form-name') || `Form ${rowIndex + 1}`,
                order: rowIndex,
                hidden: $row.hasClass('hidden-form'),
                fields: fields
            });
        });
        
        return structure;
    }

    private async loadUserSettings(): Promise<void> {
        try {
            const response = await FormEditorV2Service.GetUserSettings({});

            // Debug bilgileri
            console.log(`GetUserSettings Response - UserId: ${response.UserId}, Username: ${response.Username}`);

            if (response.Settings) {
                const settings = JSON.parse(response.Settings);
                this.layoutSettings = settings.layoutSettings;
                
                // Form yapısını geri yükle
                if (settings.layoutSettings?.formStructure) {
                    this.applyFormStructure(settings.layoutSettings.formStructure);
                }
                
                settings.fieldSettings?.forEach((field: any) => {
                    this.fieldSettings.set(field.fieldId, {
                        width: field.width,
                        hidden: field.hidden,
                        fieldHidden: field.fieldHidden
                    });
                });
            } else {
                this.setDefaultSettings();
            }
        } catch (error) {
            this.setDefaultSettings();
        }
    }

    private applyFormStructure(formStructure: any[]): void {
        if (!formStructure || formStructure.length === 0) return;
        
        // Form yapısını uygula
        formStructure.forEach((form) => {
            const $formRow = this.element.find(`[data-form-id="${form.formId}"]`);
            
            if ($formRow.length > 0) {
                // Form gizleme durumunu uygula
                if (form.hidden) {
                    $formRow.addClass('hidden-form');
                }
                
                // Alan ayarlarını uygula
                form.fields?.forEach((field: any) => {
                    const $field = $formRow.find(`[data-field-id="${field.fieldId}"]`);
                    
                    if ($field.length > 0) {
                        // Alan genişliği
                        if (field.width) {
                            $field.removeClass('width-25 width-50 width-75 width-100');
                            $field.addClass(`width-${field.width}`);
                        }
                        
                        // Alan gizleme
                        if (field.hidden) {
                            $field.addClass('hidden-field');
                        }
                    }
                });
            }
        });
        
        // Form sıralamasını uygula
        if (this.layoutSettings.formOrder && this.layoutSettings.formOrder.length > 0) {
            const container = this.element[0];
            this.layoutSettings.formOrder.forEach(formId => {
                const formRow = container.querySelector(`[data-form-id="${formId}"]`);
                if (formRow) {
                    container.appendChild(formRow);
                }
            });
        }
    }

    private setDefaultSettings(): void {
        this.layoutSettings = {
            widthMode: 'normal',
            formOrder: []
        };
        this.fieldSettings.clear();
    }

    private resetToDefault(): void {
        if (confirm("Tüm ayarlar varsayılan değerlere dönecek. Emin misiniz?")) {
            this.setDefaultSettings();
            this.applyLayoutSettings();
            this.reorganizeFields();
            notifySuccess("Ayarlar varsayılana döndürüldü");
        }
    }

    private applyLayoutSettings(): void {
        this.changeWidthMode(this.layoutSettings.widthMode);
        
        if (this.layoutSettings.formOrder && this.layoutSettings.formOrder.length > 0) {
            const container = this.element[0];
            this.layoutSettings.formOrder.forEach(formId => {
                const formRow = container.querySelector(`[data-form-id="${formId}"]`);
                if (formRow) {
                    container.appendChild(formRow);
                }
            });
        }

        this.fieldSettings.forEach((settings, fieldId) => {
            const field = this.element.find(`[data-field-id="${fieldId}"]`);
            
            if (settings.width) {
                field.removeClass('width-25 width-50 width-75 width-100');
                field.addClass(`width-${settings.width}`);
            }
            
            if (settings.hidden) {
                field.closest('.form-row').addClass('hidden-form').prependTo(this.element);
            }
            
            if (settings.fieldHidden) {
                field.addClass('hidden-field');
            }
        });
        
        this.updateHiddenFieldsList();
        this.reorganizeFields();
    }


    private toggleHiddenFieldsDropdown(e: React.MouseEvent): void {
        e.stopPropagation();
        const dropdown = this.toolbar.element.find('.hidden-fields-dropdown');
        dropdown.toggle();
        
        if (dropdown.is(':visible')) {
            this.updateHiddenFieldsList();
        }
    }

    private updateHiddenFieldsList(): void {
        const hiddenFieldsList = this.toolbar.element.find('.hidden-fields-list');
        hiddenFieldsList.empty();
        
        let hiddenCount = 0;
        const hiddenFields: { fieldId: string, fieldName: string, formName: string }[] = [];
        
        this.element.find('.form-row').each((i, formRow) => {
            const formName = $(formRow).find('.form-title').text() || `Form ${i + 1}`;
            
            $(formRow).find('.form-field.hidden-field').each((j, field) => {
                const fieldId = $(field).data('field-id');
                const fieldName = $(field).find('.field-label').text() || $(field).data('field-name') || `Alan ${j + 1}`;
                
                hiddenFields.push({ fieldId, fieldName, formName });
                hiddenCount++;
            });
        });
        
        this.toolbar.element.find('.hidden-count').text(`(${hiddenCount})`);
        
        if (hiddenFields.length === 0) {
            hiddenFieldsList.append('<div class="no-hidden-fields">Gizlenmiş alan yok</div>');
        } else {
            hiddenFields.forEach(({ fieldId, fieldName, formName }) => {
                hiddenFieldsList.append(
                    `<div class="hidden-field-item">
                        <span class="field-info">
                            <span class="field-name">${fieldName}</span>
                            <span class="form-name">${formName}</span>
                        </span>
                        <button class="show-field-btn" data-field-id="${fieldId}">
                            <i class="fa fa-eye"></i> Göster
                        </button>
                    </div>`
                );
            });
        }
    }

    private setupHiddenFieldsEvents(): void {
        $(document).on('click', (e) => {
            if (!$(e.target).closest('.hidden-fields-container').length) {
                this.toolbar.element.find('.hidden-fields-dropdown').hide();
            }
        });
        
        this.toolbar.element.on('click', '.show-field-btn', (e) => {
            e.stopPropagation();
            const fieldId = $(e.currentTarget).data('field-id');
            const field = this.element.find(`[data-field-id="${fieldId}"]`);
            
            field.removeClass('hidden-field');
            
            const settings = this.fieldSettings.get(fieldId) || {} as FormFieldSettings;
            settings.fieldHidden = false;
            this.fieldSettings.set(fieldId, settings);
            
            this.updateHiddenFieldsList();
            this.reorganizeFields();
        });
    }

}