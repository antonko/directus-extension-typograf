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
      v-tooltip="'Apply typography'"
    >
      <v-icon name="auto_fix_high" />
    </v-button>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject } from "vue";
import {
  applyTypograf,
  mapLanguageCode,
  type EditorType,
  type LocaleType,
  type LocaleOption,
} from "./typograf";

interface Props {
  value?: string | null;
  disabled?: boolean;
  placeholder?: string;
  editorType?: EditorType;
  locale?: LocaleOption;
  type?: string; // Тип поля из БД: "string" | "text"
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
  disabled: false,
  placeholder: "",
  editorType: "input",
  locale: "auto",
  type: "string",
});

const emit = defineEmits<{
  (e: "input", value: string | null): void;
}>();

// Получаем inject values для доступа к languages_code в translations
const injectedValues = inject<any>("values", null);

// Получаем field-data из attrs для определения, находимся ли мы в translations коллекции
const instance = getCurrentInstance();
const fieldData = instance?.attrs["field-data"] as
  | { collection?: string }
  | undefined;
const isTranslationsCollection =
  fieldData?.collection?.endsWith("_translations") ?? false;

/**
 * Определяет эффективную локаль для типографирования
 * - Если locale="auto" и поле в translations коллекции → берём из languages_code
 * - Иначе используем статическую настройку
 */
const effectiveLocale = computed<LocaleType>(() => {
  // Если задана конкретная локаль (не auto) — используем её
  if (props.locale !== "auto") {
    return props.locale;
  }

  // Режим "auto" — пытаемся определить язык из контекста
  if (isTranslationsCollection && injectedValues?.value) {
    const values = injectedValues.value;
    // languages_code может быть строкой или объектом {code: "..."}
    const langCode =
      typeof values.languages_code === "object"
        ? values.languages_code?.code
        : values.languages_code;

    if (langCode) {
      return mapLanguageCode(langCode);
    }
  }

  // Fallback — русский
  return "ru";
});

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
    effectiveLocale.value,
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
