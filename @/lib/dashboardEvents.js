"use client";

let dashboardInvalidateCallback = null;

export function setDashboardInvalidator(callback) {
  dashboardInvalidateCallback = callback;
}

export function invalidateDashboard() {
  if (typeof dashboardInvalidateCallback === 'function') {
    dashboardInvalidateCallback();
  }
}

export function onChapterComplete() {
  invalidateDashboard();
}

export function onCourseEnroll() {
  invalidateDashboard();
}

export function onQuizComplete() {
  invalidateDashboard();
}
