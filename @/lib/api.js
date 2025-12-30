import axios from "axios";

const DEFAULT_TIMEOUTS = {
  dashboard: 25000,
  courseList: 15000,
  courseDetail: 25000,
  enroll: 10000,
  enrollList: 15000,
  default: 15000,
};

const activeRequests = new Map();

function createAbortKey(url, method = "GET") {
  return `${method}:${url}`;
}

export function cancelRequest(url, method = "GET") {
  const key = createAbortKey(url, method);
  const controller = activeRequests.get(key);
  if (controller) {
    controller.abort();
    activeRequests.delete(key);
  }
}

export function cancelAllRequests() {
  activeRequests.forEach((controller) => {
    controller.abort();
  });
  activeRequests.clear();
}

function getTimeout(type) {
  return DEFAULT_TIMEOUTS[type] || DEFAULT_TIMEOUTS.default;
}

async function request(config) {
  const {
    url,
    method = "GET",
    data,
    timeoutType = "default",
    timeout: customTimeout,
    cancelPrevious = true,
    ...rest
  } = config;

  const key = createAbortKey(url, method);

  if (cancelPrevious && activeRequests.has(key)) {
    activeRequests.get(key).abort();
    activeRequests.delete(key);
  }

  const controller = new AbortController();
  activeRequests.set(key, controller);

  const timeout = customTimeout || getTimeout(timeoutType);
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await axios({
      url,
      method,
      data,
      signal: controller.signal,
      timeout,
      ...rest,
    });

    clearTimeout(timeoutId);
    activeRequests.delete(key);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    clearTimeout(timeoutId);
    activeRequests.delete(key);

    if (error.name === "AbortError" || error.code === "ECONNABORTED" || error.code === "ERR_CANCELED") {
      return {
        success: false,
        error: "Request took too long. Please try again.",
        isTimeout: true,
        isCanceled: error.code === "ERR_CANCELED",
      };
    }

    const serverError = error.response?.data?.error || error.response?.data?.message;
    return {
      success: false,
      error: serverError || error.message || "An unexpected error occurred.",
      status: error.response?.status,
      isTimeout: false,
    };
  }
}

export const api = {
  get: (url, options = {}) => request({ url, method: "GET", ...options }),
  post: (url, data, options = {}) => request({ url, method: "POST", data, ...options }),
  put: (url, data, options = {}) => request({ url, method: "PUT", data, ...options }),
  delete: (url, options = {}) => request({ url, method: "DELETE", ...options }),

  dashboard: {
    get: () => request({ url: "/api/dashboard", timeoutType: "dashboard" }),
  },

  courses: {
    list: () => request({ url: "/api/courses", timeoutType: "courseList" }),
    get: (courseId) => request({ url: `/api/courses?courseId=${courseId}`, timeoutType: "courseDetail" }),
    explore: (search = "") => {
      const url = search ? `/api/courses?courseId=0&search=${encodeURIComponent(search)}` : "/api/courses?courseId=0";
      return request({ url, timeoutType: "courseList" });
    },
  },

  enroll: {
    list: () => request({ url: "/api/enroll-course", timeoutType: "enrollList" }),
    get: (courseId) => request({ url: `/api/enroll-course?courseId=${courseId}`, timeoutType: "courseDetail" }),
    create: (courseId) => request({
      url: "/api/enroll-course",
      method: "POST",
      data: { courseId },
      timeoutType: "enroll",
      cancelPrevious: false,
    }),
    update: (courseId, completedChapter) => request({
      url: "/api/enroll-course",
      method: "PUT",
      data: { courseId, completedChapter },
      timeoutType: "enroll",
    }),
  },
};

export function useCleanupOnUnmount(cleanup) {
  if (typeof window !== "undefined") {
    return cleanup;
  }
}

export default api;
