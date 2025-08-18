/**
 * Dialog Field Customizer
 * Basit ve temiz bir field özelleştirme sistemi
 */

import { alertDialog, confirmDialog, notifySuccess, notifyError, notifyWarning } from "@serenity-is/corelib";

declare var $: any;
declare var Q: any;

export class DialogFieldCustomizer {
    private static isInitialized = false;
    private static currentDialog: HTMLElement | null = null;
    private static dialogSettings: Map<string, any> = new Map();
    
    public static initialize() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        
        console.log('🚀 DialogFieldCustomizer başlatıldı');
        
        // Her 500ms'de bir dialog kontrolü yap
        setInterval(() => this.checkForDialogs(), 500);
        
        // Debug komutları
        (window as any).reloadFieldSettings = () => this.clearCache();
        (window as any).resetFieldSettings = () => {
            this.clearCache();
            // LocalStorage'dan da temizle
            Object.keys(localStorage).forEach(key => {
                if (key.includes('FieldSettings') || key.includes('fieldSettings')) {
                    localStorage.removeItem(key);
                }
            });
            console.log('Tüm field ayarları sıfırlandı!');
            window.location.reload();
        };
        (window as any).checkDialogs = () => this.checkForDialogs();
        (window as any).findDialogs = () => {
            const all = document.querySelectorAll('*');
            const dialogs: any[] = [];
            all.forEach(el => {
                if (el.className && el.className.toString().toLowerCase().includes('dialog')) {
                    dialogs.push({
                        element: el,
                        className: el.className,
                        hasToolbar: !!el.querySelector('[class*="toolbar"], [class*="button"]')
                    });
                }
            });
            console.log('Bulunan dialog elementleri:', dialogs);
            return dialogs;
        };
        console.log('💡 Kullanılabilir komutlar:');
        console.log('  • reloadFieldSettings() - Cache temizle ve yeniden yükle');
        console.log('  • checkDialogs() - Dialog kontrolünü manuel çalıştır');
        console.log('  • findDialogs() - Sayfadaki tüm dialog elementlerini bul');
    }
    
    private static checkForDialogs() {
        // Tüm olası dialog selector'ları
        const dialogs = document.querySelectorAll('.s-Dialog, .ui-dialog-content, .s-Panel, [class*="Dialog"]');
        
        dialogs.forEach(dialog => {
            // Eğer zaten buton eklenmişse atla
            if (dialog.querySelector('.field-customizer-button')) return;
            
            // Toolbar'ı bul - farklı selector'ları dene
            let toolbar = dialog.querySelector('.s-DialogToolbar, .s-Toolbar, .tool-buttons, .buttons-inner');
            
            // Eğer toolbar bulunamazsa, dialog'un içinde buton grubu ara
            if (!toolbar) {
                const buttonGroups = dialog.querySelectorAll('[class*="button"], [class*="toolbar"]');
                buttonGroups.forEach(group => {
                    if (group.querySelector('button') && !toolbar) {
                        toolbar = group;
                    }
                });
            }
            
            // Hala toolbar bulunamazsa, Kaydet/Sil butonlarının yanına ekle
            if (!toolbar) {
                const saveButton = dialog.querySelector('[data-action="apply"], [title="Kaydet"], button[class*="save"]');
                if (saveButton && saveButton.parentElement) {
                    toolbar = saveButton.parentElement;
                }
            }
            
            if (!toolbar) {
                console.log('Toolbar bulunamadı:', dialog);
                return;
            }
            
            console.log('Dialog bulundu, buton ekleniyor:', dialog);
            
            // Özelleştir butonu ekle
            const customizeBtn = document.createElement('button');
            customizeBtn.className = 'btn btn-primary field-customizer-button';
            customizeBtn.innerHTML = '<i class="fa fa-sliders"></i> Özelleştir';
            customizeBtn.style.marginLeft = '5px';
            customizeBtn.onclick = () => this.openCustomizationPanel(dialog as HTMLElement);
            
            toolbar.appendChild(customizeBtn);
            
            // Dialog ayarlarını uygula
            this.applyDialogSettings(dialog as HTMLElement);
        });
    }
    
    private static getDialogName(dialog: HTMLElement): string {
        // Dialog sınıf adından dialog tipini bul
        const classList = Array.from(dialog.classList);
        for (const cls of classList) {
            if (cls.includes('Dialog')) {
                return cls.split('_').pop() || cls;
            }
        }
        
        // Veya data attribute'dan al
        return dialog.getAttribute('data-dialog-type') || 'UnknownDialog';
    }
    
    private static async loadSettings(dialogName: string) {
        const cacheKey = `settings_${dialogName}`;
        
        // Cache kontrolü (5 dakika)
        const cached = this.dialogSettings.get(cacheKey);
        const cacheTime = this.dialogSettings.get(`${cacheKey}_time`);
        const now = Date.now();
        
        if (cached && cacheTime && (now - cacheTime) < 300000) {
            return cached;
        }
        
        try {
            // Admin zorunlu alanları getir
            const requiredResponse = await Q.serviceCall({
                url: Q.resolveUrl('~/Services/Administration/FieldCustomization/GetRequiredFields'),
                request: { DialogName: dialogName }
            });
            
            // Kullanıcı ayarlarını getir
            const userResponse = await Q.serviceCall({
                url: Q.resolveUrl('~/Services/Administration/FieldCustomization/GetUserFieldSettings'),
                request: { DialogName: dialogName }
            });
            
            const settings = {
                requiredFields: requiredResponse.RequiredFields || [],
                userSettings: userResponse.Settings || []
            };
            
            // Cache'e kaydet
            this.dialogSettings.set(cacheKey, settings);
            this.dialogSettings.set(`${cacheKey}_time`, now);
            
            return settings;
        } catch (error) {
            console.error('Ayarlar yüklenemedi:', error);
            return { requiredFields: [], userSettings: [] };
        }
    }
    
    private static async applyDialogSettings(dialog: HTMLElement) {
        const dialogName = this.getDialogName(dialog);
        const settings = await this.loadSettings(dialogName);
        
        const fields = dialog.querySelectorAll('.field');
        const fieldMap = new Map<string, HTMLElement>();
        
        // Field'ları map'e ekle - caption'dan yıldızı temizle
        fields.forEach(field => {
            const caption = field.querySelector('.caption');
            if (caption) {
                // Yıldızları temizleyerek sadece label'ı al
                let label = caption.textContent?.replace(/\*/g, '').trim();
                if (label) {
                    fieldMap.set(label, field as HTMLElement);
                }
            }
        });
        
        // Admin zorunlu alanlarını işaretle
        settings.requiredFields.forEach((fieldName: string) => {
            const field = fieldMap.get(fieldName);
            if (field) {
                const caption = field.querySelector('.caption');
                const input = field.querySelector('input, select, textarea') as HTMLInputElement;
                
                if (caption && !caption.querySelector('.admin-required-star')) {
                    const star = document.createElement('sup');
                    star.className = 'admin-required-star';
                    star.style.color = 'red';
                    star.textContent = '*';
                    caption.appendChild(star);
                }
                
                if (input) {
                    input.setAttribute('required', 'true');
                    input.setAttribute('data-admin-required', 'true');
                }
            }
        });
        
        // Kullanıcı ayarlarını uygula (SADECE görünürlük, sıralama YAPMA)
        if (settings.userSettings && settings.userSettings.length > 0) {
            settings.userSettings.forEach((setting: any) => {
                const field = fieldMap.get(setting.FieldName);
                if (field) {
                    // Sadece görünürlük ayarı
                    if (!setting.IsVisible) {
                        (field as HTMLElement).style.display = 'none';
                    } else {
                        (field as HTMLElement).style.display = '';
                    }
                }
            });
        }
    }
    
    private static async openCustomizationPanel(dialog: HTMLElement) {
        const dialogName = this.getDialogName(dialog);
        const settings = await this.loadSettings(dialogName);
        
        // İzin kontrolü
        const permResponse = await Q.serviceCall({
            url: Q.resolveUrl('~/Services/Administration/FieldCustomization/CheckPermissions')
        });
        const isAdmin = permResponse.IsAdmin;
        
        // Field listesini topla
        const fields = Array.from(dialog.querySelectorAll('.field'));
        const fieldData = fields.map((field, index) => {
            // Yıldızları temizleyerek label'ı al
            const label = field.querySelector('.caption')?.textContent?.replace(/\*/g, '').trim() || '';
            const userSetting = settings.userSettings.find((s: any) => s.FieldName === label);
            const isRequired = settings.requiredFields.includes(label);
            
            return {
                element: field as HTMLElement,
                name: label,
                order: userSetting?.DisplayOrder ?? index,
                visible: userSetting?.IsVisible ?? true,
                required: isRequired
            };
        });
        
        // Panel HTML'i oluştur
        const panel = document.createElement('div');
        panel.className = 'field-customization-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 20px;
            z-index: 100000;
            max-height: 80vh;
            overflow-y: auto;
            width: 500px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        
        panel.innerHTML = `
            <h3>Alan Özelleştirme</h3>
            <div class="field-list" style="margin: 20px 0;">
                ${fieldData.map((field, index) => `
                    <div class="field-item" data-field="${field.name}" style="
                        margin: 10px 0;
                        padding: 10px;
                        background: #f5f5f5;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <label>
                                    <input type="checkbox" class="field-visible" ${field.visible ? 'checked' : ''}>
                                    <strong>${field.name}</strong>
                                    ${field.required ? '<sup style="color:red">*</sup>' : ''}
                                </label>
                                ${isAdmin ? `
                                    <label style="margin-left: 20px;">
                                        <input type="checkbox" class="field-required" ${field.required ? 'checked' : ''}>
                                        Zorunlu
                                    </label>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: right;">
                <button class="btn btn-primary" id="saveFieldSettings">Kaydet</button>
                <button class="btn btn-default" id="cancelFieldSettings">İptal</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Event handlers
        this.attachPanelEvents(panel, dialogName, isAdmin, dialog);
    }
    
    private static attachPanelEvents(panel: HTMLElement, dialogName: string, isAdmin: boolean, dialog: HTMLElement) {
        // Sıralama kaldırıldı - sadece görünürlük ve zorunlu alan
        
        // Save button
        panel.querySelector('#saveFieldSettings')?.addEventListener('click', async () => {
            const fieldItems = panel.querySelectorAll('.field-item');
            
            // Admin zorunlu alanları kaydet
            if (isAdmin) {
                const requiredFields: string[] = [];
                fieldItems.forEach(item => {
                    const fieldName = (item as HTMLElement).dataset.field!;
                    const isRequired = (item.querySelector('.field-required') as HTMLInputElement)?.checked;
                    if (isRequired) {
                        requiredFields.push(fieldName);
                    }
                });
                
                await Q.serviceCall({
                    url: Q.resolveUrl('~/Services/Administration/FieldCustomization/SaveRequiredFields'),
                    request: {
                        DialogName: dialogName,
                        RequiredFields: requiredFields
                    }
                });
            }
            
            // Kullanıcı ayarlarını kaydet
            const userSettings: any[] = [];
            fieldItems.forEach((item, index) => {
                const fieldName = (item as HTMLElement).dataset.field!;
                const isVisible = (item.querySelector('.field-visible') as HTMLInputElement).checked;
                
                userSettings.push({
                    FieldName: fieldName,
                    IsVisible: isVisible,
                    DisplayOrder: 0  // Sıralama kullanılmıyor
                });
            });
            
            await Q.serviceCall({
                url: Q.resolveUrl('~/Services/Administration/FieldCustomization/SaveUserFieldSettings'),
                request: {
                    DialogName: dialogName,
                    Settings: userSettings
                }
            });
            
            // Cache temizle
            this.clearCache();
            
            // Panel kapat
            document.body.removeChild(panel);
            
            // Ayarları yeniden uygula
            this.applyDialogSettings(dialog);
            
            notifySuccess('Ayarlar kaydedildi!');
        });
        
        // Cancel button
        panel.querySelector('#cancelFieldSettings')?.addEventListener('click', () => {
            document.body.removeChild(panel);
        });
    }
    
    // Sıralama butonları kaldırıldı
    
    private static clearCache() {
        this.dialogSettings.clear();
        console.log('✅ Field settings cache temizlendi');
    }
}

// Otomatik başlat
document.addEventListener('DOMContentLoaded', () => {
    DialogFieldCustomizer.initialize();
});