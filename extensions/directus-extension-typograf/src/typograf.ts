import Typograf from "typograf";

export type EditorType = "input" | "textarea" | "wysiwyg" | "markdown";

/**
 * Все локали, поддерживаемые typograf
 */
export type LocaleType =
  | "be" // Belarusian
  | "bg" // Bulgarian
  | "ca" // Catalan
  | "cs" // Czech
  | "da" // Danish
  | "de" // German
  | "el" // Greek
  | "en-GB" // English, UK
  | "en-US" // English, US/Canada
  | "eo" // Esperanto
  | "es" // Spanish
  | "et" // Estonian
  | "fi" // Finnish
  | "fr" // French
  | "ga" // Irish
  | "hu" // Hungarian
  | "it" // Italian
  | "lv" // Latvian
  | "nl" // Dutch
  | "no" // Norwegian
  | "pl" // Polish
  | "ro" // Romanian
  | "ru" // Russian
  | "sk" // Slovak
  | "sl" // Slovenian
  | "sr" // Serbian
  | "sv" // Swedish
  | "tr" // Turkish
  | "uk"; // Ukrainian

export type LocaleOption = LocaleType | "auto";

/**
 * Маппинг языковых кодов Directus → typograf
 * Directus использует коды вида: ar-SA, en-US, ru-RU, de-DE и т.д.
 */
const LOCALE_MAP: Record<string, LocaleType> = {
  // Belarusian
  be: "be",
  "be-BY": "be",
  // Bulgarian
  bg: "bg",
  "bg-BG": "bg",
  // Catalan
  ca: "ca",
  "ca-ES": "ca",
  // Czech
  cs: "cs",
  "cs-CZ": "cs",
  // Danish
  da: "da",
  "da-DK": "da",
  // German
  de: "de",
  "de-DE": "de",
  "de-AT": "de",
  "de-CH": "de",
  // Greek
  el: "el",
  "el-GR": "el",
  // English
  en: "en-US",
  "en-US": "en-US",
  "en-CA": "en-US",
  "en-GB": "en-GB",
  "en-AU": "en-GB",
  "en-NZ": "en-GB",
  "en-IE": "en-GB",
  // Esperanto
  eo: "eo",
  // Spanish
  es: "es",
  "es-ES": "es",
  "es-MX": "es",
  "es-AR": "es",
  // Estonian
  et: "et",
  "et-EE": "et",
  // Finnish
  fi: "fi",
  "fi-FI": "fi",
  // French
  fr: "fr",
  "fr-FR": "fr",
  "fr-CA": "fr",
  "fr-BE": "fr",
  "fr-CH": "fr",
  // Irish
  ga: "ga",
  "ga-IE": "ga",
  // Hungarian
  hu: "hu",
  "hu-HU": "hu",
  // Italian
  it: "it",
  "it-IT": "it",
  "it-CH": "it",
  // Latvian
  lv: "lv",
  "lv-LV": "lv",
  // Dutch
  nl: "nl",
  "nl-NL": "nl",
  "nl-BE": "nl",
  // Norwegian
  no: "no",
  "no-NO": "no",
  nb: "no",
  "nb-NO": "no",
  nn: "no",
  "nn-NO": "no",
  // Polish
  pl: "pl",
  "pl-PL": "pl",
  // Romanian
  ro: "ro",
  "ro-RO": "ro",
  // Russian
  ru: "ru",
  "ru-RU": "ru",
  // Slovak
  sk: "sk",
  "sk-SK": "sk",
  // Slovenian
  sl: "sl",
  "sl-SI": "sl",
  // Serbian
  sr: "sr",
  "sr-RS": "sr",
  "sr-Latn": "sr",
  "sr-Cyrl": "sr",
  // Swedish
  sv: "sv",
  "sv-SE": "sv",
  // Turkish
  tr: "tr",
  "tr-TR": "tr",
  // Ukrainian
  uk: "uk",
  "uk-UA": "uk",
};

/**
 * Преобразует код языка из Directus в локаль typograf
 */
export function mapLanguageCode(
  langCode: string | null | undefined,
): LocaleType {
  if (!langCode) return "ru"; // fallback

  // Прямое соответствие
  const directMatch = LOCALE_MAP[langCode];
  if (directMatch) {
    return directMatch;
  }

  // Пробуем по префиксу (первые 2 символа)
  const prefix = langCode.split("-")[0]?.toLowerCase();
  const prefixMatch = prefix ? LOCALE_MAP[prefix] : undefined;
  if (prefixMatch) {
    return prefixMatch;
  }

  // Для неизвестных языков возвращаем en-US как нейтральный вариант
  // (русские правила могут сломать текст на других языках)
  console.warn(`[Typograf] Unknown language code: ${langCode}, using en-US`);
  return "en-US";
}

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
  if (!text) return text;
  const tp = createTypograf(locale);
  return tp.execute(text);
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
  if (!text) return text;

  switch (editorType) {
    case "input":
    case "textarea":
      return typografPlainText(text, locale);
    case "wysiwyg":
      return typografHtml(text, locale);
    case "markdown":
      return typografMarkdown(text, locale);
    default:
      return typografPlainText(text, locale);
  }
}
