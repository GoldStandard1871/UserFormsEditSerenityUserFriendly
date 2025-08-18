/**
 * Global Field Settings Manager
 * Admin'in zorunlu alan ayarlarını veritabanında saklar ve tüm kullanıcılar için yükler
 */
export class GlobalFieldSettings {
    
    // Global zorunlu alanları veritabanına kaydet (Admin için)
    public static saveGlobalRequiredFields(dialogId: string, requiredFields: string[]): void {
        const Q = (window as any).Q;
        const $ = (window as any).jQuery || (window as any).$;
        
        if (!Q || !$) return;
        
        const data = {
            dialogId: dialogId,
            requiredFields: requiredFields,
            savedAt: new Date().toISOString(),
            savedBy: Q.Authorization?.userDefinition?.Username || 'admin'
        };
        
        console.log('💾 Global zorunlu alanlar kaydediliyor:', data);
        
        // SQL'e direkt INSERT/UPDATE yap
        const sql = `
            IF EXISTS (SELECT 1 FROM UserPreferences WHERE UserId = 0 AND Name = 'GlobalFieldSettings_${dialogId}')
                UPDATE UserPreferences 
                SET Value = '${JSON.stringify(data).replace(/'/g, "''")}'
                WHERE UserId = 0 AND Name = 'GlobalFieldSettings_${dialogId}'
            ELSE
                INSERT INTO UserPreferences (UserId, PreferenceType, Name, Value)
                VALUES (0, 'UserFormDesign', 'GlobalFieldSettings_${dialogId}', '${JSON.stringify(data).replace(/'/g, "''")}')
        `;
        
        // Execute SQL via service
        $.ajax({
            url: Q.resolveUrl('~/Services/Administration/User/ExecuteSQL'),
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ sql: sql }),
            success: () => {
                console.log('✅ Global zorunlu alanlar veritabanına kaydedildi');
                
                // localStorage'a da yedek olarak kaydet
                localStorage.setItem(`GlobalFieldSettings_${dialogId}`, JSON.stringify(data));
            },
            error: (error: any) => {
                console.error('❌ Veritabanı kaydetme hatası:', error);
                
                // En azından localStorage'a kaydet
                localStorage.setItem(`GlobalFieldSettings_${dialogId}`, JSON.stringify(data));
            }
        });
    }
    
    // Global zorunlu alanları veritabanından yükle (Tüm kullanıcılar için)
    public static loadGlobalRequiredFields(dialogId: string): string[] {
        const Q = (window as any).Q;
        const $ = (window as any).jQuery || (window as any).$;
        
        if (!Q || !$) return [];
        
        let requiredFields: string[] = [];
        
        // SQL'den direkt SELECT yap
        const sql = `
            SELECT Value 
            FROM UserPreferences 
            WHERE UserId = 0 
                AND Name = 'GlobalFieldSettings_${dialogId}'
        `;
        
        // Senkron olarak veritabanından oku
        $.ajax({
            url: Q.resolveUrl('~/Services/Administration/User/ExecuteSQL'),
            type: 'POST',
            async: false,
            contentType: 'application/json',
            data: JSON.stringify({ sql: sql, returnData: true }),
            success: (response: any) => {
                if (response && response.data && response.data[0]) {
                    try {
                        const data = JSON.parse(response.data[0].Value);
                        requiredFields = data.requiredFields || [];
                        console.log('✅ Veritabanından global zorunlu alanlar yüklendi:', requiredFields);
                    } catch (e) {
                        console.error('JSON parse hatası:', e);
                    }
                }
            },
            error: () => {
                console.log('⚠️ Veritabanı okunamadı, localStorage\'dan deneniyor');
                
                // Veritabanı başarısız olursa localStorage'dan dene
                const stored = localStorage.getItem(`GlobalFieldSettings_${dialogId}`);
                if (stored) {
                    try {
                        const data = JSON.parse(stored);
                        requiredFields = data.requiredFields || [];
                    } catch (e) {}
                }
            }
        });
        
        return requiredFields;
    }
    
    // Admin mi kontrol et
    public static isAdmin(): boolean {
        const Q = (window as any).Q;
        if (Q?.Authorization?.userDefinition) {
            const user = Q.Authorization.userDefinition;
            return user.IsAdmin === true || user.Username?.toLowerCase() === 'admin';
        }
        return false;
    }
}