/**
 * Утиліта для роботи з URL продуктів
 */

/**
 * Створює URL для сторінки продукту
 * @param slug - feed_slug з WordPress
 * @param id - product_id з WordPress
 * @returns URL для навігації у форматі /{slug}/{id}
 */
export function getProductUrl(slug: string, id: string): string {
  return `/${slug}/${id}`;
}

/**
 * Парсить WordPress URL і витягує slug та id
 * @param wordPressUrl - URL з WordPress типу https://ua.gopulse.click/order-form/?product_id=442355&feed_slug=odig_jinochiy_cholovichij_norma_batl_ua
 * @returns об'єкт з slug та id, або null якщо не вдалося розпарсити
 */
export function parseWordPressUrl(
  wordPressUrl: string,
): { slug: string; id: string } | null {
  try {
    const url = new URL(wordPressUrl);
    const productId = url.searchParams.get("product_id");
    const feedSlug = url.searchParams.get("feed_slug");

    if (!productId || !feedSlug) {
      return null;
    }

    return {
      slug: feedSlug,
      id: productId,
    };
  } catch {
    return null;
  }
}

/**
 * Конвертує WordPress URL у URL для фронтенду
 * @param wordPressUrl - URL з WordPress
 * @returns URL для навігації на фронтенді, або null якщо не вдалося розпарсити
 */
export function convertWordPressUrlToFrontendUrl(
  wordPressUrl: string,
): string | null {
  const parsed = parseWordPressUrl(wordPressUrl);
  if (!parsed) {
    return null;
  }
  return getProductUrl(parsed.slug, parsed.id);
}
