@echo off
echo ========================================
echo BACKUP RESTORE SCRIPT
echo Tarih: 2025-01-31 - Working Version
echo ========================================
echo.
echo Bu script mevcut dosyalari yedekleyip, backup dosyalarini geri yukleyecektir.
echo.
pause

echo.
echo Mevcut dosyalar yedekleniyor...

REM Mevcut dosyaları .current olarak yedekle
copy /Y "..\..\Modules\Administration\UserFormEditor\FormFieldOrderDialog.tsx" "FormFieldOrderDialog.tsx.current"
copy /Y "..\..\wwwroot\Content\site\site.css" "site.css.current"
copy /Y "..\..\wwwroot\Content\site\fieldorder.css" "fieldorder.css.current"
copy /Y "..\..\wwwroot\Content\site\simpleform.css" "simpleform.css.current"
copy /Y "..\..\wwwroot\Content\site\userformeditor.css" "userformeditor.css.current"

echo.
echo Backup dosyalari geri yukleniyor...

REM Backup dosyalarını geri yükle
copy /Y "FormFieldOrderDialog.tsx.backup" "..\..\Modules\Administration\UserFormEditor\FormFieldOrderDialog.tsx"
copy /Y "site.css.backup" "..\..\wwwroot\Content\site\site.css"
copy /Y "fieldorder.css.backup" "..\..\wwwroot\Content\site\fieldorder.css"
copy /Y "simpleform.css.backup" "..\..\wwwroot\Content\site\simpleform.css"
copy /Y "userformeditor.css.backup" "..\..\wwwroot\Content\site\userformeditor.css"

echo.
echo ========================================
echo RESTORE ISLEMI TAMAMLANDI!
echo ========================================
echo.
echo NOT: Mevcut dosyalar .current uzantisiyla yedeklendi.
echo Tarayicinizin cache'ini temizlemeyi unutmayin!
echo.
pause