import { IRandomProduct, OutputData, ParentProduct } from "@/types";
import { promises as fs } from "fs";
import path from "path";

// Інтерфейс для вихідних даних
// interface Variant {
//   title: string;
//   offerId: string;
//   attributes: Record<string, string>;
//   price: number;
//   quantity: number;
//   picture: string;
//   barcode?: string;
//   dimensions?: string;
//   oldprice: number;
//   weight?: string;
// }

// interface ParentProduct {
//   id: string;
//   title: string;
//   description: string;
//   mainPicture: string;
//   variants: Variant[];
//   selectedVariant?: Variant; // Обраний варіант
// }

export async function getOfferAndVariants(
  slug: string,
  id: string,
): Promise<ParentProduct | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", `${slug}.json`);

    const jsonData = await fs.readFile(filePath, "utf-8");
    const data: OutputData = JSON.parse(jsonData);

    const randomProduct = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * data.parentProducts.length - 1),
    );

    const randomProductData: IRandomProduct[] = randomProduct
      .map((id) => {
        const offerRandom = data.parentProducts.find(
          (_, index) => index === id,
        );

        if (!offerRandom) return undefined;

        return {
          id: offerRandom.id,
          title: offerRandom.title,
          imgUrl: offerRandom.mainPicture[0],
          price: offerRandom.variants[0].price,
          oldprice: offerRandom.variants[0].oldprice,
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
      `Error reading or parsing JSON for slug ${slug}, id ${id}:`,
      error,
    );
    return null;
  }
}
// import { promises as fs } from "fs";
// import path from "path";

// // Тип для пропозиції
// interface Offer {
//   id: string;
//   name: string; // Буде першим елементом масиву name або groupTitle
//   price: number;
//   oldprice?: number;
//   picture: string[]; // Завжди масив валідних рядків
//   description: string;
//   vendorCode: string;
//   param: Array<{ name: string; "#text": string }>;
//   // [key: string]: any; // Для додаткових полів (ОГ, ОТ, ОС тощо)
// }

// // Тип для JSON
// interface JsonData {
//   groupTitle: string;
//   updatedAt: string;
//   offers: Offer[];
// }

// export async function getOfferBySlugAndId(
//   slug: string,
//   id: string,
// ): Promise<Offer | null> {
//   try {
//     const filePath = path.join(process.cwd(), "public", "data", `${slug}.json`);
//     const jsonData = await fs.readFile(filePath, "utf-8");
//     const data: JsonData = JSON.parse(jsonData);

//     const offer = data.offers.find((offer) => offer.id === id);
//     if (!offer) {
//       console.warn(`Offer with id ${id} not found in slug ${slug}`);
//       return null;
//     }

//     // Обробляємо name (масив у JSON) і picture
//     const validPictures = Array.isArray(offer.picture)
//       ? offer.picture.filter(
//           (pic) => typeof pic === "string" && pic.trim() !== "",
//         )
//       : typeof offer.picture === "string" && offer.picture !== ""
//         ? [offer.picture]
//         : [];

//     return {
//       ...offer,
//       name: Array.isArray(offer.name)
//         ? offer.name[0] || data.groupTitle || "Товар без назви"
//         : offer.name || data.groupTitle || "Товар без назви",
//       picture: validPictures,
//     };
//   } catch (error) {
//     console.error(
//       `Error reading or parsing JSON for slug ${slug}, id ${id}:`,
//       error,
//     );
//     return null;
//   }
// }

// import { promises as fs } from "fs";
// import path from "path";

// export async function getOfferBySlugAndId(slug: string, id: string) {
//   try {
//     const filePath = path.join(process.cwd(), "public", "data", `${slug}.json`);
//     const jsonData = await fs.readFile(filePath, "utf-8");
//     const data = JSON.parse(jsonData);

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const offer = data.offers.find((offer: any) => offer.id === id);

//     return offer || null;
//   } catch (error) {
//     console.error("Помилка при зчитуванні файлу або пошуку оффера:", error);
//     return null;
//   }
// }
