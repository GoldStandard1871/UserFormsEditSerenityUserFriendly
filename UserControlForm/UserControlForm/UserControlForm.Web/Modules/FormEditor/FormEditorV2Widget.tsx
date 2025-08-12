import { Decorators, Widget, notifySuccess, notifyError } from "@serenity-is/corelib";
import { FormEditorV2Service } from "../ServerTypes/FormEditor/FormEditorV2Service";
import { SaveUserSettingsRequest, GetUserSettingsRequest } from "../ServerTypes/FormEditor/FormEditorV2Row";
import { FormFieldSettings, FormLayoutSettings } from "./FormEditorV2Interfaces";

interface ExtendedFieldSettings extends FormFieldSettings {
    hidden?: boolean;
    required?: boolean;
}

interface ExtendedLayoutSettings extends FormLayoutSettings {
    showWidthControls?: boolean;
}

@Decorators.registerClass('UserControlForm.FormEditor.FormEditorV2Widget')
export class FormEditorV2Widget extends Widget<any> {
    private layoutSettings: ExtendedLayoutSettings = { widthMode: 'normal', formOrder: [], showWidthControls: true };
    private fieldSettings: Map<string, ExtendedFieldSettings> = new Map();
    private globalRequiredFields: string[] = [];
    private container: JQuery;
    private isAdmin: boolean = false;

    constructor(container: JQuery) {
        super(container);
        this.container = container;
        this.container.addClass('form-editor-v2');
        this.init();
    }

    private async init(): Promise<void> {
        console.log('🚀 FormEditorV2Widget initializing');
        
        // Report page visit to SignalR
        this.reportPageVisit("Form Editor V2", "Form düzenleme sayfasını açtı");
        
        // Check if user is admin FIRST
        this.checkUserPermissions();
        
        // Clear container
        this.container.empty();
        
        // Create structure
        this.createToolbar();
        this.createFormsContainer();
        
        // Load settings BEFORE rendering forms
        await this.loadSettings();
        
        // Now render forms with loaded settings and correct isAdmin value
        this.renderForms();
        
        // Bind events
        this.bindEvents();
        
        console.log('🚀 FormEditorV2Widget initialization complete');
        console.log('🚀 Final isAdmin status:', this.isAdmin);
    }
    
    private reportPageVisit(pageName: string, action?: string): void {
        console.log(`📍 Reporting page visit: ${pageName} - ${action}`);
        
        // Try using the global function first
        if (typeof (window as any).updatePageLocation === 'function') {
            (window as any).updatePageLocation(pageName, action);
            console.log('✅ Page visit reported via global function');
        } else {
            // Check if SignalR connection exists
            const connection = (window as any).signalRConnection;
            if (connection && connection.state === 'Connected') {
                connection.invoke("UpdatePageLocation", pageName, action)
                    .then(() => console.log('✅ Page visit reported via direct connection'))
                    .catch((err: any) => console.error("❌ Error reporting page visit:", err));
            } else {
                console.warn('⚠️ No SignalR connection available for page tracking');
            }
        }
    }
    
    private checkUserPermissions(): void {
        const userData = (window as any).Q?.UserData;
        console.log('👤 Full UserData:', userData);
        this.isAdmin = userData?.IsAdmin === true;
        console.log('👤 User is admin:', this.isAdmin);
        console.log('👤 Username:', userData?.Username);
        
        // Double check with another method
        const username = userData?.Username;
        if (username) {
            const isAdminByName = username.toLowerCase() === 'admin';
            console.log('👤 Admin check by username:', isAdminByName);
            if (isAdminByName && !this.isAdmin) {
                console.warn('⚠️ Admin detection mismatch! Setting isAdmin to true');
                this.isAdmin = true;
            }
        }
    }

