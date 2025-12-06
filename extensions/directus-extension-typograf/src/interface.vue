<template>
  <div class="typograf-wrapper">
    <div class="typograf-editor-container">
      <!-- Input (однострочное поле) -->
      <v-input
        v-if="effectiveEditorType === 'input'"
        :model-value="value"
        @update:model-value="handleChange"
        :disabled="disabled"
        :placeholder="placeholder"
        class="typograf-field"
      />

      <!-- Textarea (многострочное поле) -->
      <v-textarea
        v-else-if="effectiveEditorType === 'textarea'"
        :model-value="value"
        @update:model-value="handleChange"
        :disabled="disabled"
        :placeholder="placeholder"
        class="typograf-field"
      />

      <!-- WYSIWYG (HTML редактор) -->
      <interface-input-rich-text-html
        v-else-if="effectiveEditorType === 'wysiwyg'"
        :value="value"
        @input="handleChange"
        :disabled="disabled"
        :placeholder="placeholder"
        class="typograf-field"
      />

      <!-- Markdown редактор -->
      <interface-input-rich-text-md
        v-else-if="effectiveEditorType === 'markdown'"
        :value="value"
        @input="handleChange"
        :disabled="disabled"
        :placeholder="placeholder"
        class="typograf-field"
      />

      <!-- Fallback на input -->
      <v-input
        v-else
        :model-value="value"
        @update:model-value="handleChange"
        :disabled="disabled"
        :placeholder="placeholder"
        class="typograf-field"
      />
    </div>

    <v-button
      :disabled="disabled || !value"
      @click="handleTypograf"
      icon
      small
      class="typograf-button"
      v-tooltip="'Типографировать текст'"
    >
      <v-icon name="auto_fix_high" />
    </v-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { applyTypograf, type EditorType, type LocaleType } from "./typograf";

interface Props {
  value?: string | null;
  disabled?: boolean;
  placeholder?: string;
  editorType?: EditorType;
  locale?: LocaleType;
  type?: string; // Тип поля из БД: "string" | "text"
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
  disabled: false,
  placeholder: "",
  editorType: "input",
  locale: "ru",
  type: "string",
});

const emit = defineEmits<{
  (e: "input", value: string | null): void;
}>();

// Вычисляем эффективный тип редактора с учётом ограничений
// string поддерживает только input, text - все типы
const effectiveEditorType = computed<EditorType>(() => {
  if (props.type === "string") {
    return "input";
  }
  return props.editorType;
});

function handleChange(value: string | null): void {
  emit("input", value);
}

function handleTypograf(): void {
  const currentValue = props.value || "";
  const result = applyTypograf(
    currentValue,
    effectiveEditorType.value,
    props.locale,
  );
  emit("input", result);
}
</script>

<style scoped>
.typograf-wrapper {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  width: 100%;
}

.typograf-editor-container {
  flex: 1;
  min-width: 0;
}

.typograf-field {
  width: 100%;
}

.typograf-button {
  flex-shrink: 0;
  margin-top: 4px;
}

/* Для WYSIWYG и Markdown кнопку чуть ниже */
.typograf-wrapper:has(interface-input-rich-text-html) .typograf-button,
.typograf-wrapper:has(interface-input-rich-text-md) .typograf-button {
  margin-top: 8px;
}
</style>
