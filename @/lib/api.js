const DEFAULT_TIMEOUTS = {
  dashboard: 8000,
  courses: 6000,
  enroll: 5000,
  user: 5000,
  achievements: 5000,
  default: 8000
};

const activeRequests = new Map();

function getTimeoutMs(type) {
  return DEFAULT_TIMEOUTS[type] || DEFAULT_TIMEOUTS.default;
}

export function createAbortController(key, timeoutMs) {
  if (activeRequests.has(key)) {
    activeRequests.get(key).abort();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  activeRequests.set(key, controller);

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);
      activeRequests.delete(key);
    }
  };
}

export function cancelRequest(key) {
  if (activeRequests.has(key)) {
    activeRequests.get(key).abort();
    activeRequests.delete(key);
  }
}

export function cancelAllRequests() {
  activeRequests.forEach((controller) => {
    controller.abort();
  });
  activeRequests.clear();
}

function formatError(error) {
  if (error.name === 'AbortError' || error.code === 23) {
    return 'Request timed out. Please check your connection and try again.';
  }
  if (error.response?.status === 401) {
    return 'Please sign in to continue.';
  }
  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }
  if (error.message?.includes('Network Error')) {
    return 'Network error. Please check your connection.';
  }
  return error.response?.data?.error || error.message || 'An unexpected error occurred.';
}

export async function apiRequest(url, options = {}) {
  const {
    method = 'GET',
    data,
    type = 'default',
    key,
    timeout,
    headers = {},
    ...rest
  } = options;

  const requestKey = key || `${method}:${url}`;
  const timeoutMs = timeout || getTimeoutMs(type);
  const { signal, cleanup } = createAbortController(requestKey, timeoutMs);

  const startTime = Date.now();

  try {
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal,
      ...rest
    };

    if (data && method !== 'GET') {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);
    const elapsed = Date.now() - startTime;

    if (elapsed > 3000) {
      console.warn(`[API] Slow request: ${method} ${url} took ${elapsed}ms`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        response: {
          status: response.status,
          data: errorData
        },
        message: errorData.error || `HTTP ${response.status}`
      };
    }

    const result = await response.json();
    cleanup();
    return { data: result, success: true };

  } catch (error) {
    cleanup();
    
    const friendlyMessage = formatError(error);
    console.error(`[API] Error on ${method} ${url}:`, friendlyMessage);

    return {
      success: false,
      error: friendlyMessage,
      isTimeout: error.name === 'AbortError',
      status: error.response?.status
    };
  }
}

export async function get(url, options = {}) {
  return apiRequest(url, { ...options, method: 'GET' });
}

export async function post(url, data, options = {}) {
  return apiRequest(url, { ...options, method: 'POST', data });
}

export async function put(url, data, options = {}) {
  return apiRequest(url, { ...options, method: 'PUT', data });
}

export async function patch(url, data, options = {}) {
  return apiRequest(url, { ...options, method: 'PATCH', data });
}

export async function del(url, options = {}) {
  return apiRequest(url, { ...options, method: 'DELETE' });
}

export function useCleanupOnUnmount(keys) {
  return () => {
    if (Array.isArray(keys)) {
      keys.forEach(cancelRequest);
    } else if (keys) {
      cancelRequest(keys);
    }
  };
}

export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  cancelRequest,
  cancelAllRequests,
  createAbortController
};
