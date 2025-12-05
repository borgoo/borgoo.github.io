/**
 * Utility for updating relative time displays dynamically
 */

import { getRelativeTime } from './formatUtils.js';

/**
 * Updates all elements with class 'relative-time' to show current relative time
 * Elements must have a data-date attribute with the date string
 */
export function updateRelativeTimes() {
  const relativeTimeElements = document.querySelectorAll('.relative-time');
  relativeTimeElements.forEach(element => {
    const dateString = element.getAttribute('data-date');
    if (dateString) {
      element.textContent = getRelativeTime(dateString);
    }
  });
}

/**
 * Initialize relative time updates on page load
 */
export function initRelativeTimes() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateRelativeTimes);
  } else {
    updateRelativeTimes();
  }
}

