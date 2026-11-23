import { test, expect, APIRequestContext } from "@playwright/test";
import { ApiClient } from "../../helpers/api-client";

const baseUrl = "https://automationexercise.com/api";

const password = "Test123456";

// Generate unique test email
function generateEmail(): string {
  return `milos.autoqa.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@test.com`;
}

// Create reusable test account
async function createAccount(
  request: APIRequestContext,
  email: string,
): Promise<void> {
  const apiClient = new ApiClient(request);

  const response = await apiClient.createAccount({
    name: "Milos AutoQA",
    email,
    password,
    title: "Mr",
    birth_date: "10",
    birth_month: "10",
    birth_year: "1990",
    firstname: "Milos",
    lastname: "Sreckovic",
    company: "QA Test Company",
    address1: "Test Address 1",
    address2: "Test Address 2",
    country: "Serbia",
    zipcode: "11000",
    state: "Belgrade",
    city: "Belgrade",
    mobile_number: "0601234567",
  });

  if (response.status() === 503) {
    console.warn("CREATE returned HTTP 503. Checking account status.");

    const userResponse = await apiClient.getUserByEmail(email);

    expect(userResponse.status()).toBe(200);

    const userBody = await userResponse.json();

    if (userBody.responseCode === 200) {
      expect(userBody.user).toBeDefined();
      expect(userBody.user.email).toBe(email);

      console.warn("Account creation confirmed despite HTTP 503.");

      return;
    }

    throw new Error(`Account creation failed with HTTP 503. Email: ${email}`);
  }

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(201);
  expect(body.message).toBe("User created!");
}

// Delete reusable test account
async function deleteAccount(
  request: APIRequestContext,
  email: string,
): Promise<void> {
  const apiClient = new ApiClient(request);

  const response = await apiClient.deleteAccount(email, password);

  if (response.status() === 503) {
    console.warn("DELETE returned HTTP 503. Checking account status.");

    const userResponse = await apiClient.getUserByEmail(email);

    expect(userResponse.status()).toBe(200);

    const userBody = await userResponse.json();

    if (userBody.responseCode === 404) {
      console.log("Account is already deleted.");
      return;
    }

    throw new Error(
      `Account cleanup failed: DELETE returned 503 and account still exists. Email: ${email}`,
    );
  }

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(body.message).toBe("Account deleted!");
}

// Negative login test - no account required
test("POST verify negative login without email and password", async ({
  request,
}) => {
  const apiClient = new ApiClient(request);
  const response = await apiClient.verifyLogin();

  console.log("HTTP STATUS:", response.status());
  console.log("RESPONSE BODY:", (await response.text()).slice(0, 500));

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(400);
  expect(body.message).toBe(
    "Bad request, email or password parameter is missing in POST request.",
  );
});

// Independent account creation test
test("POST create account", async ({ request }) => {
  const email = generateEmail();
  let accountCreated = false;

  try {
    await createAccount(request, email);
    accountCreated = true;
  } finally {
    if (accountCreated) {
      await deleteAccount(request, email);
    }
  }
});

// Independent valid login test
test("POST verify login with valid credentials", async ({ request }) => {
  const email = generateEmail();
  let accountCreated = false;

  try {
    await createAccount(request, email);
    accountCreated = true;

    const apiClient = new ApiClient(request);

    const response = await apiClient.verifyLogin(email, password);

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("User exists!");
  } finally {
    if (accountCreated) {
      await deleteAccount(request, email);
    }
  }
});

// Independent account deletion test
test("DELETE account", async ({ request }) => {
  const email = generateEmail();

  await createAccount(request, email);

  await deleteAccount(request, email);
});

test("POST verify login with non-existing credentials", async ({ request }) => {
  const apiClient = new ApiClient(request);

  const email = generateEmail();
  const invalidPassword = "InvalidPassword123!";

  const response = await apiClient.verifyLogin(email, invalidPassword);

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(404);
  expect(body.message).toBe("User not found!");
});

test("GET user details with non-existing email", async ({ request }) => {
  const apiClient = new ApiClient(request);
  const email = generateEmail();

  const response = await apiClient.getUserByEmail(email);

  console.log("GET USER HTTP STATUS:", response.status());
  console.log("GET USER RESPONSE:", await response.text());

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(404);
});

test("GET user details with existing email", async ({ request }) => {
  const apiClient = new ApiClient(request);
  const email = generateEmail();

  let accountCreated = false;

  try {
    await createAccount(request, email);
    accountCreated = true;

    const response = await apiClient.getUserByEmail(email);

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.responseCode).toBe(200);
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(email);
    expect(body.user.name).toBe("Milos AutoQA");
  } finally {
    if (accountCreated) {
      await deleteAccount(request, email);
    }
  }
});