    private createToolbar(): void {
        const toolbar = $(`
            <div class="form-editor-toolbar">
                <button type="button" class="btn btn-primary save-btn">
                    <i class="fa fa-save"></i> Kaydet
                </button>
                <button type="button" class="btn btn-default reset-btn">
                    <i class="fa fa-refresh"></i> Varsayılana Dön
                </button>
                <span class="toolbar-separator"></span>
                
                <div class="toolbar-controls-group" style="display: inline-flex; align-items: center; gap: 10px;">
                    <button type="button" class="btn btn-warning toggle-width-controls-btn">
                        <i class="fa fa-cog"></i> Genişlik ve Gizlilik Ayarları <span class="toggle-text badge badge-secondary" style="margin-left: 5px;">Açık</span>
                    </button>
                    
                    <div class="hidden-fields-container" style="display: inline-block; position: relative;">
                        <button type="button" class="btn btn-info hidden-fields-toggle">
                            <i class="fa fa-eye-slash"></i> Gizlenen Alanlar <span class="hidden-count">(0)</span>
                        </button>
                        <div class="hidden-fields-dropdown" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 5px;">
                            <div class="dropdown-header">Gizlenen Alanlar</div>
                            <div class="hidden-fields-list">
                                <div class="no-hidden-fields">Gizlenmiş alan yok</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        this.container.append(toolbar);
    }

    private createFormsContainer(): void {
        this.container.append('<div class="forms-container width-mode-normal"></div>');
    }

    private renderForms(): void {
        console.log('🎨 renderForms() - Starting form render');
        const formsContainer = this.container.find('.forms-container');
        formsContainer.empty();
        console.log('🎨 renderForms() - Forms container found:', formsContainer.length);
        
        const forms = [
            {
                id: 'form1',
                title: 'Müşteri Bilgileri',
                fields: [
                    { id: 'f1', label: 'Ad', type: 'text', width: 50 },
                    { id: 'f2', label: 'Soyad', type: 'text', width: 50 },
                    { id: 'f3', label: 'TC Kimlik', type: 'text', width: 50 },
                    { id: 'f4', label: 'Doğum Tarihi', type: 'date', width: 50 }
                ]
            },
            {
                id: 'form2',
                title: 'İletişim Bilgileri',
                fields: [
                    { id: 'f5', label: 'Telefon', type: 'tel', width: 50 },
                    { id: 'f6', label: 'E-posta', type: 'email', width: 50 },
                    { id: 'f7', label: 'Adres', type: 'textarea', width: 100 }
                ]
            },
            {
                id: 'form3',
                title: 'Adres Bilgileri',
                fields: [
                    { id: 'f8', label: 'İl', type: 'select', width: 50 },
                    { id: 'f9', label: 'İlçe', type: 'select', width: 50 },
                    { id: 'f10', label: 'Mahalle', type: 'text', width: 100 }
                ]
            }
        ];

        forms.forEach((form, idx) => {
            console.log(`🎨 renderForms() - Processing form ${form.id}`);
            const formSettings = this.fieldSettings.get(form.id);
            const isCollapsed = formSettings?.collapsed || false;
            
            const formHtml = $(`
                <div class="form-section" data-form-id="${form.id}">
                    <div class="form-header">
                        <span class="drag-handle form-drag-handle" title="Sürükleyerek sırayı değiştirin">
                            <i class="fa fa-arrows-v"></i>
                        </span>
                        <span class="form-title">
                            <i class="fa fa-chevron-${isCollapsed ? 'right' : 'down'} toggle-icon"></i>
                            ${form.title}
                        </span>
                    </div>
                    <div class="form-body" style="${isCollapsed ? 'display: none;' : ''}">
                        <div class="fields-area" data-form-id="${form.id}"></div>
                    </div>
                </div>
            `);

            const fieldsArea = formHtml.find('.fields-area');
            console.log(`🎨 renderForms() - Form ${form.id} fields area:`, fieldsArea.length);
            console.log(`🎨 renderForms() - Fields area classes:`, fieldsArea.attr('class'));
            
            // Render fields
            form.fields.forEach(field => {
                const fieldSettings = this.fieldSettings.get(field.id);
                const savedWidth = fieldSettings?.width || field.width;
                const isHidden = fieldSettings?.hidden || false;
                
                console.log(`🎨 Field ${field.id}: width=${savedWidth}%, hidden=${isHidden}, settings=`, fieldSettings);
                
                if (isHidden) {
                    console.log(`🎨 Field ${field.id} skipped - hidden`);
                    return; // Skip hidden fields
                }
                
                // Calculate proper width styles
                let widthStyle = 'width: 100%;';
                let flexStyle = '';
                
                switch(savedWidth) {
                    case 25:
                        widthStyle = 'width: calc(25% - 7.5px);';
                        flexStyle = 'flex: 0 0 calc(25% - 7.5px);';
                        break;
                    case 50:
                        widthStyle = 'width: calc(50% - 5px);';
                        flexStyle = 'flex: 0 0 calc(50% - 5px);';
                        break;
                    case 75:
                        widthStyle = 'width: calc(75% - 2.5px);';
                        flexStyle = 'flex: 0 0 calc(75% - 2.5px);';
                        break;
                    case 100:
                        widthStyle = 'width: 100%;';
                        flexStyle = 'flex: 0 0 100%;';
                        break;
                }
                
                // Check both local settings and global required fields
                const isLocalRequired = fieldSettings?.required || false;
                const isGlobalRequired = this.globalRequiredFields.includes(field.id);
                const isRequired = isLocalRequired || isGlobalRequired;
                
                console.log(`🔍 Field ${field.id}: isAdmin=${this.isAdmin}, isLocalRequired=${isLocalRequired}, isGlobalRequired=${isGlobalRequired}, final=${isRequired}`);
                
                const fieldHtml = $(`
                    <div class="field-item" data-field-id="${field.id}" data-width="${savedWidth}" style="${widthStyle} ${flexStyle}">
                        <div class="field-content">
                            <label>
                                ${field.label}
                                ${isRequired ? '<span class="required-star">*</span>' : ''}
                            </label>
                            ${this.createInput(field.type)}
                            <div class="field-controls" ${this.layoutSettings.showWidthControls === false ? 'style="display: none;"' : ''}>
                                <div class="field-controls-row">
                                    <i class="fa fa-eye-slash hide-field-btn" title="Alanı Gizle"></i>
                                    ${this.isAdmin ? `
                                        <label class="required-checkbox-label">
                                            <input type="checkbox" class="required-checkbox" data-field-id="${field.id}" ${isRequired ? 'checked' : ''} />
                                            <span>Zorunlu</span>
                                        </label>
                                    ` : ''}
                                    <select class="width-select" data-field-id="${field.id}">
                                        <option value="25" ${savedWidth === 25 ? 'selected' : ''}>25%</option>
                                        <option value="50" ${savedWidth === 50 ? 'selected' : ''}>50%</option>
                                        <option value="75" ${savedWidth === 75 ? 'selected' : ''}>75%</option>
                                        <option value="100" ${savedWidth === 100 ? 'selected' : ''}>100%</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                
                fieldsArea.append(fieldHtml);
                console.log(`🎨 Field ${field.id} appended to fields area. Field width style:`, fieldHtml.attr('style'));
                
                // Check if required checkbox was added for admin
                if (this.isAdmin) {
                    const checkboxFound = fieldHtml.find('.required-checkbox').length > 0;
                    console.log(`🔍 Field ${field.id} - Required checkbox found: ${checkboxFound}`);
                    if (!checkboxFound) {
                        console.error(`❌ Required checkbox NOT rendered for field ${field.id}!`);
                    }
                }
                
                // Verify hide button is rendered
                const hideBtn = fieldHtml.find('.hide-field-btn');
                console.log(`🎨 Field ${field.id} hide button found:`, hideBtn.length, 'visibility:', hideBtn.is(':visible'));
            });
            
