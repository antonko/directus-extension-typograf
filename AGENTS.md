# AGENTS.md

Информация о проекте для AI-агентов.

## Описание проекта

Кастомное расширение (interface) для Directus CMS, добавляющее текстовое поле с кнопкой обработки текста справа от поля ввода.

**Цель**: Типографирование текста по правилам русского/английского языка.

## Архитектура

### Тип расширения

- **Interface Extension** для Directus
- Добавляет кастомный UI-компонент для редактирования полей типа `string` и `text`

### Основные файлы

```
extensions/directus-extension-typograf/
├── src/
│   ├── index.ts          # Entrypoint: конфигурация интерфейса (defineInterface)
│   ├── interface.vue     # Vue 3 компонент с Composition API
│   └── shims.d.ts        # TypeScript definitions для .vue файлов
├── dist/                 # Собранный бандл (не в git)
└── package.json          # Зависимости и скрипты сборки
```

### Конфигурация расширения (`index.ts`)

```typescript
defineInterface({
  id: "typograf-input", // Уникальный ID интерфейса
  name: "Typograf Input", // Отображаемое имя
  icon: "text_fields", // Material Icons название
  types: ["string", "text"], // Поддерживаемые типы полей БД
  options: null, // Пока нет настроек
  component: InterfaceComponent, // Vue компонент
});
```

### Vue компонент (`interface.vue`)

**Используемые Directus UI компоненты** (глобально доступны, импорт не нужен):

- `<v-input>` - текстовое поле
- `<v-button>` - кнопка
- `<v-icon>` - иконка

**Пропсы интерфейса**:

- `value: string | null` - текущее значение поля
- `disabled: boolean` - заблокировано ли поле
- `placeholder: string` - плейсхолдер

**События**:

- `@input` - эмитится при изменении значения (не `update:modelValue`!)

**Важно**: Directus использует событие `input`, а не стандартное Vue 3 `update:modelValue`.

## Технологии

- **Directus**: 11.5.1
- **Vue**: 3.5.25 (Composition API, `<script setup>`)
- **TypeScript**: 5.9.3
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

1. **Глобальные компоненты**: Все Directus UI компоненты (`v-*`) доступны без импорта
2. **Событие `input`**: Используется вместо стандартного `update:modelValue`
3. **Композаблы**: Доступны из `@directus/extensions-sdk` (useApi, useStores, и др.)
4. **Hot Reload**: При изменении файлов в dev-режиме автоматически пересобирается

## Следующие шаги для развития

1. **Добавить библиотеку типографа**:

   - Установить `typograf` в `package.json`
   - Реализовать `new Typograf().execute(text)` в обработчике кнопки

2. **Расширить опции**:

   - Добавить `options` в `index.ts` для настройки локали
   - Поддержка выбора правил типографирования

3. **Поддержка textarea/markdown**:
   - Условный рендеринг `v-input` vs `v-textarea` на основе опций
   - Учет многострочного текста

## Полезные ссылки

- [Directus Extensions Docs](https://docs.directus.io/guides/extensions/)
- [Directus Interfaces Guide](https://docs.directus.io/guides/extensions/app-extensions/interfaces)
- [Directus UI Library](https://docs.directus.io/guides/extensions/app-extensions/ui-library)
