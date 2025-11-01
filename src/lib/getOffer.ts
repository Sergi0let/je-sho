import { IRandomProduct, OutputData, ParentProduct, Variant } from "@/types";
import { fetchWordPressProduct } from "./fetchWordPressProduct";

// Інтерфейс для продукту з WordPress (як example.json)
interface WordPressProduct {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  price: string;
  image_link: string;
  additional_images?: string[];
  characteristics?: string[];
  link?: string;
  category?: string;
}

/**
 * Парсить ціну з рядка типу "499.00 UAH"
 */
function parsePrice(priceString: string): number {
  const match = priceString?.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

/**
 * Парсить характеристики з масиву рядків типу "Колір: Чорний"
 */
function parseCharacteristics(
  characteristics?: string[],
): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (!characteristics) return attrs;

  characteristics.forEach((char) => {
    const match = char.match(/^(.+?):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      attrs[key.trim()] = value.trim();
    }
  });

  return attrs;
}

/**
 * Групує продукти за базовою назвою (без розміру/кольору)
 */
function groupProductsByBaseName(
  products: WordPressProduct[],
): Map<string, WordPressProduct[]> {
  const groups = new Map<string, WordPressProduct[]>();

  products.forEach((product) => {
    // Видаляємо розміри та кольори з назви для групування
    const baseTitle = product.title
      .replace(/\s*(?:розмір\s*)?\d+[\/\-]\d+/gi, "")
      .replace(/\s*(?:кольор|колір|кольору|кольорові):\s*[\w\s]+/gi, "")
      .replace(/\s*(?:білого|чорного|молочного)\s*кольору/gi, "")
      .trim();

    if (!groups.has(baseTitle)) {
      groups.set(baseTitle, []);
    }
    groups.get(baseTitle)!.push(product);
  });

  return groups;
}

/**
 * Трансформує дані з WordPress (масив) в формат OutputData
 */
function transformWordPressDataToOutputData(
  products: WordPressProduct[],
  currentProduct: WordPressProduct,
): OutputData {
  const groups = groupProductsByBaseName(products);
  const parentProducts: ParentProduct[] = [];

  groups.forEach((groupProducts) => {
    // Знаходимо основний продукт (перший в групі або поточний)
    const mainProduct =
      groupProducts.find((p) => p.id === currentProduct.id) || groupProducts[0];

    // Формуємо основні зображення
    const mainImages = [
      mainProduct.image_link,
      ...(mainProduct.additional_images || []),
    ].filter((img) => img && img.trim() !== "");

    // Створюємо варіанти з усіх продуктів в групі
    const variants: Variant[] = groupProducts.map((product) => {
      const attributes = parseCharacteristics(product.characteristics);
      const price = parsePrice(product.price);

      // Формуємо зображення для варіанту
      const variantImages = [
        product.image_link,
        ...(product.additional_images || []),
      ].filter((img) => img && img.trim() !== "");

      return {
        title: product.title,
        offerId: product.id,
        attributes,
        price,
        oldprice: 0, // WordPress не надає стару ціну в example.json форматі
        quantity: 1, // За замовчуванням, якщо не вказано
        picture: variantImages[0] || mainImages[0] || "",
      };
    });

    const parentProduct: ParentProduct = {
      id: mainProduct.id,
      title: mainProduct.title,
      description: mainProduct.description || "",
      mainPicture: mainImages[0] || "",
      variants,
      randomProductData: [], // Буде заповнено пізніше
    };

    parentProducts.push(parentProduct);
  });

  return {
    groupTitle: products[0]?.category || "Категорія",
    updatedAt: new Date().toISOString(),
    parentProducts,
  };
}

/**
 * Трансформує один продукт з WordPress в формат OutputData
 */
function transformSingleWordPressProduct(
  product: WordPressProduct,
): OutputData {
  const attributes = parseCharacteristics(product.characteristics);
  const price = parsePrice(product.price);

  const images = [
    product.image_link,
    ...(product.additional_images || []),
  ].filter((img) => img && img.trim() !== "");

  const variant: Variant = {
    title: product.title,
    offerId: product.id,
    attributes,
    price,
    oldprice: 0,
    quantity: 1,
    picture: images[0] || "",
  };

  const parentProduct: ParentProduct = {
    id: product.id,
    title: product.title,
    description: product.description || "",
    mainPicture: images[0] || "",
    variants: [variant],
    randomProductData: [],
  };

  return {
    groupTitle: product.category || "Категорія",
    updatedAt: new Date().toISOString(),
    parentProducts: [parentProduct],
  };
}

