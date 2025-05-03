/* eslint-disable @typescript-eslint/no-explicit-any */
import { OutputData, ParentProduct, Variant } from "@/types";
import { XMLParser } from "fast-xml-parser";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { productUrl, productSlug, title } = await req.json();

    if (!productUrl || !productSlug || !title) {
      return new Response("Missing productUrl, productSlug or title", {
        status: 400,
      });
    }

    // Очищення URL від лапок
    const cleanedUrl = productUrl.replace(/^"+|"+$/g, "");

    // Завантаження XML
    const response = await fetch(cleanedUrl);
    if (!response.ok) {
      return new Response("Failed to fetch XML", { status: 500 });
    }

    const xmlData = await response.text();

    // Парсинг XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      allowBooleanAttributes: true,
    });

    const jsonObj = parser.parse(xmlData);
    const offers = jsonObj?.yml_catalog?.shop?.offers?.offer;

    if (!offers) {
      return new Response("Offers not found in XML", { status: 500 });
    }

    // Перетворюємо в масив, якщо один елемент
    const offersArray = Array.isArray(offers) ? offers : [offers];

    // Фільтруємо доступні товари
    const availableOffers = offersArray.filter(
      (offer) => offer.available !== "false",
    );

    // Групування за group_id
    const groupedByGroupId: Record<string, any[]> = {};
    const noGroupIdOffers: any[] = [];

    availableOffers.forEach((offer) => {
      if (offer.group_id) {
        if (!groupedByGroupId[offer.group_id]) {
          groupedByGroupId[offer.group_id] = [];
        }
        groupedByGroupId[offer.group_id].push(offer);
      } else {
        noGroupIdOffers.push(offer);
      }
    });

    // Обробка товарів із group_id
    const parentProducts: ParentProduct[] = [];

    for (const groupId in groupedByGroupId) {
      const groupOffers = groupedByGroupId[groupId];

      // Знаходимо найменший id для батьківського товару
      const minIdOffer = groupOffers.reduce((min, offer) =>
        parseInt(offer.id) < parseInt(min.id) ? offer : min,
      );

      // Формуємо назву батьківського товару (видаляємо специфічні атрибути)
      let parentTitle = minIdOffer.name;
      const attributesToRemove = groupOffers.flatMap((offer) =>
        (offer.param || []).map((p: any) => p["#text"]),
      );
      attributesToRemove.forEach((attr: string) => {
        parentTitle = parentTitle.replace(attr, "").trim();
      });

      // Створюємо батьківський товар
      const parentProduct: ParentProduct = {
        id: minIdOffer.id,
        title: parentTitle,
        description: minIdOffer.description || "",
        mainPicture: minIdOffer.picture || "",
        variants: [],
      };

      // Обробка варіантів
      groupOffers.forEach((offer) => {
        const attributes: Record<string, string> = {};

        // Витягуємо атрибути з param
        if (offer.param) {
          const params = Array.isArray(offer.param)
            ? offer.param
            : [offer.param];
          params.forEach((param: any) => {
            attributes[param.name] = param["#text"];
          });
        }

        // Якщо param відсутній, витягуємо з name
        if (!offer.param && offer.name !== parentTitle) {
          const diff = offer.name.replace(parentTitle, "").trim();
          if (diff) {
            attributes["Варіант"] = diff; // Наприклад, "60 шт" або "Білий"
          }
        }

        const variant: Variant = {
          title: offer.name,
          offerId: offer.id,
          attributes,
          price: parseFloat(offer.price) || 0,
          oldprice: parseFloat(offer.oldprice) || 0,
          quantity: parseInt(offer.quantity) || 0,
          picture: offer.picture || parentProduct.mainPicture,
          barcode: offer.barcode || undefined,
          dimensions: offer.dimensions || undefined,
          weight: offer.weight || undefined,
        };

        parentProduct.variants.push(variant);
      });

      parentProducts.push(parentProduct);
    }

    // Обробка товарів без group_id (групування за схожістю name та description)
    const groupedByName: Record<string, any[]> = {};
    noGroupIdOffers.forEach((offer) => {
      const key = `${offer.name}|${offer.description || ""}`;
      if (!groupedByName[key]) {
        groupedByName[key] = [];
      }
      groupedByName[key].push(offer);
    });

    for (const key in groupedByName) {
      const groupOffers = groupedByName[key];
      const minIdOffer = groupOffers[0]; // Беремо перший як батьківський

      const parentProduct: ParentProduct = {
        id: minIdOffer.id,
        title: minIdOffer.name,
        description: minIdOffer.description || "",
        mainPicture: minIdOffer.picture || "",
        variants: [],
      };

      groupOffers.forEach((offer) => {
        const attributes: Record<string, string> = {};

        // Витягуємо атрибути з param або name
        if (offer.param) {
          const params = Array.isArray(offer.param)
            ? offer.param
            : [offer.param];
          params.forEach((param: any) => {
            attributes[param.name] = param["#text"];
          });
        }

        const variant: Variant = {
          oldprice: parseFloat(offer.oldprice) || 0,
          title: offer.name,
          offerId: offer.id,
          attributes,
          price: parseFloat(offer.price) || 0,
          quantity: parseInt(offer.quantity) || 0,
          picture: offer.picture || parentProduct.mainPicture,
          barcode: offer.barcode || undefined,
          dimensions: offer.dimensions || undefined,
          weight: offer.weight || undefined,
        };

        parentProduct.variants.push(variant);
      });

      parentProducts.push(parentProduct);
    }

    // Формуємо вихідні дані
    const outputData: OutputData = {
      groupTitle: title,
      updatedAt: new Date().toISOString(),
      parentProducts,
    };

    // Зберігаємо у файл
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      `${productSlug}.json`,
    );
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(outputData, null, 2), "utf8");

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.error("Error parsing or saving:", error);
    return new Response(`Webhook error: ${error}`, { status: 400 });
  }
}

