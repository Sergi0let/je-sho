const WORDPRESS_BASE_URL = "https://ua.gopulse.click/wp-json/nt/v1/feed";

interface WordPressProductParams {
  product_id: string;
  feed_slug: string;
}

/**
 * Функція для отримання даних продукту з WordPress REST API
 * @param product_id - ID продукту
 * @param feed_slug - Slug для feed
 * @returns Promise з даними продукту або null при помилці
 */
export async function fetchWordPressProduct({
  product_id,
  feed_slug,
}: WordPressProductParams): Promise<unknown> {
  try {
    // Формат: /wp-json/nt/v1/feed/{feed_slug}/product/{product_id}
    const url = new URL(
      `${WORDPRESS_BASE_URL}/${feed_slug}/product/${product_id}`,
    );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store", // Для динамічних даних
    });

    if (!response.ok) {
      console.error(
        `WordPress API error: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`WordPress API returned non-JSON content: ${contentType}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching WordPress product:", error);
    return null;
  }
}