            // Add hidden fields indicator
            const hiddenCount = form.fields.filter(f => this.fieldSettings.get(f.id)?.hidden).length;
            if (hiddenCount > 0) {
                fieldsArea.after(`
                    <div class="hidden-fields-info" style="padding: 10px; background: #f8f9fa; border-top: 1px solid #dee2e6; ${this.layoutSettings.showWidthControls === false ? 'display: none;' : ''}">
                        <i class="fa fa-info-circle"></i> ${hiddenCount} alan gizli. 
                        <button type="button" class="btn btn-xs btn-info show-hidden-btn" data-form-id="${form.id}">
                            Gizli Alanları Göster
                        </button>
                    </div>
                `);
            }
            
            formsContainer.append(formHtml);
            
            // Debug flex layout after adding form
            const finalFieldsArea = formHtml.find('.fields-area');
            console.log(`🎨 Form ${form.id} final fields area CSS:`);
            console.log('  - display:', finalFieldsArea.css('display'));
            console.log('  - flex-wrap:', finalFieldsArea.css('flex-wrap'));
            console.log('  - gap:', finalFieldsArea.css('gap'));
            console.log('  - children count:', finalFieldsArea.children('.field-item').length);
            console.log('  - computed styles:', window.getComputedStyle(finalFieldsArea[0]));
            
