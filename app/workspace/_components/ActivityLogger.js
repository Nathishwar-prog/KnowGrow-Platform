/**
 * Activity Logger Utility
 * Handles storing and retrieving user activity logs from localStorage.
 */

const STORAGE_KEY = 'knowgrow_activity_log';
const MAX_ACTIVITIES = 10;

export const logActivity = (title, type = 'info') => {
    try {
        const existingLogs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        // Create new activity entry
        const newActivity = {
            id: Date.now(),
            title,
            type, // 'info', 'success', 'warning', 'award'
            timestamp: new Date().toISOString()
        };

        // Add to beginning of array
        const updatedLogs = [newActivity, ...existingLogs].slice(0, MAX_ACTIVITIES);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
        return updatedLogs;
    } catch (error) {
        console.error('Error logging activity:', error);
        return [];
    }
};

export const getActivities = () => {
    try {
        const logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return logs;
    } catch (error) {
        console.error('Error getting activities:', error);
        return [];
    }
};

export const formatTimeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
};
