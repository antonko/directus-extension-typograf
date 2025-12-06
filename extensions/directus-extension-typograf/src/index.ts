import { defineInterface } from "@directus/extensions-sdk";
import InterfaceComponent from "./interface.vue";

export default defineInterface({
  id: "typograf-input",
  name: "Typograf Input",
  icon: "text_fields",
  description: "Текстовое поле с типографированием",
  component: InterfaceComponent,
  options: [
    {
      field: "editorType",
      name: "Тип редактора",
      type: "string",
      meta: {
        interface: "select-dropdown",
        width: "half",
        note: "Textarea/WYSIWYG/Markdown доступны только для полей типа text. Для string всегда используется Input.",
        options: {
          choices: [
            { text: "Однострочное поле (Input)", value: "input" },
            { text: "Многострочное поле (Textarea)", value: "textarea" },
            { text: "WYSIWYG (HTML)", value: "wysiwyg" },
            { text: "Markdown", value: "markdown" },
          ],
        },
      },
      schema: {
        default_value: "input",
      },
    },
    {
      field: "locale",
      name: "Локаль для типографирования",
      type: "string",
      meta: {
        interface: "select-dropdown",
        width: "half",
        options: {
          choices: [
            { text: "Русский (ru)", value: "ru" },
            { text: "Английский (en-US)", value: "en-US" },
          ],
        },
      },
      schema: {
        default_value: "ru",
      },
    },
    {
      field: "placeholder",
      name: "Плейсхолдер",
      type: "string",
      meta: {
        interface: "input",
        width: "full",
      },
      schema: {
        default_value: "",
      },
    },
  ],
  types: ["string", "text"],
});
