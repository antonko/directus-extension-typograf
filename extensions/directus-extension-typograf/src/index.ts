import { defineInterface } from "@directus/extensions-sdk";
import InterfaceComponent from "./interface.vue";

export default defineInterface({
  id: "typograf-input",
  name: "Typograf Input",
  icon: "text_fields",
  description: "Text field with automatic typography",
  component: InterfaceComponent,
  options: (context) => {
    const fieldType = context?.field?.type;
    const isStringField = fieldType === "string";

    // Варианты редактора: для string - только input, для text - все
    const editorChoices = isStringField
      ? [{ text: "Single-line (Input)", value: "input" }]
      : [
          { text: "Single-line (Input)", value: "input" },
          { text: "Multi-line (Textarea)", value: "textarea" },
          { text: "WYSIWYG (HTML)", value: "wysiwyg" },
          { text: "Markdown", value: "markdown" },
        ];

    return [
      {
        field: "editorType",
        name: "Editor Type",
        type: "string",
        meta: {
          interface: "select-dropdown",
          width: "half",
          note: isStringField
            ? "Only Input is available for string fields."
            : "Textarea/WYSIWYG/Markdown are only available for text fields.",
          options: {
            choices: editorChoices,
          },
        },
        schema: {
          default_value: "input",
        },
      },
      {
        field: "locale",
        name: "Typograph Locale",
        type: "string",
        meta: {
          interface: "select-dropdown",
          width: "half",
          note: '"Auto" detects language from translations collection (languages_code).',
          options: {
            choices: [
              { text: "Auto (from translations)", value: "auto" },
              { text: "Belarusian (be)", value: "be" },
              { text: "Bulgarian (bg)", value: "bg" },
              { text: "Catalan (ca)", value: "ca" },
              { text: "Czech (cs)", value: "cs" },
              { text: "Danish (da)", value: "da" },
              { text: "Dutch (nl)", value: "nl" },
              { text: "English, UK (en-GB)", value: "en-GB" },
              { text: "English, US (en-US)", value: "en-US" },
              { text: "Esperanto (eo)", value: "eo" },
              { text: "Estonian (et)", value: "et" },
              { text: "Finnish (fi)", value: "fi" },
              { text: "French (fr)", value: "fr" },
              { text: "German (de)", value: "de" },
              { text: "Greek (el)", value: "el" },
              { text: "Hungarian (hu)", value: "hu" },
              { text: "Irish (ga)", value: "ga" },
              { text: "Italian (it)", value: "it" },
              { text: "Latvian (lv)", value: "lv" },
              { text: "Norwegian (no)", value: "no" },
              { text: "Polish (pl)", value: "pl" },
              { text: "Romanian (ro)", value: "ro" },
              { text: "Russian (ru)", value: "ru" },
              { text: "Serbian (sr)", value: "sr" },
              { text: "Slovak (sk)", value: "sk" },
              { text: "Slovenian (sl)", value: "sl" },
              { text: "Spanish (es)", value: "es" },
              { text: "Swedish (sv)", value: "sv" },
              { text: "Turkish (tr)", value: "tr" },
              { text: "Ukrainian (uk)", value: "uk" },
            ],
          },
        },
        schema: {
          default_value: "auto",
        },
      },
      {
        field: "placeholder",
        name: "Placeholder",
        type: "string",
        meta: {
          interface: "input",
          width: "full",
        },
        schema: {
          default_value: "",
        },
      },
    ];
  },
  types: ["string", "text"],
});
