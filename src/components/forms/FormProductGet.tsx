"use client";

import { useState } from "react";

interface Props {
  onSuccess?: () => void; // функція яку викликаємо після успіху
}

const FormProductGet = ({ onSuccess }: Props) => {
  const [productUrl, setProductUrl] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) {
      alert("Введи URL, ледарю.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/create-xml-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productUrl: productUrl.trim(),
          productSlug: productSlug.trim(),
        }),
      });

      const result = await response.text();
      console.log(result);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Помилка при відправці:", error);
    } finally {
      setProductUrl("");
      setProductSlug("");
      setIsSubmitting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center space-y-6 bg-gray-50 py-16"
    >
      <div className="w-full max-w-2xl space-y-6 px-4">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <input
            type="text"
            name="productUrl"
            id="productUrl"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="Встав сюди XML посилання"
            className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-600 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            name="productSlug"
            id="productSlug"
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
            placeholder="Назва групи (slug)"
            className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-600 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isSubmitting} // Кнопка блокується тут
            className={`w-full transform rounded-lg px-8 py-3 font-medium shadow-md transition-colors duration-200 md:w-auto ${
              isSubmitting
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 text-white hover:scale-105 hover:bg-blue-700 active:scale-95 active:bg-blue-800"
            }`}
          >
            {isSubmitting ? (
              "Генеруємо..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Генеруємо
              </span>
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Вставте URL вашого XML файлу, не забудьте slug та натисніть кнопку для
          конвертації
        </p>
      </div>
    </form>
  );
};

export default FormProductGet;
