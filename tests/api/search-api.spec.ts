
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';

test('POST search products returns matching products', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const searchTerm = 'top';

  const response = await apiClient.searchProducts(searchTerm);

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products.length).toBeGreaterThan(0);

expect(
  body.products.some((product: { name: string }) =>
    product.name.toLowerCase().includes(searchTerm)
  )
).toBe(true);


  for (const product of body.products) {
    expect(product.id).toEqual(expect.any(Number));
    expect(product.id).toBeGreaterThan(0);

    expect(product.name).toEqual(expect.any(String));

    expect(product.price).toEqual(expect.any(String));
    expect(product.price.trim().length).toBeGreaterThan(0);
  }
});


test('POST search products without search parameter returns 400', async ({ request }) => {
  const apiClient = new ApiClient(request);

  const response = await apiClient.searchProductsWithoutParameter();

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(400);
  expect(body.message).toBe(
    'Bad request, search_product parameter is missing in POST request.'
  );
});

