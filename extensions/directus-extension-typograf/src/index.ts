import { defineInterface } from "@directus/extensions-sdk";
import InterfaceComponent from "./interface.vue";

export default defineInterface({
  id: "typograf-input",
  name: "Typograf Input",
  icon: "text_fields",
  description: "Строка/текст с кнопкой типографирования",
  component: InterfaceComponent,
  options: null,
  types: ["string", "text"],
});
