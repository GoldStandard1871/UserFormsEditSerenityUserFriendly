import { FormEditorV2Widget } from "./FormEditorV2Widget";

export default function pageInit() {
    const container = $('<div id="FormEditorContainer" class="form-editor-v2"></div>');
    $('#GridDiv').replaceWith(container);
    new FormEditorV2Widget(container);
}