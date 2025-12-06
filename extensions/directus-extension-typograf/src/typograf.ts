import Typograf from "typograf";

export type EditorType = "input" | "textarea" | "wysiwyg" | "markdown";
export type LocaleType = "ru" | "en-US";

/**
 * Создаёт экземпляр типографа с заданной локалью
 */
function createTypograf(locale: LocaleType): Typograf {
  const tp = new Typograf({ locale: [locale] });
  return tp;
}

/**
 * Типографирование plain text (Input/Textarea)
 */
export function typografPlainText(text: string, locale: LocaleType): string {
  console.log("[Typograf:plainText] Вход:", { text, locale });
  if (!text) return text;
  const tp = createTypograf(locale);
  const result = tp.execute(text);
  console.log("[Typograf:plainText] Результат:", {
    input: text,
    output: result,
  });
  return result;
}

/**
 * Типографирование HTML (WYSIWYG)
 * Сохраняет структуру HTML, типографирует только текстовое содержимое
 */
export function typografHtml(html: string, locale: LocaleType): string {
  if (!html) return html;
  const tp = createTypograf(locale);
  // Включаем правило обработки HTML тегов
  tp.enableRule("common/html/*");
  return tp.execute(html);
}

/**
 * Типографирование Markdown
 * Безопасно обрабатывает текст, не ломая синтаксис Markdown
 */
export function typografMarkdown(markdown: string, locale: LocaleType): string {
  if (!markdown) return markdown;

  // Placeholders для защиты Markdown-синтаксиса
  const placeholders: string[] = [];
  let placeholderIndex = 0;

  const createPlaceholder = (content: string): string => {
    const placeholder = `\x00PLACEHOLDER_${placeholderIndex++}\x00`;
    placeholders.push(content);
    return placeholder;
  };

  let protected_ = markdown;

  // Защищаем code blocks (```)
  protected_ = protected_.replace(/```[\s\S]*?```/g, (match) =>
    createPlaceholder(match),
  );

  // Защищаем inline code (`)
  protected_ = protected_.replace(/`[^`\n]+`/g, (match) =>
    createPlaceholder(match),
  );

  // Защищаем ссылки [text](url)
  protected_ = protected_.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (match) =>
    createPlaceholder(match),
  );

  // Защищаем изображения ![alt](url)
  protected_ = protected_.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match) =>
    createPlaceholder(match),
  );

  // Защищаем reference links [text][ref]
  protected_ = protected_.replace(/\[([^\]]*)\]\[([^\]]*)\]/g, (match) =>
    createPlaceholder(match),
  );

  // Защищаем URL в тексте (начинающиеся с http/https)
  protected_ = protected_.replace(/https?:\/\/[^\s)>\]]+/g, (match) =>
    createPlaceholder(match),
  );

  // Защищаем HTML-теги (если есть в Markdown)
  protected_ = protected_.replace(/<[^>]+>/g, (match) =>
    createPlaceholder(match),
  );

  // Типографируем оставшийся текст
  const tp = createTypograf(locale);
  let result = tp.execute(protected_);

  // Восстанавливаем placeholders
  placeholders.forEach((content, index) => {
    result = result.replace(`\x00PLACEHOLDER_${index}\x00`, content);
  });

  return result;
}

/**
 * Универсальная функция типографирования
 * Выбирает правильный метод в зависимости от типа редактора
 */
export function applyTypograf(
  text: string,
  editorType: EditorType,
  locale: LocaleType,
): string {
  console.log("[Typograf:applyTypograf] Вход:", { text, editorType, locale });

  if (!text) {
    console.log("[Typograf:applyTypograf] Текст пустой, возвращаем как есть");
    return text;
  }

  let result: string;

  switch (editorType) {
    case "input":
    case "textarea":
      console.log("[Typograf:applyTypograf] Используем typografPlainText");
      result = typografPlainText(text, locale);
      break;
    case "wysiwyg":
      console.log("[Typograf:applyTypograf] Используем typografHtml");
      result = typografHtml(text, locale);
      break;
    case "markdown":
      console.log("[Typograf:applyTypograf] Используем typografMarkdown");
      result = typografMarkdown(text, locale);
      break;
    default:
      console.log("[Typograf:applyTypograf] Fallback на typografPlainText");
      result = typografPlainText(text, locale);
  }

  console.log("[Typograf:applyTypograf] Результат:", {
    input: text,
    output: result,
    changed: text !== result,
  });
  return result;
}
