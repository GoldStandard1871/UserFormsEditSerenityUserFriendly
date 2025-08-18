// Admin tarafında çalıştırın ve çıktıyı kopyalayın:
console.log('=== LOCALSTORAGE EXPORT ===');
const exportData = {};
Object.keys(localStorage).forEach(key => {
    if (key.includes('GlobalFieldSettings')) {
        exportData[key] = localStorage.getItem(key);
    }
});
console.log(JSON.stringify(exportData));
console.log('=== KOPYALAYIN YUKARIYI ===');

// Test kullanıcısında çalıştırın (admin'den kopyaladığınız JSON'u buraya yapıştırın):
const importData = {}; // Buraya admin'den kopyaladığınız JSON'u yapıştırın
Object.keys(importData).forEach(key => {
    localStorage.setItem(key, importData[key]);
});
console.log('Global ayarlar import edildi!');

// Test etmek için:
// debugFieldSettings()