
import {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';

import {
  API_BASE_URL,
  API_ENDPOINTS,
} from '../config/api-endpoints';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}


private async retryOnServiceUnavailable(
  action: () => Promise<APIResponse>,
  maxAttempts = 3
): Promise<APIResponse> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await action();

    if (response.status() !== 503 || attempt === maxAttempts) {
      return response;
    }

    console.warn(
      `HTTP 503 received. Retrying request (${attempt}/${maxAttempts - 1})`
    );

    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
  }

  throw new Error('API request failed after maximum retry attempts.');
}


async getProducts(): Promise<APIResponse> {
  return this.retryOnServiceUnavailable(() =>
    this.request.get(
      `${API_BASE_URL}${API_ENDPOINTS.productsList}`
    )
  );
}


async searchProducts(
  searchTerm: string
): Promise<APIResponse> {
  return this.retryOnServiceUnavailable(() =>
    this.request.post(
      `${API_BASE_URL}${API_ENDPOINTS.searchProduct}`,
      {
        form: {
          search_product: searchTerm,
        },
      }
    )
  );
}


async searchProductsWithoutParameter(): Promise<APIResponse> {
  return this.request.post(
    `${API_BASE_URL}${API_ENDPOINTS.searchProduct}`
  );
}

  async postProducts(): Promise<APIResponse> {
    return this.request.post(
      `${API_BASE_URL}${API_ENDPOINTS.productsList}`
    );
  }

  async verifyLogin(
    email?: string,
    password?: string
  ): Promise<APIResponse> {
    return this.request.post(
      `${API_BASE_URL}${API_ENDPOINTS.verifyLogin}`,
      {
        form: {
          ...(email !== undefined ? { email } : {}),
          ...(password !== undefined ? { password } : {}),
        },
      }
    );
  }

  async createAccount(
    accountData: Record<string, string>
  ): Promise<APIResponse> {
    return this.request.post(
      `${API_BASE_URL}${API_ENDPOINTS.createAccount}`,
      {
        form: accountData,
      }
    );
  }

  async deleteAccount(
    email: string,
    password: string
  ): Promise<APIResponse> {
    return this.request.delete(
      `${API_BASE_URL}${API_ENDPOINTS.deleteAccount}`,
      {
        form: { email, password },
      }
    );
  }


async getUserByEmail(
  email: string
): Promise<APIResponse> {
  return this.retryOnServiceUnavailable(() =>
    this.request.get(
      `${API_BASE_URL}${API_ENDPOINTS.getUserDetailByEmail}`,
      {
        params: { email },
      }
    )
  );
}

}

