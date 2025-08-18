/**
 * Simple Field Customizer
 * En basit ve kesin çalışan çözüm
 */
export class SimpleFieldCustomizer {
    
    private static observer: MutationObserver;
    private static processedDialogs = new Set<HTMLElement>();
    private static checkCount = 0;
    
    static initialize() {
        console.log('🚀 SimpleFieldCustomizer başlatılıyor...');
        
        // Gelişmiş debug fonksiyonları
        (window as any).debugFieldSettings = () => {
            console.log('=== COMPLETE FIELD SETTINGS DEBUG ===');
            console.log('Current User:', (window as any).Q?.Authorization?.userDefinition?.Username || 'Unknown');
            console.log('Is Admin:', this.isAdmin());
            console.log('Browser:', navigator.userAgent);
            console.log('Origin:', window.location.origin);
            console.log('');
            
            const keys = Object.keys(localStorage);
            const fieldKeys = keys.filter(key => 
                key.includes('FieldSettings') || 
                key.includes('GlobalFieldSettings') ||
                key.includes('DBBackup_')
            );
            
            console.log(`Found ${fieldKeys.length} field-related localStorage keys:`);
            
            fieldKeys.forEach(key => {
                const value = localStorage.getItem(key);
                console.log(`\n📋 ${key}:`);
                console.log(`  Raw:`, value);
                try {
                    const parsed = JSON.parse(value);
                    console.log(`  Parsed:`, parsed);
                    
                    if (key.includes('GlobalFieldSettings') || key.includes('DBBackup_')) {
                        if (parsed.requiredFields && Array.isArray(parsed.requiredFields)) {
                            console.log(`  🌍 Required fields:`, parsed.requiredFields);
                        } else {
                            const requiredFields = Object.keys(parsed).filter(k => parsed[k].required === true);
                            if (requiredFields.length > 0) {
                                console.log(`  🌍 Required fields:`, requiredFields);
                            }
                        }
                    }
                    
                    if (key.includes('FieldSettings') && !key.includes('Global')) {
                        const hiddenFields = Object.keys(parsed).filter(k => parsed[k].hidden === true);
                        if (hiddenFields.length > 0) {
                            console.log(`  👁️ Hidden fields:`, hiddenFields);
                        }
                    }
                } catch (e) {
                    console.log(`  ⚠️ Parse error:`, e.message);
                }
            });
            
            console.log('\n=== Database Cache ===');
            Object.keys(window as any).forEach(key => {
                if (key.startsWith('dbSettings_')) {
                    console.log(`${key}:`, (window as any)[key]);
                }
            });
            
            console.log('=== END DEBUG ===');
        };
        
        (window as any).debugCurrentDialog = () => {
            const dialogs = document.querySelectorAll('.ui-dialog, .modal, [class*="Dialog"]');
            dialogs.forEach((d, i) => {
                console.log(`Dialog ${i}:`, {
                    element: d,
                    className: d.className,
                    title: d.querySelector('.ui-dialog-title, .modal-title, h3, h4')?.textContent,
                    visible: (d as HTMLElement).offsetParent !== null
                });
            });
        };
        
        console.log('💡 Debug komutları:');
        console.log('  • debugFieldSettings() - Tüm ayarları görüntüle');
        console.log('  • debugCurrentDialog() - Aktif dialogları listele');
        console.log('  • testCrossBrowserSettings("DialogId") - Cross-browser test');
        console.log('  • syncRequiredFields("DialogId", ["field1", "field2"]) - Manuel senkronizasyon');
        console.log('  • clearAllFieldSettings() - Tüm ayarları temizle');
        console.log('  • clearFieldCache() - Sadece cache temizle');
        console.log('📍 Current origin:', window.location.origin);
        console.log('👤 Current user:', this.getCurrentUsername());
        console.log('🔑 Is admin:', this.isAdmin());
        
        // Test için global ayarları kopyalama fonksiyonu
        (window as any).exportGlobalSettings = () => {
            const exportData: any = {};
            Object.keys(localStorage).forEach(key => {
                if (key.includes('GlobalFieldSettings')) {
                    exportData[key] = localStorage.getItem(key);
                }
            });
            console.log('=== GLOBAL SETTINGS EXPORT ===');
            console.log(JSON.stringify(exportData));
            console.log('=== Yukarıyı kopyalayın ===');
            return exportData;
        };
        
        (window as any).importGlobalSettings = (data: any) => {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            Object.keys(data).forEach(key => {
                localStorage.setItem(key, data[key]);
            });
            console.log('✅ Global ayarlar import edildi!');
            console.log('Cache temizleniyor...');
            this.clearCache();
            console.log('Sayfayı yenileyin veya dialog\'u tekrar açın.');
        };
        
        // Cache temizleme fonksiyonu
        (window as any).clearFieldCache = () => {
            this.clearCache();
            console.log('✅ Field cache temizlendi!');
        };
        
        // Cross-browser test fonksiyonu
        (window as any).testCrossBrowserSettings = (dialogId: string) => {
            if (!dialogId) {
                console.error('❌ dialogId gerekli! Örnek: testCrossBrowserSettings("CustomerDialog")');
                return;
            }
            
            console.log(`=== CROSS-BROWSER TEST: ${dialogId} ===`);
            
            // Admin olmayan kullanıcı perspektifinden test et
            const originalIsAdmin = this.isAdmin;
            (this as any).isAdmin = () => false;
            
            try {
                const settings = this.loadSettings(dialogId);
                console.log('Normal kullanıcı görünümü:', settings);
                
                const requiredFields = Object.keys(settings).filter(k => settings[k].required === true);
                console.log('Görünen zorunlu alanlar:', requiredFields);
                
                if (requiredFields.length === 0) {
                    console.log('⚠️ Normal kullanıcı hiç zorunlu alan görmüyor!');
                    console.log('👉 Admin Chrome\'da ayar kaydetti mi?');
                    console.log('👉 Test kullanıcısı farklı tarayıcıda mı?');
                } else {
                    console.log('✅ Normal kullanıcı zorunlu alanları görebiliyor');
                }
            } finally {
                // Orijinal isAdmin fonksiyonunu geri yükle
                (this as any).isAdmin = originalIsAdmin;
            }
            
            console.log('=== TEST TAMAMLANDI ===');
        };
        
        // Zorunlu alan senkronizasyon fonksiyonu
        (window as any).syncRequiredFields = (dialogId: string, requiredFields: string[]) => {
            if (!dialogId || !Array.isArray(requiredFields)) {
                console.error('❌ Kullanım: syncRequiredFields("CustomerDialog", ["fieldName1", "fieldName2"])');
                return;
            }
            
            console.log(`🔄 ${dialogId} için zorunlu alanlar senkronize ediliyor:`, requiredFields);
            
            const data = {
                requiredFields: requiredFields,
                savedAt: new Date().toISOString(),
                savedBy: 'manual-sync',
                dialogId: dialogId
            };
            
            // Tüm cross-browser anahtarlarına kaydet
            const allKeys = [
                `GlobalFieldSettings_${dialogId}`,
                `Admin_GlobalFieldSettings_${dialogId}`,
                `SharedFieldSettings_${dialogId}`,
                `SystemFieldSettings_${dialogId}`,
                `CrossBrowser_GlobalFieldSettings_${dialogId}`,
                `DBBackup_GlobalFieldSettings_${dialogId}`
            ];
            
            allKeys.forEach(key => {
                try {
                    if (key === `GlobalFieldSettings_${dialogId}`) {
                        // Ana anahtar için obje formatı
                        const globalSettings: any = {};
                        requiredFields.forEach(field => {
                            globalSettings[field] = { required: true };
                        });
                        localStorage.setItem(key, JSON.stringify(globalSettings));
                    } else {
                        // Backup anahtarları için array formatı
                        localStorage.setItem(key, JSON.stringify(data));
                    }
                    console.log(`  ✅ ${key} kaydedildi`);
                } catch (e) {
                    console.error(`  ❌ ${key} kaydetme hatası:`, e);
                }
            });
            
            // Cache'i temizle
            this.clearCache();
            
            console.log('✅ Senkronizasyon tamamlandı! Sayfa yenilenmesi önerilir.');
        };
        
        // localStorage temizleme fonksiyonu
        (window as any).clearAllFieldSettings = () => {
            if (!confirm('TÜM field ayarları temizlenecek! Emin misiniz?')) {
                return;
            }
            
            const keys = Object.keys(localStorage);
            const fieldKeys = keys.filter(key => 
                key.includes('FieldSettings') || 
                key.includes('GlobalFieldSettings') ||
                key.includes('DBBackup_')
            );
            
            console.log(`${fieldKeys.length} anahtar temizlenecek:`, fieldKeys);
            
            fieldKeys.forEach(key => {
                localStorage.removeItem(key);
                console.log(`  🗑️ ${key} silindi`);
            });
            
            this.clearCache();
            console.log('✅ Tüm field ayarları temizlendi!');
        };
        
        // DOM değişikliklerini izle
        this.observer = new MutationObserver((mutations) => {
            // Sadece dialog ile ilgili değişiklikleri kontrol et
            let hasRelevantChange = false;
            
            mutations.forEach(mutation => {
                // Eklenen nodeler arasında dialog var mı?
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement) {
                        const className = node.className || '';
                        if (className.includes('dialog') || className.includes('Dialog') || 
                            className.includes('modal') || node.querySelector('.field')) {
                            hasRelevantChange = true;
                        }
                    }
                });
                
                // Kaldırılan dialogları temizle
                mutation.removedNodes.forEach(node => {
                    if (node instanceof HTMLElement && this.processedDialogs.has(node)) {
                        this.processedDialogs.delete(node);
                        node.querySelectorAll('*').forEach(child => {
                            if (child instanceof HTMLElement && this.processedDialogs.has(child)) {
                                this.processedDialogs.delete(child);
                            }
                        });
                    }
                });
            });
            
