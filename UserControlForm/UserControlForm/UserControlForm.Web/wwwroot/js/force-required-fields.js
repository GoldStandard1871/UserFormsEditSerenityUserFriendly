// Bu script otomatik olarak zorunlu alanları test kullanıcısı için aktif eder
// ScriptInit.ts'ye eklenecek

(function() {
    // Sadece test kullanıcısı için çalış
    if (window.Q && window.Q.Authorization) {
        var username = window.Q.Authorization.userDefinition.Username;
        
        // Test kullanıcısı değilse veya admin ise çık
        if (username === 'admin' || username === 'Admin') {
            return;
        }
        
        console.log('🔍 Zorunlu alanlar kontrol ediliyor...');
        
        // Dialog açıldığında otomatik olarak zorunlu alanları işaretle
        $(document).on('dialogopen', function(e) {
            setTimeout(function() {
                var dialog = e.target;
                var dialogId = getDialogId(dialog);
                
                if (dialogId === 'CustomerDialog' || dialogId === 'MusteriDialog') {
                    console.log('✅ Müşteri dialog açıldı, zorunlu alanlar uygulanıyor...');
                    
                    // Zorunlu alanlar
                    var requiredFields = ['Firma Adı', 'Müşteri Kodu', 'Temas Edilen Unvanı'];
                    
                    // Her alan için yıldız ekle
                    $(dialog).find('.field').each(function() {
                        var field = $(this);
                        var caption = field.find('.caption');
                        var label = caption.text().replace(/\*/g, '').trim();
                        
                        if (requiredFields.indexOf(label) !== -1) {
                            // Yıldız ekle
                            if (!caption.find('.required-star').length) {
                                caption.prepend('<sup class="required-star" style="color:red; font-weight:bold;">*</sup> ');
                            }
                            
                            // Input'a required attribute ekle
                            var input = field.find('input, select, textarea');
                            input.attr('required', 'required');
                            input.attr('data-required', 'true');
                            
                            console.log('  ⭐ Zorunlu alan: ' + label);
                        }
                    });
                    
                    // Kaydet butonuna validation ekle
                    $(dialog).find('.save-and-close, .apply-changes').off('click.validation').on('click.validation', function(e) {
                        var isValid = true;
                        var firstError = null;
                        
                        $(dialog).find('.field').each(function() {
                            var field = $(this);
                            var caption = field.find('.caption');
                            var label = caption.text().replace(/\*/g, '').trim();
                            
                            if (requiredFields.indexOf(label) !== -1) {
                                var input = field.find('input, select, textarea');
                                var value = input.val();
                                
                                // Önceki hataları temizle
                                field.removeClass('has-error');
                                field.find('.field-validation-error').remove();
                                
                                if (!value || value.trim() === '') {
                                    isValid = false;
                                    
                                    // Hata göster
                                    field.addClass('has-error');
                                    input.after('<span class="field-validation-error" style="color:red; font-size:12px; display:block;">' + label + ' zorunlu bir alandır</span>');
                                    
                                    if (!firstError) {
                                        firstError = input;
                                    }
                                }
                            }
                        });
                        
                        if (!isValid) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // İlk hatalı alana focus
                            if (firstError) {
                                firstError.focus();
                            }
                            
                            // Hata mesajı göster
                            window.Q.notifyError('Lütfen zorunlu alanları doldurun!');
                            return false;
                        }
                    });
                }
            }, 100);
        });
    }
    
    function getDialogId(dialog) {
        var className = dialog.className || '';
        var match = className.match(/s-(\w+Dialog)/);
        if (match) return match[1];
        
        var title = $(dialog).find('.ui-dialog-title, .modal-title, h3').first().text();
        if (title.indexOf('Müşteri') !== -1 || title.indexOf('Customer') !== -1) {
            return 'CustomerDialog';
        }
        
        return 'UnknownDialog';
    }
})();