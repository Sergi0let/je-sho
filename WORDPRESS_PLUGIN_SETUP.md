# Налаштування WordPress плагіна для JSON API

## Проблема

WordPress повертає HTML замість JSON при запиті до `/order-form/?product_id=442355&feed_slug=odig_jinochiy_cholovichij_norma_batl_ua`.

## Рішення

Потрібно створити WordPress плагін або REST API endpoint, який буде повертати JSON дані про продукт.

## Варіанти реалізації

### Варіант 1: REST API Endpoint (Рекомендовано)

Створіть кастомний REST API endpoint у WordPress:

```php
<?php
/**
 * Plugin Name: Product JSON API
 * Description: Додає REST API endpoint для отримання даних продуктів у JSON форматі
 * Version: 1.0.0
 */

add_action('rest_api_init', function () {
    register_rest_route('gopulse/v1', '/order-form', array(
        'methods' => 'GET',
        'callback' => 'get_product_data',
        'permission_callback' => '__return_true',
    ));
});

function get_product_data($request) {
    $product_id = $request->get_param('product_id');
    $feed_slug = $request->get_param('feed_slug');

    if (!$product_id || !$feed_slug) {
        return new WP_Error('missing_params', 'Product ID and feed slug are required', array('status' => 400));
    }

    // Отримуємо дані продукту (приклад з WooCommerce)
    // Або ваша власна логіка отримання продукту
    $product = wc_get_product($product_id);

    if (!$product) {
        return new WP_Error('product_not_found', 'Product not found', array('status' => 404));
    }

    // Формуємо відповідь у потрібному форматі
    $response = array(
        'id' => $product->get_id(),
        'title' => $product->get_name(),
        'description' => $product->get_description(),
        'price' => $product->get_price(),
        'image_link' => wp_get_attachment_image_url($product->get_image_id(), 'full'),
        'additional_images' => get_product_gallery_images($product),
        'characteristics' => get_product_attributes($product),
        'link' => $product->get_permalink(),
    );

    return rest_ensure_response($response);
}

function get_product_gallery_images($product) {
    $image_ids = $product->get_gallery_image_ids();
    $images = array();

    foreach ($image_ids as $image_id) {
        $images[] = wp_get_attachment_image_url($image_id, 'full');
    }

    return $images;
}

function get_product_attributes($product) {
    $attributes = array();
    $product_attributes = $product->get_attributes();

    foreach ($product_attributes as $attribute) {
        $attributes[] = $attribute->get_name() . ': ' . implode(', ', $attribute->get_options());
    }

    return $attributes;
}
```

**Використання:**

- URL: `https://ua.gopulse.click/wp-json/gopulse/v1/order-form?product_id=442355&feed_slug=odig_jinochiy_cholovichij_norma_batl_ua`

### Варіант 2: Кастомний PHP Endpoint

Створіть файл `wp-content/themes/your-theme/api/product.php`:

```php
<?php
/**
 * Template Name: Product API
 */

header('Content-Type: application/json');

$product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;
$feed_slug = isset($_GET['feed_slug']) ? sanitize_text_field($_GET['feed_slug']) : '';

if (!$product_id || !$feed_slug) {
    wp_send_json_error(array('message' => 'Product ID and feed slug are required'), 400);
    exit;
}

// Отримуємо дані продукту
$product = wc_get_product($product_id);

if (!$product) {
    wp_send_json_error(array('message' => 'Product not found'), 404);
    exit;
}

// Формуємо відповідь
$response = array(
    'id' => (string) $product->get_id(),
    'title' => $product->get_name(),
    'description' => $product->get_description(),
    'price' => number_format((float) $product->get_price(), 2, '.', '') . ' UAH',
    'image_link' => wp_get_attachment_image_url($product->get_image_id(), 'full'),
    'additional_images' => get_product_gallery($product),
    'characteristics' => format_product_attributes($product),
    'link' => $product->get_permalink(),
);

wp_send_json_success($response);

function get_product_gallery($product) {
    $image_ids = $product->get_gallery_image_ids();
    $images = array();

    foreach ($image_ids as $image_id) {
        $images[] = wp_get_attachment_image_url($image_id, 'full');
    }

    return $images;
}

function format_product_attributes($product) {
    $attributes = array();
    $product_attributes = $product->get_attributes();

    foreach ($product_attributes as $attribute_name => $attribute) {
        if ($attribute->is_taxonomy()) {
            $terms = wp_get_post_terms($product->get_id(), $attribute_name);
            $values = array();
            foreach ($terms as $term) {
                $values[] = $term->name;
            }
            $attributes[] = $attribute->get_name() . ': ' . implode(', ', $values);
        } else {
            $values = $attribute->get_options();
            $attributes[] = $attribute->get_name() . ': ' . implode(', ', $values);
        }
    }

    return $attributes;
}
```

