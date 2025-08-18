import { Config, ErrorHandling, HtmlContentEditor, TranslationConfig, getjQuery } from "@serenity-is/corelib";
import { gridDefaults } from "@serenity-is/sleekgrid";
import { getLanguageList } from "./Helpers/LanguageList";
import { DialogFieldCustomizer } from "./DialogFieldCustomizer";

Config.rootNamespaces.push('UserControlForm');
TranslationConfig.getLanguageList = getLanguageList;
HtmlContentEditor.CKEditorBasePath = "~/Serenity.Assets/Scripts/ckeditor/";
gridDefaults.useCssVars = false;

let $ = getjQuery();
if ($?.fn?.colorbox) {
    $.fn.colorbox.settings.maxWidth = "95%";
    $.fn.colorbox.settings.maxHeight = "95%";
}

window.onerror = ErrorHandling.runtimeErrorHandler;
window.addEventListener('unhandledrejection', ErrorHandling.unhandledRejectionHandler);

// Dialog Field Customizer - Yeni temiz sistem
DialogFieldCustomizer.initialize();

console.log('ScriptInit.ts yüklendi');