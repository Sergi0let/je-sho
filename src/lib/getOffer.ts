
import { promises as fs } from "fs";
import path from "path";

export async function getOfferBySlugAndId(slug: string, id: string) {
  try {
    const filePath = path.join(process.cwd(), "public", "data", `${slug}.json`);
    const jsonData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offer = data.offers.find((offer: any) => offer.id === id);

    return offer || null;
  } catch (error) {
    console.error("Помилка при зчитуванні файлу або пошуку оффера:", error);
    return null;
  }
}
