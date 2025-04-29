import { XMLParser } from "fast-xml-parser";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { productUrl, productSlug } = await req.json();
    console.log("RouteCreate: ", productUrl, productSlug);

    if (!productUrl || !productSlug) {
      return new Response("Missing productUrl", { status: 400 });
    }

    const cleanedUrl = productUrl.replace(/^"+|"+$/g, "");

    const response = await fetch(cleanedUrl);

    if (!response.ok) {
      return new Response("Failed to fetch XML", { status: 500 });
    }

    const xmlData = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });

    const jsonObj = parser.parse(xmlData);

    const offers = jsonObj?.yml_catalog?.shop?.offers?.offer;

    if (!offers) {
      return new Response("Offers not found in XML", { status: 500 });
    }

    // Завжди масив
    const offersArray = Array.isArray(offers) ? offers : [offers];

    // Фільтруємо: беремо тільки доступні товари
    const availableOffers = offersArray.filter(
      (offer) => offer.available !== "false",
    );

    const outputData = {
      updatedAt: new Date().toISOString(),
      offers: availableOffers,
    };

    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      `${productSlug}.json`,
    );
    // Записуємо файл
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    await fs.writeFile(filePath, JSON.stringify(outputData, null, 2), "utf8");

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.error("Error parsing or saving:", error);
    return new Response(`Webhook error: ${error}`, { status: 400 });
  }
}
