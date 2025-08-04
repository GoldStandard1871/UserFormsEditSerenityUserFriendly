import { Decorators, EntityDialog, EntityGrid, ToolButton, localText, notifySuccess, notifyError, serviceRequest } from "@serenity-is/corelib";
import { FormEditorV2Service, FormEditorV2Row } from "../ServerTypes/FormEditor/FormEditorV2Service";
import { FormEditorV2Form, SaveUserSettingsRequest, GetUserSettingsRequest, GetUserSettingsResponse } from "../ServerTypes/FormEditor/FormEditorV2Row";
import { FormFieldSettings, FormLayoutSettings } from "./FormEditorV2Interfaces";

@Decorators.registerClass('UserControlForm.FormEditor.FormEditorV2Dialog')
export class FormEditorV2Dialog extends EntityDialog<FormEditorV2Row, any> {
    protected getFormKey() { return FormEditorV2Form.formKey; }
    protected getRowDefinition() { return FormEditorV2Row; }
    protected getService() { return FormEditorV2Service.baseUrl; }
}

@Decorators.registerClass('UserControlForm.FormEditor.FormEditorV2Grid')
export class FormEditorV2Grid extends EntityGrid<FormEditorV2Row, any> {
    protected getColumnsKey() { return 'FormEditor.FormEditorV2'; }
    protected getDialogType() { return FormEditorV2Dialog; }
    protected getRowDefinition() { return FormEditorV2Row; }
    protected getService() { return FormEditorV2Service.baseUrl; }

    private layoutSettings: FormLayoutSettings;
    private fieldSettings: Map<string, FormFieldSettings> = new Map();
    private draggedItem: HTMLElement | null = null;

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

        this.toolbar.element.append(
            <select className="width-mode-selector" onChange={(e) => this.changeWidthMode(e.target.value)}>
                <option value="compact">Kompakt</option>
                <option value="normal">Normal</option>
                <option value="wide">Geniş</option>
            </select>
        );
    }

    private initializeFormEditor(): void {
        this.loadUserSettings();
        this.setupDragAndDrop();
        this.setupFieldControls();
        this.applyLayoutSettings();
    }

    private setupDragAndDrop(): void {
        this.element.on('dragstart', '.form-row', (e) => {
            this.draggedItem = e.currentTarget as HTMLElement;
            e.originalEvent.dataTransfer.effectAllowed = 'move';
            e.originalEvent.dataTransfer.setData('text/html', this.draggedItem.innerHTML);
            $(e.currentTarget).addClass('dragging');
        });

        this.element.on('dragover', '.form-row', (e) => {
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'move';
            
            const afterElement = this.getDragAfterElement(this.element[0], e.originalEvent.clientY);
            const dragging = this.element.find('.dragging')[0];
            
            if (afterElement == null) {
                this.element[0].appendChild(dragging);
            } else {
                this.element[0].insertBefore(dragging, afterElement);
            }
        });

        this.element.on('dragend', '.form-row', (e) => {
            $(e.currentTarget).removeClass('dragging');
            this.updateFormOrder();
        });
    }

    private getDragAfterElement(container: HTMLElement, y: number): HTMLElement | null {
        const draggableElements = [...container.querySelectorAll('.form-row:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
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

    private async saveSettings(): Promise<void> {
        try {
            const settings = {
                layoutSettings: this.layoutSettings,
                fieldSettings: Array.from(this.fieldSettings.entries()).map(([key, value]) => ({
                    fieldId: key,
                    ...value
                }))
            };

            await FormEditorV2Service.SaveUserSettings({
                UserId: this.getCurrentUserId(),
                Settings: JSON.stringify(settings)
            } as SaveUserSettingsRequest);

            notifySuccess("Ayarlar başarıyla kaydedildi");
        } catch (error) {
            notifyError("Ayarlar kaydedilirken hata oluştu");
        }
    }

    private async loadUserSettings(): Promise<void> {
        try {
            const response = await FormEditorV2Service.GetUserSettings({
                UserId: this.getCurrentUserId()
            } as GetUserSettingsRequest);

            if (response.Settings) {
                const settings = JSON.parse(response.Settings);
                this.layoutSettings = settings.layoutSettings;
                
                settings.fieldSettings.forEach((field: any) => {
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
    }

    private getCurrentUserId(): number {
        return parseInt((window as any).Q.Authorization.userId || '0');
    }
}