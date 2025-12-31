import axios from "axios";

const DEFAULT_TIMEOUTS = {
  dashboard: 60000,
  courseList: 30000,
  courseDetail: 30000,
  enroll: 15000,
  enrollList: 30000,
  default: 15000,
};

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
    ...rest
  } = config;

  const timeout = customTimeout || getTimeout(timeoutType);

  try {
    const response = await axios({
      url,
      method,
      data,
      timeout,
      ...rest,
    });

    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      return {
        success: false,
        error: "Request took too long. Please try again.",
        isTimeout: true,
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
    }),
    update: (courseId, completedChapter) => request({
      url: "/api/enroll-course",
      method: "PUT",
      data: { courseId, completedChapter },
      timeoutType: "enroll",
    }),
  },
};

export function cancelRequest() {}
export function cancelAllRequests() {}

export default api;