// import { XMLParser } from "fast-xml-parser";
// import { promises as fs } from "fs";
// import path from "path";

// export async function POST(req: Request) {
//   try {
//     const { productUrl, productSlug, title } = await req.json();
//     console.log("RouteCreate: ", productUrl, productSlug, title);

//     if (!productUrl || !productSlug || !title) {
//       return new Response("Missing productUrl", { status: 400 });
//     }

//     const cleanedUrl = productUrl.replace(/^"+|"+$/g, "");

//     const response = await fetch(cleanedUrl);

//     if (!response.ok) {
//       return new Response("Failed to fetch XML", { status: 500 });
//     }

//     const xmlData = await response.text();

//     const parser = new XMLParser({
//       ignoreAttributes: false,
//       attributeNamePrefix: "",
//     });

//     const jsonObj = parser.parse(xmlData);

//     const offers = jsonObj?.yml_catalog?.shop?.offers?.offer;

//     if (!offers) {
//       return new Response("Offers not found in XML", { status: 500 });
//     }

//     // Завжди масив
//     const offersArray = Array.isArray(offers) ? offers : [offers];

//     // Фільтруємо: беремо тільки доступні товари
//     const availableOffers = offersArray.filter(
//       (offer) => offer.available !== "false",
//     );

//     const outputData = {
//       groupTitle: title,
//       updatedAt: new Date().toISOString(),
//       offers: availableOffers,
//     };

//     const filePath = path.join(
//       process.cwd(),
//       "public",
//       "data",
//       `${productSlug}.json`,
//     );
//     // Записуємо файл
//     await fs.mkdir(path.dirname(filePath), { recursive: true });

//     await fs.writeFile(filePath, JSON.stringify(outputData, null, 2), "utf8");

//     return new Response("Success", { status: 200 });
//   } catch (error) {
//     console.error("Error parsing or saving:", error);
//     return new Response(`Webhook error: ${error}`, { status: 400 });
//   }
// }
