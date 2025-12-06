# AGENTS.md

Информация о проекте для AI-агентов.

## Описание проекта

Кастомное расширение (interface) для Directus CMS, добавляющее текстовое поле с кнопкой типографирования текста по правилам русского/английского языка.

## Архитектура

### Тип расширения

- **Interface Extension** для Directus
- Добавляет кастомный UI-компонент для редактирования полей типа `string` и `text`

### Основные файлы

```
extensions/directus-extension-typograf/
├── src/
│   ├── index.ts          # Конфигурация интерфейса (defineInterface)
│   ├── interface.vue     # Vue 3 компонент с Composition API
│   ├── typograf.ts       # Логика типографирования для разных форматов
│   └── shims.d.ts        # TypeScript definitions для .vue файлов
├── dist/                 # Собранный бандл (не в git)
└── package.json          # Зависимости и скрипты сборки
```

### Конфигурация расширения (`index.ts`)

```typescript
defineInterface({
  id: "typograf-input",
  name: "Typograf Input",
  icon: "text_fields",
  description: "Текстовое поле с типографированием",
  component: InterfaceComponent,
  // Динамические опции на основе типа поля
  options: (context) => {
    const fieldType = context?.field?.type;
    const isStringField = fieldType === "string";
    // Для string - только input, для text - все редакторы
    // ...
  },
  types: ["string", "text"],
});
```

### Vue компонент (`interface.vue`)

**Используемые компоненты** (глобально доступны в Directus):

- `<v-input>` - однострочное текстовое поле
- `<v-textarea>` - многострочное текстовое поле
- `<interface-input-rich-text-html>` - WYSIWYG редактор
- `<interface-input-rich-text-md>` - Markdown редактор
- `<v-button>`, `<v-icon>` - кнопка типографирования

**Пропсы интерфейса**:

- `value: string | null` - текущее значение поля
- `disabled: boolean` - заблокировано ли поле
- `placeholder: string` - плейсхолдер
- `editorType: EditorType` - тип редактора (input/textarea/wysiwyg/markdown)
- `locale: LocaleType` - локаль (ru/en-US)
- `type: string` - тип поля БД (string/text)

**События**:

- `@input` - эмитится при изменении значения (не `update:modelValue`!)

### Модуль типографирования (`typograf.ts`)

```typescript
// Типы
type EditorType = "input" | "textarea" | "wysiwyg" | "markdown";
type LocaleType = "ru" | "en-US";

// Функции
typografPlainText(text, locale); // Для Input/Textarea
typografHtml(html, locale); // Для WYSIWYG - сохраняет HTML структуру
typografMarkdown(md, locale); // Для Markdown - защищает синтаксис
applyTypograf(text, editorType, locale); // Универсальная функция
```

**Особенности Markdown типографирования**:

- Защищает code blocks (```)
- Защищает inline code (`)
- Защищает ссылки и изображения
- Защищает URL
- Типографирует только текстовое содержимое

## Технологии

- **Directus**: 11.5.1
- **Vue**: 3.5.25 (Composition API, `<script setup>`)
- **TypeScript**: 5.9.3
- **typograf**: 7.6.0
- **Build Tool**: `@directus/extensions-sdk` CLI

## Команды разработки

```bash
# Запуск Directus с расширением
docker compose up

# Dev-режим расширения (watch + auto-rebuild)
cd extensions/directus-extension-typograf
npm run dev

# Production сборка
npm run build
```

## Окружение

- **База данных**: SQLite (`./database/data.db`)
- **Порт Directus**: 8055
- **Auto-reload**: Включен (`EXTENSIONS_AUTO_RELOAD: true`)
- **Mounting**: `./extensions:/directus/extensions` (volume в Docker)

## Особенности Directus Extensions

1. **Глобальные компоненты**: Все Directus UI компоненты (`v-*`, `interface-*`) доступны без импорта
2. **Событие `input`**: Используется вместо стандартного `update:modelValue`
3. **Динамические options**: Функция `options(context)` получает контекст с `field.type`
4. **Hot Reload**: При изменении файлов в dev-режиме автоматически пересобирается

## Ограничения типов полей

| Тип поля БД        | Доступные редакторы                |
| ------------------ | ---------------------------------- |
| `string` (VARCHAR) | Input                              |
| `text` (TEXT)      | Input, Textarea, WYSIWYG, Markdown |

Ограничение реализовано на двух уровнях:

1. В `index.ts` — динамически фильтруются варианты в dropdown
2. В `interface.vue` — `effectiveEditorType` всегда возвращает `input` для string

## Полезные ссылки

- [Directus Extensions Docs](https://docs.directus.io/guides/extensions/)
- [Directus Interfaces Guide](https://docs.directus.io/guides/extensions/app-extensions/interfaces)
- [Directus UI Library](https://docs.directus.io/guides/extensions/app-extensions/ui-library)
- [typograf GitHub](https://github.com/typograf/typograf)