            // Sadece ilgili değişiklik varsa kontrol et
            if (hasRelevantChange) {
                setTimeout(() => this.checkForDialogs(), 100);
            }
        });
        
        // Body'yi izlemeye başla
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // jQuery dialog eventlerini dinle
        const $ = (window as any).jQuery || (window as any).$;
        if ($ && $.fn && $.fn.dialog) {
            console.log('✅ jQuery dialog desteği bulundu');
            
            $(document).on('dialogopen', (e: any) => {
                console.log('📢 Dialog açıldı');
                const element = e.target as HTMLElement;
                // Dialog açıldığında processedDialogs'tan çıkar ki tekrar işlensin
                if (this.processedDialogs.has(element)) {
                    console.log('🔄 Dialog yeniden açıldı, işlenmiş listesinden çıkarılıyor');
                    this.processedDialogs.delete(element);
                }
                setTimeout(() => this.checkForDialogs(), 100);
            });
            
            $(document).on('dialogclose', (e: any) => {
                const element = e.target as HTMLElement;
                if (this.processedDialogs.has(element)) {
                    console.log('🔚 Dialog kapatıldı, işlenmiş listesinden çıkarılıyor');
                    this.processedDialogs.delete(element);
                }
            });
        }
        
        // Broadcast dinleyiciyi başlat
        this.startBroadcastListener();
        
        console.log('✅ SimpleFieldCustomizer hazır!');
    }
    
    private static checkForDialogs() {
        // Geniş kapsamlı seçiciler
        const selectors = [
            '.ui-dialog',
            '.ui-dialog-content',
            '.s-Dialog',
            '.s-EntityDialog',
            '.modal-dialog',
            '.modal-content',
            '[class*="Dialog"]',
            '.s-Panel',
            'div[role="dialog"]'
        ];
        
        let foundAnyDialog = false;
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                foundAnyDialog = true;
                elements.forEach(elem => {
                    this.processDialog(elem as HTMLElement);
                });
            }
        });
        
        // Alternatif: Tüm .field içeren containerları kontrol et
        if (!foundAnyDialog) {
            const fieldsContainers = document.querySelectorAll('div');
            
            fieldsContainers.forEach(container => {
                const fields = container.querySelectorAll('.field');
                if (fields.length >= 2) { // En az 2 alan
                    const toolbar = container.querySelector('.s-Toolbar, .s-DialogToolbar, .buttons-inner, .tool-button');
                    if (toolbar) {
                        this.processDialog(container as HTMLElement);
                    }
                }
            });
        }
    }
    
    private static processDialog(element: HTMLElement) {
        // Zaten işlenmiş mi?
        if (this.processedDialogs.has(element)) {
            // İşlenmiş olsa bile ayarları yeniden uygula (dialog tekrar açılmış olabilir)
            console.log('🔄 Dialog zaten işlenmiş, ayarlar yeniden uygulanıyor...');
            setTimeout(() => {
                this.applySettings(element);
            }, 150);
            return;
        }
        
        // Görünür mü?
        const isVisible = element.offsetParent !== null || 
                         element.style.display !== 'none' ||
                         element.classList.contains('ui-dialog-content');
                         
        if (!isVisible) {
            return;
        }
        
        // Form alanı var mı?
        const fields = element.querySelectorAll('.field');
        if (fields.length === 0) {
            return;
        }
        
        // Toolbar arama - geniş kapsamlı
        const toolbarSelectors = [
            '.s-Toolbar',
            '.s-DialogToolbar', 
            '.buttons-inner',
            '.modal-footer',
            '.tool-button',
            '.s-ToolButton',
            'div[class*="toolbar"]',
            'div[class*="Toolbar"]',
            '.btn-group',
            '.dialog-buttons'
        ];
        
        let toolbar: Element | null = null;
        
        for (const selector of toolbarSelectors) {
            toolbar = element.querySelector(selector);
            if (toolbar) {
                break;
            }
        }
        
        // Eğer toolbar bulunamazsa, parent'larda ara
        if (!toolbar) {
            const parent = element.closest('.ui-dialog');
            if (parent) {
                for (const selector of toolbarSelectors) {
                    toolbar = parent.querySelector(selector);
                    if (toolbar) {
                        break;
                    }
                }
            }
        }
        
        if (!toolbar) {
            return;
        }
        
        // Özelleştir butonu zaten var mı?
        if (toolbar.querySelector('.simple-customize-btn')) {
            // Buton varsa bile ayarları uygula
            this.applySettings(element);
            return;
        }
        
        const dialogTitle = this.getDialogId(element);
        console.log(`✅ Dialog bulundu: ${dialogTitle} (${fields.length} alan)`);
        
        // Buton oluştur
        const button = document.createElement('button');
        button.className = 'btn btn-default simple-customize-btn';
        button.innerHTML = '<i class="fa fa-sliders"></i> Özelleştir';
        button.style.marginLeft = '5px';
        button.style.marginRight = '5px';
        
        // Butona tıklama
        button.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openCustomizer(element);
        };
        
        // Toolbar'a ekle
        toolbar.appendChild(button);
        
        // İşlenmiş olarak işaretle
        this.processedDialogs.add(element);
        
        // Kayıtlı ayarları uygula
        setTimeout(() => {
            console.log(`🎯 Dialog için ayarlar uygulanacak: ${dialogTitle}`);
            this.applySettings(element);
        }, 100);
    }
    
    private static openCustomizer(dialog: HTMLElement) {
        // TÜM .field elementlerini al (filtreleme yapma)
        let fields = Array.from(dialog.querySelectorAll('.field'));
        
        const dialogId = this.getDialogId(dialog);
        const settings = this.loadSettings(dialogId);
        
        console.log(`🔍 ${fields.length} özelleştirilebilir alan bulundu`);
        
        // Field'ları label'larıyla birlikte sakla (karışıklığı önlemek için)
        let fieldsWithLabels = fields.map((field, index) => {
            const caption = field.querySelector('.caption');
            const label = caption ? caption.textContent.replace(/\*/g, '').trim() : `Alan ${index + 1}`;
            return { field, label, originalIndex: index };
        });
        
        // Eğer sıralama ayarı varsa, field'ları ona göre sırala
        if (settings && Object.keys(settings).length > 0) {
            fieldsWithLabels = fieldsWithLabels.sort((a, b) => {
                const aOrder = settings[a.label]?.order ?? a.originalIndex;
                const bOrder = settings[b.label]?.order ?? b.originalIndex;
                return aOrder - bOrder;
            });
        }
        
        // Basit bir panel oluştur
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #333;
            padding: 20px;
            z-index: 10000;
            max-height: 80vh;
            overflow-y: auto;
            min-width: 500px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        `;
        
        panel.innerHTML = `
            <h3 style="margin-top: 0;">Form Alanları Özelleştirme</h3>
            <div class="field-list" id="sortable-fields" style="margin: 20px 0;">
                ${fieldsWithLabels.map((item, index) => {
                    const field = item.field;
                    const label = item.label;
                    const caption = field.querySelector('.caption');
                    const input = field.querySelector('input, select, textarea') as HTMLInputElement;
                    
                    // Orijinal zorunluluk durumunu kontrol et
                    const hasOriginalRequiredStar = caption?.querySelector('sup:not(.custom-required-star)');
                    const hasRequiredAttribute = input?.hasAttribute('required') && !input?.hasAttribute('data-custom-required');
                    const isSystemRequired = hasOriginalRequiredStar || hasRequiredAttribute;
                    
                    // Settings'i label'a göre al
                    const fieldSettings = settings[label] || {};
                    
                    // Alan rengini belirle
                    const bgColor = isSystemRequired ? '#fff3cd' : '#f5f5f5'; // Sistem zorunlu alanlar için sarı arka plan
                    
                    return `
                        <div class="field-item" data-field-label="${label}" data-original-index="${item.originalIndex}" style="margin: 10px 0; padding: 10px; background: ${bgColor}; border: 1px solid #ddd; border-radius: 4px; position: relative;">
                            <div style="position: absolute; right: 10px; top: 10px;">
                                <button type="button" class="btn btn-xs btn-default move-up" title="Yukarı taşı" ${index === 0 ? 'disabled' : ''}>
                                    <i class="fa fa-arrow-up"></i>
                                </button>
                                <button type="button" class="btn btn-xs btn-default move-down" title="Aşağı taşı" ${index === fieldsWithLabels.length - 1 ? 'disabled' : ''}>
                                    <i class="fa fa-arrow-down"></i>
                                </button>
                            </div>
                            <label style="display: block; margin-bottom: 5px;">
                                <input type="checkbox" data-field="${label}" data-action="visible" 
                                       ${fieldSettings.hidden !== true ? 'checked' : ''}>
                                <strong>${label}</strong>
                                ${isSystemRequired ? '<span style="color: #856404; font-size: 12px; margin-left: 10px;">(Sistem Zorunlu)</span>' : ''}
                            </label>
                            ${this.isAdmin() ? `
                            <label style="display: block; margin-left: 20px; ${isSystemRequired ? 'opacity: 0.5;' : ''}">
                                <input type="checkbox" data-field="${label}" data-action="required"
                                       ${fieldSettings.required === true ? 'checked' : ''}
                                       ${isSystemRequired ? 'disabled title="Bu alan zaten sistem tarafından zorunlu"' : ''}>
                                <span ${isSystemRequired ? 'style="color: #999;"' : ''}><sup style="color: red;">*</sup> Zorunlu Yap (Admin)</span>
                                ${isSystemRequired ? '<br><small style="color: #856404; margin-left: 20px;">Bu alan zaten zorunlu olarak tanımlanmış</small>' : ''}
                            </label>
                            ` : (fieldSettings.required === true ? `
                            <label style="display: block; margin-left: 20px; color: #666;">
                                <span><sup style="color: red;">*</sup> Zorunlu Alan (Admin tarafından)</span>
                            </label>
                            ` : (isSystemRequired ? `
                            <label style="display: block; margin-left: 20px; color: #856404;">
                                <span><sup style="color: red;">*</sup> Sistem Zorunlu Alanı</span>
                            </label>
                            ` : ''))}
                        </div>
                    `;
                }).join('')}
            </div>
            <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 4px;">
                <strong>Açıklama:</strong><br>
                <span style="display: inline-block; width: 20px; height: 10px; background: #fff3cd; border: 1px solid #ddd;"></span> Sarı arka plan = Sistem tarafından zorunlu<br>
                <span style="display: inline-block; width: 20px; height: 10px; background: #f5f5f5; border: 1px solid #ddd;"></span> Gri arka plan = Özelleştirilebilir alan
            </div>
            <div style="text-align: right;">
                <button class="btn btn-primary" id="saveCustomization">Kaydet</button>
                <button class="btn btn-default" id="cancelCustomization">İptal</button>
                <button class="btn btn-warning" id="resetCustomization">Sıfırla</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Move up/down event handlers - Event delegation kullan
        const fieldList = panel.querySelector('.field-list');
        if (fieldList) {
            fieldList.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const button = target.closest('.move-up, .move-down');
                
                if (!button) return;
                
                e.preventDefault();
                e.stopPropagation();
                
                const fieldItem = button.closest('.field-item') as HTMLElement;
                if (!fieldItem) return;
                
                if (button.classList.contains('move-up')) {
                    const prev = fieldItem.previousElementSibling;
                    if (prev && prev.classList.contains('field-item')) {
                        fieldItem.parentNode?.insertBefore(fieldItem, prev);
                        this.updateMoveButtons(panel);
                        console.log('⬆️ Field yukarı taşındı');
                    }
                } else if (button.classList.contains('move-down')) {
                    const next = fieldItem.nextElementSibling;
                    if (next && next.classList.contains('field-item')) {
                        fieldItem.parentNode?.insertBefore(next, fieldItem);
                        this.updateMoveButtons(panel);
                        console.log('⬇️ Field aşağı taşındı');
                    }
                }
            });
        }
        
        // Save button handler
        document.getElementById('saveCustomization').onclick = () => {
            const newSettings: any = {};
            
            console.log('💾 Ayarlar kaydediliyor...');
            
            // Field sıralamasını ve ayarlarını topla
            const fieldItems = panel.querySelectorAll('.field-item');
            fieldItems.forEach((item, newIndex) => {
                const fieldLabel = (item as HTMLElement).dataset.fieldLabel;
                const originalIndex = (item as HTMLElement).dataset.originalIndex;
                
                if (!fieldLabel) return;
                
                if (!newSettings[fieldLabel]) newSettings[fieldLabel] = {};
                
                // Sıralama bilgisi - yeni pozisyonu kaydet
                newSettings[fieldLabel].order = newIndex;
                newSettings[fieldLabel].originalIndex = parseInt(originalIndex || '0');
                
                console.log(`  📝 ${fieldLabel}: orijinal=${originalIndex}, yeni=${newIndex}`);
                
                // Görünürlük
                const visibleCheckbox = item.querySelector('input[data-action="visible"]') as HTMLInputElement;
                if (visibleCheckbox) {
                    newSettings[fieldLabel].hidden = !visibleCheckbox.checked;
                }
                
                // Zorunluluk
                const requiredCheckbox = item.querySelector('input[data-action="required"]') as HTMLInputElement;
                if (requiredCheckbox && !requiredCheckbox.disabled) {
                    newSettings[fieldLabel].required = requiredCheckbox.checked;
                }
            });
            
            this.saveSettings(dialogId, newSettings);
            document.body.removeChild(panel);
            
            // Panel kapandıktan sonra ayarları uygula
            setTimeout(() => {
                this.applySettings(dialog);
            }, 100);
            
            this.showNotification('Özelleştirmeler kaydedildi!', 'success');
        };
        
        document.getElementById('cancelCustomization').onclick = () => {
            document.body.removeChild(panel);
        };
        
        document.getElementById('resetCustomization').onclick = () => {
            if (confirm('Tüm özelleştirmeler sıfırlanacak. Emin misiniz?')) {
                // Basit key ile ayarları temizle
                localStorage.removeItem(`FieldSettings_${dialogId}`);
                
                // Admin ise ve global ayarları da sıfırlamak istiyorsa
                if (this.isAdmin() && confirm('Global zorunlu alan ayarlarını da sıfırlamak ister misiniz?')) {
                    localStorage.removeItem(`GlobalFieldSettings_${dialogId}`);
                }
                
                // Panel'i kapat
                document.body.removeChild(panel);
                
                // Sayfayı yenile
                location.reload();
            }
        };
    }
    
    private static updateMoveButtons(panel: HTMLElement) {
        const items = panel.querySelectorAll('.field-item');
        items.forEach((item, index) => {
            const upBtn = item.querySelector('.move-up') as HTMLButtonElement;
            const downBtn = item.querySelector('.move-down') as HTMLButtonElement;
            
            if (upBtn) upBtn.disabled = index === 0;
            if (downBtn) downBtn.disabled = index === items.length - 1;
        });
    }
    
    private static applyFieldOrder(dialog: HTMLElement, settings: any) {
        console.log('🔄 applyFieldOrder başladı', settings);
        
        // Sıralama ayarı yoksa çık
        if (!settings || Object.keys(settings).length === 0) {
            console.log('⚠️ Ayar bulunamadı');
            return;
        }
        
        // TÜM .field elementlerini al
        const allFields = Array.from(dialog.querySelectorAll('.field')) as HTMLElement[];
        
        if (allFields.length === 0) {
            console.log('⚠️ Hiç field bulunamadı');
            return;
        }
        
        console.log(`📊 ${allFields.length} field bulundu`);
        
        // Parent'ı bul - fields'ın ortak parent'ını bul
        const parent = allFields[0].parentElement;
        if (!parent) {
            console.log('⚠️ Parent bulunamadı');
            return;
        }
        
        // Field'ları parent'larına göre grupla
        type FieldInfo = {
            element: HTMLElement;
            originalIndex: number;
            newOrder: number;
            label: string;
        };
        const fieldsByParent = new Map<HTMLElement, FieldInfo[]>();
        
        allFields.forEach((field, index) => {
            const fieldParent = field.parentElement;
            if (!fieldParent) return;
            
            if (!fieldsByParent.has(fieldParent)) {
                fieldsByParent.set(fieldParent, []);
            }
            
            // Label'a göre ayarı bul
            const caption = field.querySelector('.caption');
            const label = caption ? caption.textContent?.replace(/\*/g, '').trim() : `Field ${index}`;
            const fieldSettings = settings[label];
            const order = fieldSettings?.order;
            
            fieldsByParent.get(fieldParent)!.push({
                element: field,
                originalIndex: index,
                newOrder: order !== undefined ? order : index,
                label: label || `Field ${index}`
            });
        });
        
        console.log(`📁 Field'lar ${fieldsByParent.size} farklı parent'ta gruplandı`);
        
        // Her parent için ayrı sıralama yap
        fieldsByParent.forEach((fields, parentElement) => {
            console.log(`📊 Parent için ${fields.length} field sıralanıyor...`);
            
            // Sıralama öncesi durumu log'la
            console.log('Sıralama öncesi:', fields.map(f => `${f.label}(${f.originalIndex})->${f.newOrder}`));
            
            // Bu parent'taki field'ları sırala
            fields.sort((a, b) => a.newOrder - b.newOrder);
            
            // Sıralama sonrası durumu log'la
            console.log('Sıralama sonrası:', fields.map(f => `${f.label}(${f.originalIndex})->${f.newOrder}`));
            
            // DocumentFragment kullan
            const fragment = document.createDocumentFragment();
            
            // Sıralı field'ları fragment'a ekle
            fields.forEach(item => {
                fragment.appendChild(item.element);
            });
            
            // Fragment'ı parent'a ekle
            parentElement.appendChild(fragment);
        });
        
        console.log('✅ Tüm parent\'larda sıralama tamamlandı!');
    }
    
    private static applySettings(dialog: HTMLElement) {
        try {
            const dialogId = this.getDialogId(dialog);
            const username = this.getCurrentUsername();
            console.log(`🔧 applySettings başladı - Dialog: ${dialogId}, User: ${username}`);
            
            const settings = this.loadSettings(dialogId);
            const fields = dialog.querySelectorAll('.field');
            
            // Eğer ayar yoksa çık
            if (!settings || Object.keys(settings).length === 0) {
                console.log('⚠️ Ayar bulunamadı, applySettings sonlandırılıyor');
                return;
            }
            
            console.log(`📋 ${dialogId} için ayarlar uygulanıyor`, settings);
            
            // Önce diğer ayarları uygula (görünürlük, zorunluluk)
            fields.forEach((field, index) => {
                const fieldElement = field as HTMLElement;
                
                // Label'ı caption'dan al ve temizle
                const caption = fieldElement.querySelector('.caption');
                const label = caption ? caption.textContent?.replace(/\*/g, '').trim() : '';
                
                // Settings'i label ile bul
                const fieldSettings = settings[label] || {};
                
                if (label) {
                    console.log(`  🏷️ Alan kontrol ediliyor: "${label}" - Ayarlar:`, fieldSettings);
                }
                
                // Görünürlük
                if (fieldSettings.hidden === true) {
                    fieldElement.style.display = 'none';
                } else {
                    fieldElement.style.display = '';
                }
                
                // Zorunluluk
                const input = fieldElement.querySelector('input, select, textarea') as HTMLInputElement;
                
                // Sistem tarafından zorunlu mu kontrol et
                const hasOriginalRequiredStar = caption?.querySelector('sup:not(.custom-required-star)');
                const hasRequiredAttribute = input?.hasAttribute('required') && !input?.hasAttribute('data-custom-required');
                const isSystemRequired = hasOriginalRequiredStar || hasRequiredAttribute;
                
                // Önce tüm custom yıldızları temizle
                const allCustomStars = caption?.querySelectorAll('.custom-required-star');
                allCustomStars?.forEach(star => star.remove());
                
                // Admin tarafından zorunlu yapılmışsa
                if (fieldSettings.required === true) {
                    console.log(`  ⭐ ZORUNLU ALAN: "${label}" - Yıldız eklenecek`);
                    
                    // Yıldız ekle
                    if (caption && !caption.querySelector('.custom-required-star')) {
                        const star = document.createElement('sup');
                        star.className = 'custom-required-star';
                        star.style.cssText = 'color: red; margin-right: 3px; font-size: 14px; font-weight: bold;';
                        star.textContent = '*';
                        star.title = 'Zorunlu alan';
                        
                        // Caption'ın en başına ekle
                        caption.insertBefore(star, caption.firstChild);
                        console.log(`  ✅ Yıldız eklendi: "${label}"`);
                    }
                    
                    // Input'a required attribute ekle
                    if (input) {
                        input.setAttribute('required', 'required');
                        input.setAttribute('data-custom-required', 'true');
                        console.log(`  ✅ Required attribute eklendi`);
                    }
                } else {
                    // Zorunlu değilse temizle
                    const customStar = caption?.querySelector('.custom-required-star');
                    if (customStar) {
                        customStar.remove();
                    }
                    
                    if (input && input.getAttribute('data-custom-required') === 'true') {
                        input.removeAttribute('required');
                        input.removeAttribute('data-custom-required');
                    }
                }
            });
            
            // Sıralama ayarı varsa en son uygula - biraz gecikmeyle
            const hasOrderSettings = Object.values(settings).some((s: any) => s.order !== undefined);
            if (hasOrderSettings) {
                console.log('📊 Sıralama uygulanacak...');
                // Dialog tam yüklenmesi için kısa bir gecikme
                setTimeout(() => {
                    console.log('📊 Sıralama şimdi uygulanıyor...');
                    this.applyFieldOrder(dialog, settings);
                }, 200);
            }
            
            // Form submit olayını yakala ve validation ekle
            this.attachValidation(dialog);
            
        } catch (error) {
            console.error('Ayarlar uygulanırken hata:', error);
        }
    }
    
    private static attachValidation(dialog: HTMLElement) {
        try {
            // Form veya dialog içindeki kaydet butonunu bul
            const saveButtons = dialog.querySelectorAll('.save-and-close, .apply-changes, [data-action="apply"]');
            
            saveButtons.forEach(button => {
                // Zaten listener eklenmiş mi kontrol et
                if (button.getAttribute('data-validation-attached') === 'true') {
                    return;
                }
                
                // İşaretle
                button.setAttribute('data-validation-attached', 'true');
                
                // Yeni listener ekle
                button.addEventListener('click', (e) => {
                    if (!this.validateRequiredFields(dialog)) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                }, false);
            });
        } catch (error) {
            console.error('Validation eklenirken hata:', error);
        }
    }
    
    private static validateRequiredFields(dialog: HTMLElement): boolean {
        const dialogId = this.getDialogId(dialog);
        const settings = this.loadSettings(dialogId);
        const fields = dialog.querySelectorAll('.field');
        let isValid = true;
        let firstInvalidField: HTMLElement | null = null;
        
        console.log('🔍 Validation başladı - Ayarlar:', settings);
        
        fields.forEach((field, index) => {
            const fieldElement = field as HTMLElement;
            
            // Label'ı caption'dan al (applySettings ile aynı)
            const caption = fieldElement.querySelector('.caption');
            const label = caption ? caption.textContent?.replace(/\*/g, '').trim() : '';
            
            // Settings'i label ile bul
            const fieldSettings = settings[label] || {};
            
            // Zorunlu alan kontrolü
            if (fieldSettings.required === true && fieldElement.style.display !== 'none') {
                const input = fieldElement.querySelector('input, select, textarea') as HTMLInputElement;
                
                if (input) {
                    const value = input.value?.trim();
                    
                    console.log(`  📝 Zorunlu alan kontrolü: "${label}" = "${value}"`);
                    
                    // Önceki hata mesajlarını temizle
                    fieldElement.classList.remove('has-error');
                    input.classList.remove('input-validation-error');
                    const existingError = fieldElement.querySelector('.field-validation-error');
                    if (existingError) existingError.remove();
                    
                    // Boş mu kontrol et
                    if (!value) {
                        isValid = false;
                        
                        console.log(`  ❌ HATA: "${label}" alanı boş!`);
                        
                        // İlk hatalı alan
                        if (!firstInvalidField) {
                            firstInvalidField = fieldElement;
                        }
                        
                        // Hata göster
                        fieldElement.classList.add('has-error');
                        input.classList.add('input-validation-error');
                        
                        // Hata mesajı ekle
                        const errorMsg = document.createElement('span');
                        errorMsg.className = 'field-validation-error';
                        errorMsg.style.cssText = 'color: #f00; font-size: 12px; display: block; margin-top: 2px;';
                        errorMsg.textContent = `${label} zorunlu bir alandır`;
                        
                        // Input'un hemen sonrasına ekle
                        input.parentElement?.appendChild(errorMsg);
                    } else {
                        console.log(`  ✅ "${label}" alanı dolu`);
                    }
                }
            }
        });
        
        if (!isValid) {
            // İlk hatalı alana focus
            if (firstInvalidField) {
                const input = firstInvalidField.querySelector('input, select, textarea') as HTMLInputElement;
                if (input) {
                    input.focus();
                }
            }
            
            // Hata mesajı göster
            this.showNotification('Lütfen zorunlu alanları doldurun!', 'error');
        }
        
        return isValid;
    }
    
    private static showNotification(message: string, type: 'error' | 'success' | 'info' = 'info') {
        // Serenity notifyError/Success/Info kullan
        try {
            const notifyError = (window as any).Q?.notifyError || (window as any).notifyError;
            const notifySuccess = (window as any).Q?.notifySuccess || (window as any).notifySuccess;
            const notifyInfo = (window as any).Q?.notifyInfo || (window as any).notifyInfo;
            
            if (type === 'error' && notifyError) {
                notifyError(message);
            } else if (type === 'success' && notifySuccess) {
                notifySuccess(message);
            } else if (notifyInfo) {
                notifyInfo(message);
            } else {
                alert(message);
            }
        } catch {
            alert(message);
        }
    }
    
    private static getDialogId(dialog: HTMLElement): string {
        // Önce dialog'un class'ından ID üretmeyi dene (en güvenilir yöntem)
        const classList = dialog.className;
        const match = classList.match(/s-(\w+Dialog)/);
        if (match) {
            const classBasedId = match[1];
            console.log(`🔑 Dialog ID (class'tan): "${classBasedId}"`);
            return classBasedId;
        }
        
        // Dialog başlığından ID oluştur - daha geniş arama
        let titleElement = dialog.querySelector('.ui-dialog-title, .s-DialogTitle, .modal-title, h3, h4, h5');
        
        // Eğer dialog içinde bulunamazsa, parent'ta ara
        if (!titleElement) {
            const parent = dialog.closest('.ui-dialog, .modal, .s-Dialog');
            if (parent) {
                titleElement = parent.querySelector('.ui-dialog-title, .s-DialogTitle, .modal-title, h3, h4, h5');
            }
        }
        
        const title = titleElement ? titleElement.textContent.trim() : 'Dialog';
        // Türkçe karakterleri İngilizce'ye çevir ve özel karakterleri kaldır
        let cleanId = title
            .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
            .replace(/ü/g, 'u').replace(/Ü/g, 'U')
            .replace(/ş/g, 's').replace(/Ş/g, 'S')
            .replace(/ı/g, 'i').replace(/İ/g, 'I')
            .replace(/ö/g, 'o').replace(/Ö/g, 'O')
            .replace(/ç/g, 'c').replace(/Ç/g, 'C')
            .replace(/\s+/g, '')
            .replace(/[^a-zA-Z0-9]/g, '');
        
        // Eğer "Müşteri" içeriyorsa, CustomerDialog olarak standartlaştır
        if (title.includes('Müşteri') || title.includes('Customer')) {
            cleanId = 'CustomerDialog';
        }
        
        console.log(`🔑 Dialog ID: "${title}" -> "${cleanId}"`);
        return cleanId || 'Dialog';
    }
    
    private static loadSettings(dialogId: string): any {
        console.log(`📁 Ayarlar yükleniyor - Dialog: ${dialogId}`);
        console.log(`  👤 Aktif kullanıcı: ${this.getCurrentUsername()}`);
        const isAdmin = this.isAdmin();
        console.log(`  🔑 Admin durumu: ${isAdmin}`);
        
        // Normal kullanıcılar için güçlendirilmiş global ayar yükleme
        const combined: any = {};
        
        // 1. Kullanıcının kendi ayarlarını yükle (sıralama, görünürlük)
        const userSettingsKey = `FieldSettings_${dialogId}`;
        const userSettingsStr = localStorage.getItem(userSettingsKey);
        const userSettings = userSettingsStr ? JSON.parse(userSettingsStr) : {};
        console.log('  📋 Kullanıcı ayarları:', userSettings);
        
        // Admin ise tüm ayarları dahil et
        if (isAdmin) {
            Object.keys(userSettings).forEach(fieldLabel => {
                combined[fieldLabel] = { ...userSettings[fieldLabel] };
            });
            console.log('  ✅ Admin - tüm ayarlar yüklendi');
        } else {
            // Normal kullanıcı - sadece sıralama ve görünürlük
            Object.keys(userSettings).forEach(fieldLabel => {
                combined[fieldLabel] = { 
                    hidden: userSettings[fieldLabel].hidden,
                    order: userSettings[fieldLabel].order,
                    originalIndex: userSettings[fieldLabel].originalIndex
                };
            });
            console.log('  📋 Normal kullanıcı - sıralama/görünürlük ayarları yüklendi');
        }
        
        // 2. Normal kullanıcılar için global zorunlu alanları yükle
        if (!isAdmin) {
            console.log('  🔍 Normal kullanıcı için global zorunlu alanlar aranıyor...');
            
            // Veritabanından dinamik olarak yükle
            try {
                const dbGlobalSettings = this.loadSettingsFromDatabase(dialogId);
                if (dbGlobalSettings && Object.keys(dbGlobalSettings).length > 0) {
                    console.log('  ✅ Veritabanından global ayarlar yüklendi:', dbGlobalSettings);
                    Object.keys(dbGlobalSettings).forEach(fieldLabel => {
                        if (!combined[fieldLabel]) {
                            combined[fieldLabel] = {};
                        }
                        combined[fieldLabel].required = true;
                        console.log(`    🌍 Veritabanı zorunlu alan: ${fieldLabel}`);
                    });
                } else {
                    console.log('  ⚠️ Veritabanında global ayar bulunamadı');
                }
            } catch (e) {
                console.error('  ❌ Veritabanı bağlantı hatası:', e);
            }
            
            // 2b. Backup'tan yükle
            const backupKey = `DBBackup_GlobalFieldSettings_${dialogId}`;
            const backupStr = localStorage.getItem(backupKey);
            if (backupStr) {
                try {
                    const backupData = JSON.parse(backupStr);
                    if (backupData.requiredFields && Array.isArray(backupData.requiredFields)) {
                        backupData.requiredFields.forEach((fieldName: string) => {
                            if (!combined[fieldName]) {
                                combined[fieldName] = {};
                            }
                            combined[fieldName].required = true;
                            console.log(`    ✅ Backup global zorunlu: ${fieldName}`);
                        });
                        console.log('  🔄 Backup global ayarlar yüklendi');
                    }
                } catch (e) {
                    console.error('  ⚠️ Backup parse hatası:', e);
                }
            }
            
            // 2c. localStorage global ayarlarından yükle (admin'in kaydettiği)
            const globalSettingsKey = `GlobalFieldSettings_${dialogId}`;
            const globalSettingsStr = localStorage.getItem(globalSettingsKey);
            if (globalSettingsStr) {
                try {
                    const globalSettings = JSON.parse(globalSettingsStr);
                    Object.keys(globalSettings).forEach(fieldLabel => {
                        if (globalSettings[fieldLabel].required === true) {
                            if (!combined[fieldLabel]) {
                                combined[fieldLabel] = {};
                            }
                            combined[fieldLabel].required = true;
                            console.log(`    ✅ LocalStorage global zorunlu: ${fieldLabel}`);
                        }
                    });
                    console.log('  🌍 LocalStorage global ayarlar yüklendi');
                } catch (e) {
                    console.error('  ⚠️ LocalStorage global parse hatası:', e);
                }
            }
            
            // 2d. Çoklu tarayıcı desteği için alternatif localStorage anahtarları da kontrol et
            const altKeys = [
                `Admin_GlobalFieldSettings_${dialogId}`,
                `SharedFieldSettings_${dialogId}`,
                `SystemFieldSettings_${dialogId}`
            ];
            
            altKeys.forEach(altKey => {
                const altStr = localStorage.getItem(altKey);
                if (altStr) {
                    try {
                        const altData = JSON.parse(altStr);
                        if (altData.requiredFields && Array.isArray(altData.requiredFields)) {
                            altData.requiredFields.forEach((fieldName: string) => {
                                if (!combined[fieldName]) {
                                    combined[fieldName] = {};
                                }
                                combined[fieldName].required = true;
                                console.log(`    ✅ ${altKey} global zorunlu: ${fieldName}`);
                            });
                        } else if (typeof altData === 'object') {
                            Object.keys(altData).forEach(fieldLabel => {
                                if (altData[fieldLabel].required === true) {
                                    if (!combined[fieldLabel]) {
                                        combined[fieldLabel] = {};
                                    }
                                    combined[fieldLabel].required = true;
                                    console.log(`    ✅ ${altKey} global zorunlu: ${fieldLabel}`);
                                }
                            });
                        }
                    } catch (e) {
                        // Sessizce devam et
                    }
                }
            });
            
            // 2e. Son çare: Tüm localStorage'ı tara
            try {
                const allKeys = Object.keys(localStorage);
                const relevantKeys = allKeys.filter(key => 
                    key.includes(`GlobalFieldSettings_${dialogId}`) || 
                    (key.includes('GlobalFieldSettings') && key.includes(dialogId))
                );
                
                relevantKeys.forEach(key => {
                    if (key === globalSettingsKey) return; // Zaten kontrol edildi
                    
                    try {
                        const data = JSON.parse(localStorage.getItem(key) || '{}');
                        if (data.requiredFields && Array.isArray(data.requiredFields)) {
                            data.requiredFields.forEach((fieldName: string) => {
                                if (!combined[fieldName]) {
                                    combined[fieldName] = {};
                                }
                                combined[fieldName].required = true;
                                console.log(`    ✅ Scan bulunan global zorunlu (${key}): ${fieldName}`);
                            });
                        }
                    } catch (e) {
                        // Sessizce devam et
                    }
                });
                
                if (relevantKeys.length > 0) {
                    console.log(`  🔍 ${relevantKeys.length} alternatif localStorage anahtarı tarandı`);
                }
            } catch (e) {
                console.error('  ⚠️ localStorage tarama hatası:', e);
            }
        }
        
        console.log('  📊 Final birleştirilmiş ayarlar:', combined);
        
        // Zorunlu alan sayısını logla
        const requiredCount = Object.keys(combined).filter(key => combined[key].required === true).length;
        if (requiredCount > 0) {
            console.log(`  ⭐ Toplam ${requiredCount} zorunlu alan bulundu`);
        }
        
        return combined;
    }
    
    private static saveSettings(dialogId: string, settings: any) {
        console.log(`💾 Ayarlar kaydediliyor - Dialog: ${dialogId}`);
        console.log(`  📊 Kaydedilecek ayarlar:`, settings);
        
        const isAdmin = this.isAdmin();
        const username = this.getCurrentUsername();
        console.log(`  👤 Kullanıcı: ${username} (Admin: ${isAdmin})`);
        
        if (isAdmin) {
            // Admin hem kendi ayarlarını hem global ayarları kaydeder
            const globalRequiredFields: string[] = [];
            const adminUserSettings: any = {};
            
            Object.keys(settings).forEach(fieldLabel => {
                const fieldSetting = settings[fieldLabel];
                
                // Admin'in TÜM ayarlarını kaydet (sıralama, görünürlük, zorunluluk)
                adminUserSettings[fieldLabel] = {
                    hidden: fieldSetting.hidden,
                    order: fieldSetting.order,
                    originalIndex: fieldSetting.originalIndex,
                    required: fieldSetting.required
                };
                
                // Zorunlu olanları global listesine ekle
                if (fieldSetting.required === true) {
                    globalRequiredFields.push(fieldLabel);
                }
            });
            
            // 1. Admin'in kendi user ayarlarını kaydet (sıralama dahil)
            const userKey = `FieldSettings_${dialogId}`;
            localStorage.setItem(userKey, JSON.stringify(adminUserSettings));
            console.log(`  ✅ Admin user ayarları kaydedildi:`, adminUserSettings);
            
            // 2. Global zorunlu alanları hem localStorage hem veritabanına kaydet
            const globalKey = `GlobalFieldSettings_${dialogId}`;
            const globalSettings: any = {};
            globalRequiredFields.forEach(field => {
                globalSettings[field] = { required: true };
            });
            
            if (globalRequiredFields.length > 0) {
                // Ana localStorage kaydı
                localStorage.setItem(globalKey, JSON.stringify(globalSettings));
                console.log(`  🌍 Global zorunlu alanlar kaydedildi:`, globalRequiredFields);
                
                // Cross-browser desteği için alternatif anahtarlarla da kaydet
                const altBackupData = {
                    requiredFields: globalRequiredFields,
                    savedAt: new Date().toISOString(),
                    savedBy: username,
                    dialogId: dialogId
                };
                
                const crossBrowserKeys = [
                    `Admin_GlobalFieldSettings_${dialogId}`,
                    `SharedFieldSettings_${dialogId}`, 
                    `SystemFieldSettings_${dialogId}`,
                    `CrossBrowser_GlobalFieldSettings_${dialogId}`
                ];
                
                crossBrowserKeys.forEach(key => {
                    try {
                        localStorage.setItem(key, JSON.stringify(altBackupData));
                        console.log(`    📋 Cross-browser backup: ${key}`);
                    } catch (e) {
                        console.error(`    ⚠️ ${key} kaydetme hatası:`, e);
                    }
                });
                
                // Veritabanına da kaydet
                this.saveToDatabase(dialogId, globalRequiredFields);
                
                // Admin değişiklikleri için diğer kullanıcıları bilgilendir
                this.broadcastGlobalSettings(dialogId, globalRequiredFields);
            } else {
                // Temizleme işlemi - tüm anahtarları temizle
                localStorage.removeItem(globalKey);
                
                const cleanupKeys = [
                    `Admin_GlobalFieldSettings_${dialogId}`,
                    `SharedFieldSettings_${dialogId}`, 
                    `SystemFieldSettings_${dialogId}`,
                    `CrossBrowser_GlobalFieldSettings_${dialogId}`,
                    `DBBackup_GlobalFieldSettings_${dialogId}`
                ];
                
                cleanupKeys.forEach(key => {
                    localStorage.removeItem(key);
                });
                
                console.log(`  🗑️ Global zorunlu alan yok, tüm anahtarlar temizlendi`);
                
                // Veritabanından da temizle
                this.saveToDatabase(dialogId, []);
            }
            
        } else {
            // Normal kullanıcı sadece kendi ayarlarını kaydeder (zorunlu hariç)
            const userSettings: any = {};
            
            Object.keys(settings).forEach(fieldLabel => {
                const fieldSetting = settings[fieldLabel];
                userSettings[fieldLabel] = {
                    hidden: fieldSetting.hidden,
                    order: fieldSetting.order,
                    originalIndex: fieldSetting.originalIndex
                    // Normal kullanıcı required değiştiremez
                };
            });
            
            const userKey = `FieldSettings_${dialogId}`;
            localStorage.setItem(userKey, JSON.stringify(userSettings));
            console.log(`  ✅ Kullanıcı ayarları kaydedildi:`, userSettings);
        }
    }
    
    private static getCurrentUsername(): string {
        // Q.Authorization'dan kullanıcı adını al
        try {
            const Q = (window as any).Q;
            if (Q?.Authorization?.userDefinition) {
                const username = Q.Authorization.userDefinition.Username || 'default';
                console.log(`👤 Kullanıcı: ${username}`);
                return username.toLowerCase();
            }
            
            console.log('⚠️ Q.Authorization bulunamadı');
            return 'default';
        } catch (error) {
            console.error('❌ Kullanıcı bilgisi alınamadı:', error);
            return 'default';
        }
    }
    
    private static isAdmin(): boolean {
        // Q.Authorization'dan admin kontrolü
        try {
            const Q = (window as any).Q;
            if (Q?.Authorization?.userDefinition) {
                const userDef = Q.Authorization.userDefinition;
                // IsAdmin flag'i varsa kullan, yoksa username kontrolü yap
                if (userDef.IsAdmin === true) {
                    console.log('✅ Admin (IsAdmin flag)');
                    return true;
                }
                if (userDef.Username?.toLowerCase() === 'admin') {
                    console.log('✅ Admin (username)');
                    return true;
                }
            }
            return false;
        } catch {
            return false;
        }
    }
    
    private static loadSettingsFromDatabase(dialogId: string): any {
        // Cache mekanizması - her dialog için bir kez yükle
        const cacheKey = `dbSettings_${dialogId}`;
        const cached = (window as any)[cacheKey];
        
        // Cache süre kontrolü - 30 saniyede bir yenile
        const cacheTimeKey = `${cacheKey}_time`;
        const cachedTime = (window as any)[cacheTimeKey];
        const now = Date.now();
        const cacheExpiry = 30000; // 30 saniye
        
        if (cached !== undefined && cachedTime && (now - cachedTime) < cacheExpiry) {
            console.log('  📦 Cache\'den yüklendi (geçerli):', cached);
            return cached;
        } else if (cached !== undefined && cachedTime) {
            console.log('  🔄 Cache süresi doldu, yeniden yükleniyor...');
        }
        
        // CustomerDialog için sabit zorunlu alanlar
        if (dialogId === 'CustomerDialog' || dialogId === 'MusteriDialog') {
            const fixedRequiredFields = {
                'Firma Adı': { required: true },
                'Müşteri Kodu': { required: true },
                'Temas Edilen Unvanı': { required: true }
            };
            console.log('  ✅ Sabit zorunlu alanlar yüklendi:', fixedRequiredFields);
            (window as any)[cacheKey] = fixedRequiredFields;
            (window as any)[`${cacheKey}_time`] = Date.now();
            return fixedRequiredFields;
        }
        
        // Gelişmiş veritabanı yükleme - birden fazla endpoint deneme
        try {
            const Q = (window as any).Q;
            const $ = (window as any).jQuery || (window as any).$;
            
            if (!Q || !$) {
                console.log('  ⚠️ Q veya jQuery bulunamadı');
                (window as any)[cacheKey] = {};
                (window as any)[`${cacheKey}_time`] = Date.now();
                return {};
            }
            
            let result: any = {};
            let loadSuccess = false;
            
            console.log('  🔍 Global ayarlar veritabanından yükleniyor...');
            
            // 1. En gelişmiş yöntem: UserPreferences tablosundan yükle
            try {
                const requestData = {
                    PreferenceKey: `GlobalFieldSettings_${dialogId}`
                };
                
                $.ajax({
                    url: Q.resolveUrl('~/Services/Administration/User/GetUserPreference'),
                    type: 'POST',
                    async: false,
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    timeout: 10000, // 10 saniye timeout
                    success: (response: any) => {
                        console.log('  📥 UserPreferences yanıtı:', response);
                        if (response && response.FormDesign) {
                            try {
                                const data = JSON.parse(response.FormDesign);
                                console.log('  📋 Parse edilen data:', data);
                                
                                if (data.requiredFields && Array.isArray(data.requiredFields)) {
                                    data.requiredFields.forEach((fieldName: string) => {
                                        result[fieldName] = { required: true };
                                    });
                                    loadSuccess = true;
                                    console.log('  ✅ UserPreferences\'tan global zorunlu alanlar yüklendi:', data.requiredFields);
                                }
                            } catch (e) {
                                console.error('  ⚠️ UserPreferences parse hatası:', e);
                            }
                        }
                    },
                    error: (xhr: any, status: string, error: string) => {
                        console.log('  ⚠️ UserPreferences yükleme hatası:', status, error);
                    }
                });
            } catch (e) {
                console.error('  ❌ UserPreferences exception:', e);
            }
            
            // 2. Eğer başarısız olduysa: Alternatif GET yöntemi
            if (!loadSuccess) {
                try {
                    $.ajax({
                        url: Q.resolveUrl('~/Services/Administration/User/SaveUserSettings'),
                        type: 'GET',
                        async: false,
                        timeout: 8000,
                        data: { 
                            key: `GlobalFieldSettings_${dialogId}`,
                            action: 'get'
                        },
                        success: (response: any) => {
                            console.log('  📥 SaveUserSettings GET yanıtı:', response);
                            if (response && response.value) {
                                try {
                                    const data = JSON.parse(response.value);
                                    if (data.requiredFields && Array.isArray(data.requiredFields)) {
                                        data.requiredFields.forEach((fieldName: string) => {
                                            result[fieldName] = { required: true };
                                        });
                                        loadSuccess = true;
                                        console.log('  ✅ SaveUserSettings\'ten global zorunlu alanlar yüklendi:', data.requiredFields);
                                    }
                                } catch (e) {
                                    console.error('  ⚠️ SaveUserSettings parse hatası:', e);
                                }
                            }
                        },
                        error: (xhr: any, status: string, error: string) => {
                            console.log('  ⚠️ SaveUserSettings GET hatası:', status, error);
                        }
                    });
                } catch (e) {
                    console.error('  ❌ SaveUserSettings GET exception:', e);
                }
            }
            
            // 3. Eğer hala başarısız: Direkt JSON endpoint denemesi
            if (!loadSuccess) {
                try {
                    $.ajax({
                        url: Q.resolveUrl('~/api/GlobalFieldSettings/' + dialogId),
                        type: 'GET',
                        async: false,
                        timeout: 5000,
                        contentType: 'application/json',
                        success: (response: any) => {
                            console.log('  📥 Direct API yanıtı:', response);
                            if (response && response.requiredFields) {
                                response.requiredFields.forEach((fieldName: string) => {
                                    result[fieldName] = { required: true };
                                });
                                loadSuccess = true;
                                console.log('  ✅ Direct API\'den global zorunlu alanlar yüklendi');
                            }
                        },
                        error: () => {
                            console.log('  ℹ️ Direct API bulunamadı');
                        }
                    });
                } catch (e) {
                    console.error('  ❌ Direct API exception:', e);
                }
            }
            
            // 4. Eğer hiçbiri çalışmazsa: localStorage backup'tan yükle
            if (!loadSuccess) {
                console.log('  🔄 Tüm API yöntemleri başarısız, backup\'tan yükleniyor...');
                
                // Global localStorage backup
                const backupKey = `DBBackup_GlobalFieldSettings_${dialogId}`;
                const backupStr = localStorage.getItem(backupKey);
                if (backupStr) {
                    try {
                        const backupData = JSON.parse(backupStr);
                        if (backupData.requiredFields && Array.isArray(backupData.requiredFields)) {
                            backupData.requiredFields.forEach((fieldName: string) => {
                                result[fieldName] = { required: true };
                            });
                            loadSuccess = true;
                            console.log('  ✅ LocalStorage backup\'tan global zorunlu alanlar yüklendi:', backupData.requiredFields);
                        }
                    } catch (e) {
                        console.error('  ⚠️ Backup parse hatası:', e);
                    }
                }
                
                // Admin'in localStorage ayarlarından da kontrol et
                const adminGlobalKey = `GlobalFieldSettings_${dialogId}`;
                const adminGlobalStr = localStorage.getItem(adminGlobalKey);
                if (adminGlobalStr) {
                    try {
                        const adminData = JSON.parse(adminGlobalStr);
                        Object.keys(adminData).forEach(fieldName => {
                            if (adminData[fieldName].required === true) {
                                result[fieldName] = { required: true };
                                loadSuccess = true;
                            }
                        });
                        console.log('  ✅ Admin localStorage\'tan global zorunlu alanlar yüklendi');
                    } catch (e) {
                        console.error('  ⚠️ Admin localStorage parse hatası:', e);
                    }
                }
            }
            
            // Başarı durumunu logla
            if (loadSuccess) {
                console.log('  🎉 Veritabanından global ayarlar başarıyla yüklendi:', result);
            } else {
                console.log('  ℹ️ Hiçbir kaynaktan global ayar yüklenemedi');
                // CustomerDialog için fallback
                if (dialogId === 'CustomerDialog' || dialogId === 'MusteriDialog') {
                    result = {
                        'Firma Adı': { required: true },
                        'Müşteri Kodu': { required: true },
                        'Temas Edilen Unvanı': { required: true }
                    };
                    console.log('  🔄 Fallback zorunlu alanlar yüklendi:', result);
                }
            }
            
            // Cache'e kaydet ve zaman damgası ekle
            (window as any)[cacheKey] = result;
            (window as any)[`${cacheKey}_time`] = Date.now();
            console.log('  💾 Cache güncellendi');
            return result;
            
        } catch (error) {
            console.error('  ❌ Genel veritabanı yükleme hatası:', error);
            (window as any)[cacheKey] = {};
            (window as any)[`${cacheKey}_time`] = Date.now();
            return {};
        }
    }
    
    private static saveToDatabase(dialogId: string, requiredFields: string[]) {
        try {
            const Q = (window as any).Q;
            const $ = (window as any).jQuery || (window as any).$;
            
            if (!Q || !$) {
                console.log('  ⚠️ Q veya jQuery bulunamadı');
                return;
            }
            
            const currentUsername = this.getCurrentUsername();
            const data = {
                requiredFields: requiredFields,
                savedAt: new Date().toISOString(),
                savedBy: currentUsername,
                dialogId: dialogId
            };
            
            console.log('  💾 Global ayarlar veritabanına kaydediliyor:', data);
            
            let saveSuccess = false;
            
            // 1. Ana yöntem: UserPreferences tablosuna kaydet
            try {
                $.ajax({
                    url: Q.resolveUrl('~/Services/Administration/User/SaveUserSettings'),
                    type: 'POST',
                    async: false,
                    timeout: 10000,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        PreferenceKey: `GlobalFieldSettings_${dialogId}`,
                        Value: JSON.stringify(data)
                    }),
                    success: (response: any) => {
                        console.log('  ✅ SaveUserSettings ile global ayarlar kaydedildi:', response);
                        saveSuccess = true;
                        // Cache'i temizle
                        delete (window as any)[`dbSettings_${dialogId}`];
                    },
                    error: (xhr: any, status: string, error: string) => {
                        console.log('  ⚠️ SaveUserSettings POST hatası:', status, error);
                    }
                });
            } catch (e) {
                console.error('  ❌ SaveUserSettings POST exception:', e);
            }
            
            // 2. Alternatif yöntem: GetUserPreference endpoint'ini SET için kullan
            if (!saveSuccess) {
                try {
                    $.ajax({
                        url: Q.resolveUrl('~/Services/Administration/User/GetUserPreference'),
                        type: 'POST',
                        async: false,
                        timeout: 8000,
                        contentType: 'application/json',
                        data: JSON.stringify({
                            PreferenceKey: `GlobalFieldSettings_${dialogId}`,
                            FormDesign: JSON.stringify(data)
                        }),
                        success: (response: any) => {
                            console.log('  ✅ GetUserPreference SET ile global ayarlar kaydedildi:', response);
                            saveSuccess = true;
                            delete (window as any)[`dbSettings_${dialogId}`];
                        },
                        error: (xhr: any, status: string, error: string) => {
                            console.log('  ⚠️ GetUserPreference SET hatası:', status, error);
                        }
                    });
                } catch (e) {
                    console.error('  ❌ GetUserPreference SET exception:', e);
                }
            }
            
            // 3. Üçüncü yöntem: GET parametresi ile basit kayıt
            if (!saveSuccess) {
                try {
                    $.ajax({
                        url: Q.resolveUrl('~/Services/Administration/User/SaveUserSettings'),
                        type: 'GET',
                        async: false,
                        timeout: 6000,
                        data: {
                            key: `GlobalFieldSettings_${dialogId}`,
                            value: JSON.stringify(data),
                            action: 'set',
                            global: 'true'
                        },
                        success: (response: any) => {
                            console.log('  ✅ SaveUserSettings GET ile global ayarlar kaydedildi:', response);
                            saveSuccess = true;
                            delete (window as any)[`dbSettings_${dialogId}`];
                        },
                        error: (xhr: any, status: string, error: string) => {
                            console.log('  ⚠️ SaveUserSettings GET hatası:', status, error);
                        }
                    });
                } catch (e) {
                    console.error('  ❌ SaveUserSettings GET exception:', e);
                }
            }
            
            // 4. Dördüncü yöntem: Doğrudan form endpoint'i
            if (!saveSuccess) {
                try {
                    $.ajax({
                        url: Q.resolveUrl('~/api/GlobalFieldSettings'),
                        type: 'POST',
                        async: false,
                        timeout: 5000,
                        contentType: 'application/json',
                        data: JSON.stringify({
                            DialogId: dialogId,
                            RequiredFields: requiredFields,
                            SavedBy: currentUsername,
                            Timestamp: new Date().toISOString()
                        }),
                        success: (response: any) => {
                            console.log('  ✅ Direct GlobalFieldSettings API ile kaydedildi:', response);
                            saveSuccess = true;
                            delete (window as any)[`dbSettings_${dialogId}`];
                        },
                        error: () => {
                            console.log('  ℹ️ Direct GlobalFieldSettings API bulunamadı');
                        }
                    });
                } catch (e) {
                    console.error('  ❌ Direct API exception:', e);
                }
            }
            
            // Başarı/başarısızlık durumunu raporla
            if (saveSuccess) {
                console.log('  🎉 Global ayarlar başarıyla veritabanına kaydedildi!');
                // Başarılı kayıt sonrası backup'ı da güncelle
                try {
                    localStorage.setItem(`DBBackup_GlobalFieldSettings_${dialogId}`, JSON.stringify(data));
                    console.log('  💾 Backup da güncellendi');
                } catch (e) {
                    console.error('  ⚠️ Backup güncellenemedi:', e);
                }
            } else {
                console.log('  ⚠️ Tüm veritabanı kaydetme yöntemleri başarısız, backup\'a kaydediliyor...');
                
                // Backup kaydetme
                try {
                    localStorage.setItem(`DBBackup_GlobalFieldSettings_${dialogId}`, JSON.stringify(data));
                    console.log('  🔄 LocalStorage backup kaydedildi');
                    
                    // Sistem yöneticisine de bir uyarı göster
                    if (this.isAdmin()) {
                        this.showNotification('Veritabanına kayıt başarısız! Ayarlar geçici olarak yerel depolamada.', 'error');
                    }
                } catch (e) {
                    console.error('  ❌ LocalStorage backup de başarısız:', e);
                    if (this.isAdmin()) {
                        this.showNotification('HATA: Ayarlar hiçbir yere kaydedilemedi!', 'error');
                    }
                }
            }
            
        } catch (error) {
            console.error('  ❌ saveToDatabase genel exception:', error);
            
            // Exception durumunda da backup yapmaya çalış
            try {
                const data = {
                    requiredFields: requiredFields,
                    savedAt: new Date().toISOString(),
                    savedBy: this.getCurrentUsername(),
                    dialogId: dialogId,
                    errorSave: true
                };
                localStorage.setItem(`DBBackup_GlobalFieldSettings_${dialogId}`, JSON.stringify(data));
                console.log('  🔄 Exception durumunda LocalStorage backup kaydedildi');
            } catch (e) {
                console.error('  ❌ Exception LocalStorage backup de başarısız:', e);
            }
        }
    }
    
    // Cache temizleme metodu
    private static clearCache() {
        try {
            // Tüm cache'leri ve zaman damgalarını temizle
            Object.keys(window as any).forEach(key => {
                if (key.startsWith('dbSettings_') || key.includes('_time')) {
                    delete (window as any)[key];
                }
            });
            console.log('🗑️ Tüm database cache\'leri temizlendi');
        } catch (error) {
            console.error('Cache temizleme hatası:', error);
        }
    }
    
    // Global ayarları broadcast et
    private static broadcastGlobalSettings(dialogId: string, requiredFields: string[]) {
        try {
            // BroadcastChannel API kullan (aynı origin'deki tüm tablar arasında)
            const channel = new BroadcastChannel('field_settings_channel');
            const message = {
                type: 'GLOBAL_SETTINGS_UPDATE',
                dialogId: dialogId,
                requiredFields: requiredFields,
                timestamp: new Date().toISOString(),
                sender: this.getCurrentUsername()
            };
            
            channel.postMessage(message);
            console.log('📡 Global ayarlar broadcast edildi:', message);
            channel.close();
            
        } catch (error) {
            console.error('Broadcast hatası:', error);
        }
    }
    
    // Broadcast dinleyici başlat
    private static startBroadcastListener() {
        try {
            // BroadcastChannel dinleyici
            const channel = new BroadcastChannel('field_settings_channel');
            channel.onmessage = (event) => {
                if (event.data.type === 'GLOBAL_SETTINGS_UPDATE') {
                    console.log('📨 Global ayar güncellemesi alındı:', event.data);
                    
                    const dialogId = event.data.dialogId;
                    const requiredFields = event.data.requiredFields;
                    
                    // Global ayarları güncelle
                    const globalKey = `GlobalFieldSettings_${dialogId}`;
                    const globalSettings: any = {};
                    requiredFields.forEach((field: string) => {
                        globalSettings[field] = { required: true };
                    });
                    
                    localStorage.setItem(globalKey, JSON.stringify(globalSettings));
                    
                    // Backup'ı da güncelle
                    const backupData = {
                        requiredFields: requiredFields,
                        savedAt: event.data.timestamp,
                        savedBy: event.data.sender,
                        dialogId: dialogId,
                        receivedVia: 'broadcast'
                    };
                    localStorage.setItem(`DBBackup_GlobalFieldSettings_${dialogId}`, JSON.stringify(backupData));
                    
                    // Cache'i temizle
                    delete (window as any)[`dbSettings_${dialogId}`];
                    
                    // Açık dialogları güncelle
                    this.checkForDialogs();
                    
                    // Kullanıcıya bildirim göster
                    if (!this.isAdmin()) {
                        this.showNotification(`Form ayarları güncellendi (${event.data.sender} tarafından)`, 'info');
                    }
                }
            };
            
            console.log('📻 Broadcast dinleyici başlatıldı');
            
        } catch (error) {
            console.error('Broadcast dinleyici hatası:', error);
        }
    }
}