### Варіант 3: Модифікація існуючого endpoint

Якщо у вас вже є endpoint `/order-form/`, додайте перевірку на параметр `format=json`:

```php
// У вашій функції обробки /order-form/
if (isset($_GET['format']) && $_GET['format'] === 'json') {
    header('Content-Type: application/json');
    wp_send_json($product_data);
    exit;
}
```

Тоді Next.js буде запитувати:

- URL: `https://ua.gopulse.click/order-form/?product_id=442355&feed_slug=odig_jinochiy_cholovichij_norma_batl_ua&format=json`

## Оновлення Next.js коду

Після налаштування WordPress endpoint, оновіть URL у `fetchWordPressProduct.ts`:

```typescript
// Для REST API
const WORDPRESS_BASE_URL =
  "https://ua.gopulse.click/wp-json/gopulse/v1/order-form";

// Або для кастомного endpoint з параметром format
const WORDPRESS_BASE_URL = "https://ua.gopulse.click/order-form";
// Додайте параметр format=json у fetchWordPressProduct
```

## Формат даних, який очікує Next.js

Next.js очікує один з наступних форматів:

### Формат 1: Масив продуктів (як example.json)

```json
[
  {
    "id": "442355",
    "title": "Назва продукту",
    "description": "Опис продукту",
    "price": "499.00 UAH",
    "image_link": "http://example.com/image.jpg",
    "additional_images": ["http://example.com/image2.jpg"],
    "characteristics": ["Колір: Чорний", "Розмір: XL"],
    "link": "https://ua.gopulse.click/order-form?product_id=442355&feed_slug=...",
    "category": "Категорія"
  }
]
```

### Формат 2: Структура OutputData

```json
{
  "groupTitle": "Категорія",
  "updatedAt": "2025-01-27T10:00:00.000Z",
  "parentProducts": [
    {
      "id": "442355",
      "title": "Назва продукту",
      "description": "Опис",
      "mainPicture": "http://example.com/image.jpg",
      "variants": [
        {
          "title": "Назва варіанту",
          "offerId": "442355",
          "attributes": { "Колір": "Чорний", "Розмір": "XL" },
          "price": 499,
          "oldprice": 0,
          "quantity": 1,
          "picture": "http://example.com/image.jpg"
        }
      ]
    }
  ]
}
```

## Поточна поведінка

Зараз Next.js має **fallback механізм**:

1. Спочатку пробує отримати дані з WordPress
2. Якщо WordPress повертає HTML (не JSON) - використовує локальні JSON файли з `public/data/{slug}.json`
3. Це забезпечує роботу додатку поки не налаштований WordPress endpoint

## Тестування

Після налаштування плагіна, перевірте:

```bash
curl "https://ua.gopulse.click/wp-json/gopulse/v1/order-form?product_id=442355&feed_slug=odig_jinochiy_cholovichij_norma_batl_ua"
```

Або в браузері відкрийте URL і переконайтеся, що повертається JSON, а не HTML.