            // Force apply CSS if needed
            if (finalFieldsArea.css('display') !== 'flex') {
                console.warn('⚠️ Fields area not flex! Force applying CSS...');
                finalFieldsArea.css({
                    'display': 'flex',
                    'flex-wrap': 'wrap',
                    'gap': '10px',
                    'align-items': 'flex-start'
                });
            }
            
            // Check individual field items
            finalFieldsArea.children('.field-item').each(function(i) {
                const $field = $(this);
                const dataWidth = $field.attr('data-width');
                const computedWidth = $field.css('width');
                const computedFlex = $field.css('flex');
                
                console.log(`    Field ${i}: width=${computedWidth}, flex=${computedFlex}, data-width=${dataWidth}%`);
                
                // Force apply width and flex if not correct
                if (dataWidth) {
                    const expectedWidth = `calc(${dataWidth}% - 10px)`;
                    if (computedWidth !== expectedWidth) {
                        console.warn(`    ⚠️ Field ${i} width mismatch. Expected: ${expectedWidth}, Got: ${computedWidth}`);
                        $field.css({
                            'width': expectedWidth,
                            'flex': `0 0 ${expectedWidth}`,
                            'box-sizing': 'border-box'
                        });
                    }
                }
            });
        });
        
        // Update hidden fields count after rendering
        this.updateHiddenFieldsList();
    }

    private createInput(type: string): string {
        switch (type) {
            case 'textarea':
                return '<textarea class="form-control"></textarea>';
            case 'select':
                return '<select class="form-control"><option>Seçiniz</option></select>';
            default:
                return `<input type="${type}" class="form-control" />`;
        }
    }

    private bindEvents(): void {
        const self = this;
        
        // Save button
        this.container.on('click', '.save-btn', function() {
            self.saveSettings();
        });
        
        // Reset button
        this.container.on('click', '.reset-btn', function() {
            if (confirm('Tüm ayarlar sıfırlanacak. Emin misiniz?')) {
                self.resetSettings();
            }
        });
        
        // Toggle width controls button
        this.container.on('click', '.toggle-width-controls-btn', function() {
            const $btn = $(this);
            const $toggleText = $btn.find('.toggle-text');
            const widthControls = self.container.find('.field-controls');
            const hiddenFieldsInfo = self.container.find('.hidden-fields-info');
            
            if (widthControls.is(':visible')) {
                // Gizle
                widthControls.slideUp(200);
                hiddenFieldsInfo.slideUp(200);
                $toggleText.text('Kapalı').removeClass('badge-secondary').addClass('badge-danger');
                $btn.removeClass('btn-warning').addClass('btn-default');
                self.layoutSettings.showWidthControls = false;
            } else {
                // Göster
                widthControls.slideDown(200);
                hiddenFieldsInfo.slideDown(200);
                $toggleText.text('Açık').removeClass('badge-danger').addClass('badge-secondary');
                $btn.removeClass('btn-default').addClass('btn-warning');
                self.layoutSettings.showWidthControls = true;
            }
        });
        
        // Form header toggle
        this.container.on('click', '.form-header', function(e) {
            if ($(e.target).closest('.drag-handle').length) return;
            
            const $header = $(this);
            const $body = $header.next('.form-body');
            const $icon = $header.find('.toggle-icon');
            const formId = $header.parent().data('form-id');
            
            if ($body.is(':visible')) {
                $body.slideUp(200);
                $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
                self.updateFormSetting(formId, { collapsed: true });
            } else {
                $body.slideDown(200);
                $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
                self.updateFormSetting(formId, { collapsed: false });
            }
        });
        
        // Field width change
        this.container.on('change', '.width-select', function() {
            const $select = $(this);
            const fieldId = $select.data('field-id');
            const newWidth = parseInt($select.val() as string);
            const $field = $select.closest('.field-item');
            
            // Update width with proper flex calculation
            let widthCalc = '100%';
            let flexBasis = '100%';
            
            switch(newWidth) {
                case 25:
                    widthCalc = 'calc(25% - 7.5px)';
                    flexBasis = 'calc(25% - 7.5px)';
                    break;
                case 50:
                    widthCalc = 'calc(50% - 5px)';
                    flexBasis = 'calc(50% - 5px)';
                    break;
                case 75:
                    widthCalc = 'calc(75% - 2.5px)';
                    flexBasis = 'calc(75% - 2.5px)';
                    break;
                case 100:
                    widthCalc = '100%';
                    flexBasis = '100%';
                    break;
            }
            
            $field.css({
                'width': widthCalc,
                'flex': `0 0 ${flexBasis}`
            }).attr('data-width', newWidth);
            
            self.updateFieldSetting(fieldId, { width: newWidth });
            
            console.log(`Width changed for field ${fieldId}: ${newWidth}% - CSS: ${widthCalc}`);
        });
        
        // Required field checkbox (only for admin)
        if (this.isAdmin) {
            this.container.on('change', '.required-checkbox', function() {
                const $checkbox = $(this);
                const fieldId = $checkbox.data('field-id');
                const isRequired = $checkbox.is(':checked');
                
                // Update local setting
                self.updateFieldSetting(fieldId, { required: isRequired });
                
                // Update global required fields list
                if (isRequired) {
                    if (!self.globalRequiredFields.includes(fieldId)) {
                        self.globalRequiredFields.push(fieldId);
                    }
                } else {
                    const index = self.globalRequiredFields.indexOf(fieldId);
                    if (index > -1) {
                        self.globalRequiredFields.splice(index, 1);
                    }
                }
                
                // Update the star immediately
                const $label = $checkbox.closest('.field-item').find('label').first();
                if (isRequired) {
                    if (!$label.find('.required-star').length) {
                        $label.append('<span class="required-star">*</span>');
                    }
                } else {
                    $label.find('.required-star').remove();
                }
                
                console.log(`Required changed for field ${fieldId}: ${isRequired}`);
                console.log(`Updated global required fields:`, self.globalRequiredFields);
            });
        }
        
        // Hide field button
        this.container.on('click', '.hide-field-btn', function(e) {
            console.log('👁️ Hide button clicked');
            e.stopPropagation();
            const $field = $(this).closest('.field-item');
            const fieldId = $field.data('field-id');
            
            console.log(`👁️ Hiding field ${fieldId}`);
            
            if (confirm('Bu alanı gizlemek istediğinize emin misiniz?')) {
                $field.fadeOut(200, function() {
                    self.updateFieldSetting(fieldId, { hidden: true });
                    console.log(`👁️ Field ${fieldId} marked as hidden, re-rendering forms`);
                    self.updateHiddenFieldsList(); // Update hidden count immediately
                    self.renderForms(); // Re-render to update hidden count
                });
            }
        });
        
        // Show hidden fields button
        this.container.on('click', '.show-hidden-btn', function() {
            const formId = $(this).data('form-id');
            
            // Reset hidden status for all fields in this form
            self.fieldSettings.forEach((settings, fieldId) => {
                if (fieldId.startsWith('f')) { // Field IDs start with 'f'
                    settings.hidden = false;
                }
            });
            
            self.updateHiddenFieldsList(); // Update count immediately
            self.renderForms();
        });
        
        // Hidden fields dropdown toggle
        this.container.on('click', '.hidden-fields-toggle', function(e) {
            e.stopPropagation();
            const $dropdown = $(this).siblings('.hidden-fields-dropdown');
            $dropdown.toggle();
            
            if ($dropdown.is(':visible')) {
                self.updateHiddenFieldsList();
            }
        });
        
        // Show individual hidden field
        this.container.on('click', '.show-hidden-field-btn', function(e) {
            e.stopPropagation();
            const fieldId = $(this).data('field-id');
            self.updateFieldSetting(fieldId, { hidden: false });
            self.updateHiddenFieldsList(); // Update count immediately
            self.renderForms();
        });
        
        // Close dropdown when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.hidden-fields-container').length) {
                $('.hidden-fields-dropdown').hide();
            }
        });
        
        // Simple drag and drop
        this.setupDragAndDrop();
    }

    private updateHiddenFieldsList(): void {
        const hiddenFieldsList = this.container.find('.hidden-fields-list');
        const hiddenCountSpan = this.container.find('.hidden-count');
        hiddenFieldsList.empty();
        
        let hiddenFields: { fieldId: string, fieldName: string, formName: string }[] = [];
        
        // Collect all hidden fields
        const forms = [
            { id: 'form1', title: 'Müşteri Bilgileri', fields: [
                { id: 'f1', label: 'Ad' }, { id: 'f2', label: 'Soyad' }, 
                { id: 'f3', label: 'TC Kimlik' }, { id: 'f4', label: 'Doğum Tarihi' }
            ]},
            { id: 'form2', title: 'İletişim Bilgileri', fields: [
                { id: 'f5', label: 'Telefon' }, { id: 'f6', label: 'E-posta' }, { id: 'f7', label: 'Adres' }
            ]},
            { id: 'form3', title: 'Adres Bilgileri', fields: [
                { id: 'f8', label: 'İl' }, { id: 'f9', label: 'İlçe' }, { id: 'f10', label: 'Mahalle' }
            ]}
        ];
        
        forms.forEach(form => {
            form.fields.forEach(field => {
                const fieldSettings = this.fieldSettings.get(field.id);
                if (fieldSettings?.hidden) {
                    hiddenFields.push({
                        fieldId: field.id,
                        fieldName: field.label,
                        formName: form.title
                    });
                }
            });
        });
        
        hiddenCountSpan.text(`(${hiddenFields.length})`);
        
        if (hiddenFields.length === 0) {
            hiddenFieldsList.html('<div class="no-hidden-fields">Gizlenmiş alan yok</div>');
        } else {
            hiddenFields.forEach(({ fieldId, fieldName, formName }) => {
                hiddenFieldsList.append(`
                    <div class="hidden-field-item">
                        <div class="field-info">
                            <span class="field-name">${fieldName}</span>
                            <span class="form-name">${formName}</span>
                        </div>
                        <button type="button" class="btn btn-xs btn-success show-hidden-field-btn" data-field-id="${fieldId}">
                            <i class="fa fa-eye"></i> Göster
                        </button>
                    </div>
                `);
            });
        }
    }

    private setupDragAndDrop(): void {
        console.log('🖱️ Setting up drag and drop handlers');
        const self = this;
        let draggedElement: HTMLElement | null = null;
        let placeholder: JQuery | null = null;
        
        // Form dragging with visual feedback
        this.container.on('mousedown', '.form-drag-handle', function(e) {
            console.log('🖱️ Form drag started');
            e.preventDefault();
            e.stopPropagation();
            
            const $draggedForm = $(this).closest('.form-section');
            draggedElement = $draggedForm[0];
            
            // Create placeholder with arrow indicator
            placeholder = $(`
                <div class="form-placeholder">
                    <div class="placeholder-content">
                        <i class="fa fa-arrow-down animated-arrow"></i>
                        <span>Buraya bırakın</span>
                        <i class="fa fa-arrow-up animated-arrow"></i>
                    </div>
                </div>
            `);
            placeholder.height($draggedForm.outerHeight() || 100);
            $draggedForm.after(placeholder);
            
            // Style the dragged element
            $draggedForm.addClass('dragging-form');
            $draggedForm.css({
                'position': 'fixed',
                'z-index': 1000,
                'pointer-events': 'none',
                'width': $draggedForm.width() + 'px'
            });
            
            // Position at mouse
            const updatePosition = function(e: MouseEvent) {
                $draggedForm.css({
                    'left': (e.pageX - 50) + 'px',
                    'top': (e.pageY - 20) + 'px'
                });
            };
            updatePosition(e as any);
            
            const handleMove = function(e: MouseEvent) {
                if (!draggedElement || !placeholder) return;
                
                updatePosition(e);
                
                // Find drop target
                let moved = false;
                self.container.find('.form-section').not(draggedElement).each(function() {
                    const $form = $(this);
                    const rect = this.getBoundingClientRect();
                    const midpoint = rect.top + rect.height / 2;
                    
                    if (e.clientY < midpoint) {
                        if (placeholder!.index() !== $form.index() - 1) {
                            placeholder!.insertBefore($form);
                            moved = true;
                        }
                        return false;
                    }
                });
                
                // If not moved yet, check if should go to end
                if (!moved) {
                    const $lastForm = self.container.find('.form-section').not(draggedElement).last();
                    if ($lastForm.length && placeholder!.index() !== $lastForm.index() + 1) {
                        placeholder!.insertAfter($lastForm);
                    }
                }
            };
            
            const handleUp = function() {
                console.log('🖱️ Form drag ended');
                if (draggedElement && placeholder) {
                    const $draggedForm = $(draggedElement);
                    
                    // Reset styles
                    $draggedForm.css({
                        'position': '',
                        'z-index': '',
                        'pointer-events': '',
                        'width': '',
                        'left': '',
                        'top': ''
                    });
                    
                    // Move to placeholder position
                    placeholder.replaceWith($draggedForm);
                    $draggedForm.removeClass('dragging-form');
                    
                    // Report drag action
                    self.reportPageVisit("Form Editor V2", "Form sıralamasını değiştirdi");
                    
                    // Cleanup
                    placeholder = null;
                    draggedElement = null;
                }
                
                $(document).off('mousemove', handleMove);
                $(document).off('mouseup', handleUp);
            };
            
            $(document).on('mousemove', handleMove);
            $(document).on('mouseup', handleUp);
        });
        
        // Field dragging
        this.container.on('mousedown', '.field-item', function(e) {
            console.log('🖱️ Field drag attempt - target:', e.target.tagName, e.target.className);
            
            if ($(e.target).is('input, select, textarea, label, button') || 
                $(e.target).closest('.field-controls, .hide-field-btn').length) {
                console.log('🖱️ Field drag blocked - interactive element clicked');
                return;
            }
            
            console.log('🖱️ Field drag started');
            e.preventDefault();
            draggedElement = this;
            $(this).css('opacity', '0.5');
            console.log('🖱️ Field drag element:', $(this).data('field-id'));
            
            const handleMove = function(e: MouseEvent) {
                if (!draggedElement) return;
                
                // Find target container
                self.container.find('.fields-area').each(function() {
                    const rect = this.getBoundingClientRect();
                    if (e.clientX >= rect.left && e.clientX <= rect.right &&
                        e.clientY >= rect.top && e.clientY <= rect.bottom) {
                        
                        console.log('🖱️ Field drag - in valid drop zone');
                        
                        const fields = $(this).find('.field-item').not(draggedElement);
                        let inserted = false;
                        
                        fields.each(function() {
                            const fieldRect = this.getBoundingClientRect();
                            if (e.clientX < fieldRect.left + fieldRect.width / 2) {
                                console.log('🖱️ Field drag - inserting before field');
                                $(draggedElement!).insertBefore(this);
                                inserted = true;
                                return false;
                            }
                        });
                        
                        if (!inserted) {
                            console.log('🖱️ Field drag - appending to end');
                            $(this).append(draggedElement!);
                        }
                        
                        return false;
                    }
                });
            };
            
            const handleUp = function() {
                console.log('🖱️ Field drag ended');
                if (draggedElement) {
                    $(draggedElement).css('opacity', '1');
                    draggedElement = null;
                }
                $(document).off('mousemove', handleMove);
                $(document).off('mouseup', handleUp);
            };
            
            $(document).on('mousemove', handleMove);
            $(document).on('mouseup', handleUp);
        });
    }

    private updateFormSetting(formId: string, newSettings: Partial<ExtendedFieldSettings>): void {
        const current = this.fieldSettings.get(formId) || {};
        this.fieldSettings.set(formId, { ...current, ...newSettings });
    }

    private updateFieldSetting(fieldId: string, newSettings: Partial<ExtendedFieldSettings>): void {
        const current = this.fieldSettings.get(fieldId) || {};
        this.fieldSettings.set(fieldId, { ...current, ...newSettings });
    }

    private async saveSettings(): Promise<void> {
        try {
            // Report save action
            this.reportPageVisit("Form Editor V2", "Form ayarlarını kaydetti");
            
            const settings = {
                layoutSettings: this.layoutSettings,
                fieldSettings: Array.from(this.fieldSettings.entries()).map(([id, fieldSetting]) => ({
                    fieldId: id,
                    ...fieldSetting
                }))
            };

            console.log('Saving settings:', settings);

            await FormEditorV2Service.SaveUserSettings({
                Settings: JSON.stringify(settings)
            } as SaveUserSettingsRequest);

            notifySuccess("Ayarlar kaydedildi");
        } catch (error) {
            notifyError("Kaydetme hatası");
            console.error('Save error:', error);
        }
    }

    private async loadSettings(): Promise<void> {
        try {
            const response = await FormEditorV2Service.GetUserSettings({} as GetUserSettingsRequest);
            
            // Check IsAdmin from server response
            console.log('📡 Server response - IsAdmin:', response.IsAdmin);
            console.log('📡 Server response - Username:', response.Username);
            console.log('📡 Server response - UserId:', response.UserId);
            
            // Update isAdmin from server response if available
            if (typeof response.IsAdmin === 'boolean') {
                this.isAdmin = response.IsAdmin;
                console.log('✅ Updated isAdmin from server:', this.isAdmin);
            }
            
            // Get global required fields
            if (response.RequiredFields && Array.isArray(response.RequiredFields)) {
                this.globalRequiredFields = response.RequiredFields;
                console.log('✅ Global required fields:', this.globalRequiredFields);
            }

            if (response.Settings) {
                const settings = JSON.parse(response.Settings);
                console.log('Loaded settings:', settings);
                
                this.layoutSettings = settings.layoutSettings || { widthMode: 'normal', formOrder: [], showWidthControls: true };
                
                // Clear and reload field settings
                this.fieldSettings.clear();
                if (settings.fieldSettings) {
                    settings.fieldSettings.forEach((item: any) => {
                        this.fieldSettings.set(item.fieldId, {
                            width: item.width,
                            collapsed: item.collapsed,
                            hidden: item.hidden,
                            required: item.required
                        });
                    });
                }
                
                // Re-render with loaded settings
                // this.renderForms(); // Already rendered in init()
                
                // Apply layout mode
                this.container.find('.width-mode-select').val(this.layoutSettings.widthMode);
                
                // Apply width controls visibility
                if (this.layoutSettings.showWidthControls === false) {
                    const $btn = this.container.find('.toggle-width-controls-btn');
                    const $toggleText = $btn.find('.toggle-text');
                    $toggleText.text('Kapalı').removeClass('badge-secondary').addClass('badge-danger');
                    $btn.removeClass('btn-warning').addClass('btn-default');
                }
                
                this.container.find('.forms-container')
                    .removeClass('width-mode-compact width-mode-normal width-mode-wide')
                    .addClass(`width-mode-${this.layoutSettings.widthMode}`);
            }
        } catch (error) {
            console.error('Load settings error:', error);
        }
    }

    private resetSettings(): void {
        // Report reset action
        this.reportPageVisit("Form Editor V2", "Form ayarlarını sıfırladı");
        
        this.fieldSettings.clear();
        this.layoutSettings = { widthMode: 'normal', formOrder: [], showWidthControls: true };
        this.renderForms();
        notifySuccess("Ayarlar sıfırlandı");
    }
}