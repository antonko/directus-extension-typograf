<template>
  <div class="typograf-input-wrapper">
    <v-input
      :model-value="value"
      @update:model-value="handleChange"
      :disabled="disabled"
      :placeholder="placeholder"
      class="typograf-input-field"
    />
    <v-button
      :disabled="disabled"
      @click="transformToUppercase"
      icon
      small
      class="typograf-button"
    >
      <v-icon name="text_fields" />
    </v-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  value?: string | null;
  disabled?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
  disabled: false,
  placeholder: "",
});

const emit = defineEmits<{
  (e: "input", value: string | null): void;
}>();

function handleChange(value: string): void {
  emit("input", value);
}

function transformToUppercase(): void {
  const currentValue = props.value || "";
  const uppercased = currentValue.toUpperCase();
  emit("input", uppercased);
}
</script>

<style scoped>
.typograf-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.typograf-input-field {
  flex: 1;
}

.typograf-button {
  flex-shrink: 0;
}
</style>
