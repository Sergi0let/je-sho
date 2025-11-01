"use client";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Адмін-панель</h1>
        <p className="text-gray-600">
          Дані продуктів тепер отримуються безпосередньо з WordPress REST API.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Endpoint:{" "}
          <code className="rounded bg-gray-100 px-2 py-1">
            /wp-json/nt/v1/feed/{"{feed_slug}"}/product/{"{product_id}"}
          </code>
        </p>
      </div>
    </main>
  );
}