export async function getOfferAndVariants(
  slug: string,
  id: string,
): Promise<ParentProduct | null> {
  try {
    // Отримуємо дані з WordPress REST API
    const wordPressData = await fetchWordPressProduct({
      product_id: id,
      feed_slug: slug,
    });

    if (!wordPressData) {
      console.warn(
        `Failed to fetch product from WordPress for slug ${slug}, id ${id}`,
      );
      return null;
    }

    // Перетворюємо дані з WordPress в формат OutputData
    // Якщо WordPress повертає готову структуру OutputData
    let data: OutputData;

    // Перевіряємо чи це OutputData структура
    if (
      typeof wordPressData === "object" &&
      wordPressData !== null &&
      "parentProducts" in wordPressData
    ) {
      // Якщо WordPress повертає готову структуру OutputData
      data = wordPressData as OutputData;
    } else if (Array.isArray(wordPressData)) {
      // Якщо WordPress повертає масив продуктів (як example.json)
      // Знаходимо поточний продукт і формуємо структуру
      const currentProduct = wordPressData.find(
        (product): product is WordPressProduct =>
          typeof product === "object" &&
          product !== null &&
          "id" in product &&
          product.id === id,
      );

      if (!currentProduct) {
        console.warn(
          `Product with id ${id} not found in WordPress response for slug ${slug}`,
        );
        return null;
      }

      // Трансформуємо дані з WordPress формату в наш формат
      data = transformWordPressDataToOutputData(
        wordPressData as WordPressProduct[],
        currentProduct,
      );
    } else if (
      typeof wordPressData === "object" &&
      wordPressData !== null &&
      "id" in wordPressData &&
      "title" in wordPressData
    ) {
      // Якщо WordPress повертає один продукт
      data = transformSingleWordPressProduct(wordPressData as WordPressProduct);
    } else {
      console.warn(
        `Unexpected WordPress data format for slug ${slug}, id ${id}`,
      );
      return null;
    }

    const randomProduct = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * data.parentProducts.length - 1),
    );

    const randomProductData: IRandomProduct[] = randomProduct
      .map((id) => {
        const offerRandom = data.parentProducts.find(
          (_, index) => index === id,
        );

        if (!offerRandom) return undefined;

        const mainPicture =
          typeof offerRandom.mainPicture === "string"
            ? offerRandom.mainPicture
            : Array.isArray(offerRandom.mainPicture)
              ? offerRandom.mainPicture[0] || ""
              : "";

        return {
          id: offerRandom.id,
          title: offerRandom.title,
          imgUrl: mainPicture,
          price: offerRandom.variants[0]?.price || 0,
          oldprice: offerRandom.variants[0]?.oldprice || 0,
        };
      })
      .filter((p): p is IRandomProduct => p !== undefined);

    const offer = data.parentProducts.find((offer) => offer.id === id);
    if (!offer) {
      console.warn(`Offer with id ${id} not found in slug ${slug}`);
      return null;
    }
    const validPictures = Array.isArray(offer.mainPicture)
      ? offer.mainPicture.filter(
          (pic) => typeof pic === "string" && pic.trim() !== "",
        )
      : typeof offer.mainPicture === "string" && offer.mainPicture.trim() !== ""
        ? [offer.mainPicture]
        : [];

    // Обробляємо назву
    const name = Array.isArray(offer.title)
      ? offer.title[0] || data.groupTitle || "Товар без назви"
      : offer.title || data.groupTitle || "Товар без назви";

    const selectedVariant = offer.variants[0];

    return {
      ...offer,
      title: name,
      mainPicture:
        validPictures.length > 0
          ? validPictures[0]
          : "/assets/img/placeholder.png",
      variants: offer.variants.map((variant) => ({
        ...variant,
        picture:
          variant.picture || validPictures[0] || "/assets/img/placeholder.png",
        attributes: variant.attributes || {},
        price: variant.price || 0,
        quantity: variant.quantity || 0,
      })),
      selectedVariant,
      randomProductData,
    };
  } catch (error) {
    console.error(
      `Error fetching or processing WordPress data for slug ${slug}, id ${id}:`,
      error,
    );
    return null;
  }
}
