import api from './axios.js';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface ApiOptions {
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}

/**
 * Sends an HTTP request using the specified method, URL, and options.
 * Returns the response data or throws an error if the request fails.
 *
 * Args:
 *   method: The HTTP method to use ('get', 'post', 'put', 'patch', 'delete').
 *   url: The endpoint URL for the request.
 *   options: Optional configuration including data, params, and headers.
 *
 * Returns:
 *   The response data of type T.
 *
 * Raises:
 *   Throws the error response data or error message if the request fails.
 */
async function request<T>(
  method: Method,
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  try {
    const response = await api.request<T>({
      method,
      url,
      data: options.data,
      params: options.params,
      headers: options.headers,
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

// Named helper functions
/**
 * Sends a GET request to the specified URL with optional query parameters and headers.
 * Returns the response data of type T or throws an error if the request fails.
 *
 * Args:
 *   url: The endpoint URL for the GET request.
 *   params: Optional query parameters to include in the request.
 *   headers: Optional headers to include in the request.
 *
 * Returns:
 *   The response data of type T.
 *
 * Raises:
 *   Throws the error response data or error message if the request fails.
 */
export function get<T>(url: string, params?: any, headers?: any) {
  return request<T>('get', url, { params, headers });
}

/**
 * Sends a POST request to the specified URL with optional data and headers.
 * Returns the response data of type T or throws an error if the request fails.
 *
 * Args:
 *   url: The endpoint URL for the POST request.
 *   data: Optional data to include in the request body.
 *   headers: Optional headers to include in the request.
 *
 * Returns:
 *   The response data of type T.
 *
 * Raises:
 *   Throws the error response data or error message if the request fails.
 */
export function post<T>(url: string, data?: any, headers?: any) {
  return request<T>('post', url, { data, headers });
}

/**
 * Sends a PUT request to the specified URL with optional data and headers.
 * Returns the response data of type T or throws an error if the request fails.
 *
 * Args:
 *   url: The endpoint URL for the PUT request.
 *   data: Optional data to include in the request body.
 *   headers: Optional headers to include in the request.
 *
 * Returns:
 *   The response data of type T.
 *
 * Raises:
 *   Throws the error response data or error message if the request fails.
 */
export function put<T>(url: string, data?: any, headers?: any) {
  return request<T>('put', url, { data, headers });
}
/**
 * Sends a PATCH request to the specified URL with optional data and headers.
 * Returns the response data of type T or throws an error if the request fails.
 *
 * Args:
 *   url: The endpoint URL for the PATCH request.
 *   data: Optional data to include in the request body.
 *   headers: Optional headers to include in the request.
 *
 * Returns:
 *   The response data of type T.
 *
 * Raises:
 *   Throws the error response data or error message if the request fails.
 */
export function patch<T>(url: string, data?: any, headers?: any) {
  return request<T>('patch', url, { data, headers });
}

/**
 * Sends a DELETE request to the specified URL with optional data and headers.
 * Returns the response data of type T or throws an error if the request fails.
 *
 * Args:
 *   url: The endpoint URL for the DELETE request.
 *   data: Optional data to include in the request body.
 *   headers: Optional headers to include in the request.
 *
 * Returns:
 *   The response data of type T.
 *
 * Raises:
 *   Throws the error response data or error message if the request fails.
 */
export function del<T>(url: string, data?: any, headers?: any) {
  return request<T>('delete', url, { data, headers });
}
