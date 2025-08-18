// Bu script'i TEST KULLANICISI'nın tarayıcısında (Opera) çalıştırın
// Admin'in zorunlu alan ayarlarını manuel olarak yükleyecek

// 1. Önce mevcut durumu kontrol et
console.log("=== MEVCUT DURUM ===");
const currentGlobal = localStorage.getItem('GlobalFieldSettings_CustomerDialog');
console.log("Mevcut global ayar:", currentGlobal);

// 2. Admin'in zorunlu alan ayarlarını ekle
const adminRequiredFields = {
    "Firma Adı": { required: true },
    "Müşteri Kodu": { required: true },
    "Temas Edilen Unvanı": { required: true }
};

console.log("\n=== YENİ AYARLAR EKLENİYOR ===");
localStorage.setItem('GlobalFieldSettings_CustomerDialog', JSON.stringify(adminRequiredFields));
console.log("✅ Global zorunlu alanlar eklendi:", adminRequiredFields);

// 3. Alternatif key'ler de ekle (farklı versiyonlar için)
localStorage.setItem('GlobalRequiredFields_CustomerDialog', JSON.stringify({
    requiredFields: ["Firma Adı", "Müşteri Kodu", "Temas Edilen Unvanı"],
    savedAt: new Date().toISOString(),
    savedBy: "admin"
}));

// 4. Backup key
localStorage.setItem('DBBackup_GlobalFieldSettings_CustomerDialog', JSON.stringify({
    requiredFields: ["Firma Adı", "Müşteri Kodu", "Temas Edilen Unvanı"],
    savedAt: new Date().toISOString(),
    savedBy: "admin"
}));

// 5. Sonucu kontrol et
console.log("\n=== KONTROL ===");
console.log("GlobalFieldSettings_CustomerDialog:", localStorage.getItem('GlobalFieldSettings_CustomerDialog'));
console.log("GlobalRequiredFields_CustomerDialog:", localStorage.getItem('GlobalRequiredFields_CustomerDialog'));
console.log("DBBackup_GlobalFieldSettings_CustomerDialog:", localStorage.getItem('DBBackup_GlobalFieldSettings_CustomerDialog'));

console.log("\n✅ TÜM AYARLAR YÜKLENDİ!");
console.log("Şimdi Müşteri dialog'unu açın ve zorunlu alanları göreceksiniz!");
console.log("Kırmızı yıldızlı alanlar: Firma Adı, Müşteri Kodu, Temas Edilen Unvanı");