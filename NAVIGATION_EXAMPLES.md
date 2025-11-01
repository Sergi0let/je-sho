# Приклади навігації по URL на фронтенді

## Формат URL

URL продукту має формат: `/{slug}/{id}`

Де:

- `slug` = `feed_slug` з WordPress URL (наприклад: `odig_jinochiy_cholovichij_norma_batl_ua`)
- `id` = `product_id` з WordPress URL (наприклад: `442355`)

**Приклад:**

- WordPress URL: `https://ua.gopulse.click/order-form/?product_id=442355&feed_slug=odig_jinochiy_cholovichij_norma_batl_ua`
- Фронтенд URL: `/odig_jinochiy_cholovichij_norma_batl_ua/442355`

## Способи навігації

### 1. Використання Link компонента (Next.js) - РЕКОМЕНДОВАНО

```tsx
import Link from "next/link";
import { getProductUrl } from "@/lib/productUrl";

// Простий приклад
<Link href={`/${slug}/${id}`}>
  Перейти до товару
</Link>

// З використанням утиліти
<Link href={getProductUrl(slug, id)}>
  Перейти до товару
</Link>

// З WordPress URL
import { convertWordPressUrlToFrontendUrl } from "@/lib/productUrl";

const wordPressUrl = "https://ua.gopulse.click/order-form/?product_id=442355&feed_slug=odig_jinochiy_cholovichij_norma_batl_ua";
const frontendUrl = convertWordPressUrlToFrontendUrl(wordPressUrl);

{frontendUrl && (
  <Link href={frontendUrl}>
    Перейти до товару
  </Link>
)}
```

### 2. Програмна навігація з useRouter (Next.js)

```tsx
"use client";

import { useRouter } from "next/navigation";
import { getProductUrl } from "@/lib/productUrl";

function MyComponent() {
  const router = useRouter();

  const handleNavigate = (slug: string, id: string) => {
    router.push(getProductUrl(slug, id));
  };

  return (
    <button onClick={() => handleNavigate(slug, id)}>Перейти до товару</button>
  );
}
```

### 3. Використання window.location (для зовнішніх переходів або оновлення сторінки)

```tsx
import { getProductUrl } from "@/lib/productUrl";

function navigateToProduct(slug: string, id: string) {
  window.location.href = getProductUrl(slug, id);
  // або
  window.location.assign(getProductUrl(slug, id));
  // або для повного оновлення
  window.location.replace(getProductUrl(slug, id));
}
```

## Приклади використання в компонентах

### Приклад 1: Картка продукту (вже реалізовано в ProductCart.tsx)

```tsx
import Link from "next/link";

<Link href={`/${slug}/${id}`}>{/* Контент картки */}</Link>;
```

### Приклад 2: Кнопка з програмною навігацією

```tsx
"use client";

import { useRouter } from "next/navigation";

function ProductButton({ slug, id }: { slug: string; id: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/${slug}/${id}`)}
      className="rounded bg-blue-500 px-4 py-2 text-white"
    >
      Детальніше
    </button>
  );
}
```

### Приклад 3: Список продуктів

```tsx
import Link from "next/link";
import { getProductUrl } from "@/lib/productUrl";

function ProductList({
  products,
}: {
  products: Array<{ slug: string; id: string }>;
}) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={getProductUrl(product.slug, product.id)}>
            Товар {product.id}
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

## Роут структура

```
src/app/(root)/
  └── [slug]/
      └── [id]/
          └── page.tsx  <- Сторінка продукту
```

URL `/{slug}/{id}` автоматично передає параметри в `page.tsx`:

- `params.slug` - перший параметр
- `params.id` - другий параметр

## Важливо

- Завжди використовуйте `Link` компонент для внутрішніх переходів (швидше, без перезавантаження сторінки)
- `useRouter` використовуйте для програмної навігації після дій користувача
- `window.location` використовуйте тільки для зовнішніх переходів або коли потрібно повне оновлення сторінки
