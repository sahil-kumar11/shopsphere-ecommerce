const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const REQUEST_TIMEOUT = 15000;

function getAccessToken() {
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
}

function notifyAuthChange() {
  window.dispatchEvent(new Event("shopsphere-auth-change"));
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
}

function getErrorMessage(data, fallback) {
  if (!data) {
    return fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  if (data.message) {
    return data.message;
  }

  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
    return data.non_field_errors[0];
  }

  const firstField = Object.values(data).find(
    (value) => Array.isArray(value) && value.length
  );

  if (firstField) {
    return firstField[0];
  }

  return fallback;
}

export async function apiRequest(endpoint, options = {}) {
  const token = getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("The request timed out. Please try again.");
    }

    throw new Error(
      "Unable to connect to the server. Make sure Django is running."
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  const data = await parseResponse(response);

  if (response.status === 401) {
    localStorage.removeItem("access");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("shopsphere-auth");
    localStorage.removeItem("shopsphere-current-user");

    notifyAuthChange();
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Something went wrong. Please try again.")
    );
  }

  return data;
}

export async function loginUser(email, password) {
  const data = await apiRequest("/auth/login/", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (data?.access) {
    localStorage.setItem("access", data.access);
    localStorage.setItem("access_token", data.access);
  }

  localStorage.setItem("shopsphere-auth", "true");

  if (data?.user) {
    localStorage.setItem(
      "shopsphere-current-user",
      JSON.stringify(data.user)
    );
  }

  notifyAuthChange();

  return data;
}

export async function registerUser({ name, email, password }) {
  const data = await apiRequest("/auth/register/", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (data?.access) {
    localStorage.setItem("access", data.access);
    localStorage.setItem("access_token", data.access);
  }

  localStorage.setItem("shopsphere-auth", "true");

  if (data?.user) {
    localStorage.setItem(
      "shopsphere-current-user",
      JSON.stringify(data.user)
    );
  }

  notifyAuthChange();

  return data;
}

export function logoutUser() {
  localStorage.removeItem("access");
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  localStorage.removeItem("shopsphere-auth");
  localStorage.removeItem("shopsphere-current-user");

  notifyAuthChange();
}

export async function getCurrentUser() {
  return apiRequest("/auth/me/");
}

export async function updateCurrentUser(userData) {
  const data = await apiRequest("/auth/me/", {
    method: "PATCH",
    body: JSON.stringify(userData),
  });

  localStorage.setItem(
    "shopsphere-current-user",
    JSON.stringify(data)
  );

  return data;
}

export async function getProducts() {
  return apiRequest("/products/");
}

export async function getProduct(productId) {
  return apiRequest(`/products/${productId}/`);
}

export async function getCart() {
  return apiRequest("/cart/");
}

export async function addCartItem(
  productId,
  quantity = 1,
  selectedSize = null,
  selectedColour = null
) {
  // FIX: Send null explicitly instead of empty string.
  // Django's views.py uses "or ''" which safely converts null to empty string.
  return apiRequest("/cart/items/", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      quantity,
      selected_size: selectedSize,
      selected_colour: selectedColour,
    }),
  });
}

export async function updateCartItem(itemId, quantity) {
  return apiRequest(`/cart/items/${itemId}/`, {
    method: "PATCH",
    body: JSON.stringify({
      quantity,
    }),
  });
}

export async function removeCartItem(itemId) {
  return apiRequest(`/cart/items/${itemId}/`, {
    method: "DELETE",
  });
}

export async function clearCartAPI() {
  return apiRequest("/cart/", {
    method: "DELETE",
  });
}

export async function getWishlist() {
  return apiRequest("/wishlist/");
}

export async function addWishlistItem(productId) {
  return apiRequest("/wishlist/items/", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
    }),
  });
}

export async function removeWishlistItem(productId) {
  return apiRequest(`/wishlist/items/${productId}/`, {
    method: "DELETE",
  });
}

export async function clearWishlistAPI() {
  return apiRequest("/wishlist/", {
    method: "DELETE",
  });
}

export async function getOrders() {
  return apiRequest("/orders/");
}

export async function getOrder(orderId) {
  return apiRequest(`/orders/${orderId}/`);
}

export async function createOrder(orderData) {
  return apiRequest("/orders/", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function cancelOrder(orderId) {
  return apiRequest(`/orders/${orderId}/`, {
    method: "PATCH",
    body: JSON.stringify({
      status: "cancelled",
    }),
  });
}

export { API_URL };