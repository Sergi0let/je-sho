import sanitizeHtml from "sanitize-html";

const useCleanup = (content: string) => {
  const cleanDescription = sanitizeHtml(content || "Опис відсутній.", {
    allowedTags: ["p", "br"], // Дозволяємо лише <p> і <br>
    allowedAttributes: {}, // Видаляємо всі атрибути (включаючи style)
  });

  const descriptionLines = cleanDescription
    .split("</p>")
    .map((line: string) => line.replace("<p>", "").trim())
    .filter((line: string) => line !== "");

  const generalDescription: string[] = [];
  const measurements: { size: string; details: string[] }[] = [];
  let currentSize: { size: string; details: string[] } | null = null;

  descriptionLines.forEach((line: string) => {
    if (line.startsWith("Розмір")) {
      if (currentSize) {
        measurements.push(currentSize);
      }
      currentSize = { size: line, details: [] };
    } else if (currentSize) {
      currentSize.details.push(line);
    } else {
      generalDescription.push(line);
    }
  });
  if (currentSize) {
    measurements.push(currentSize);
  }

  return { generalDescription, measurements };
};

export default useCleanup;
