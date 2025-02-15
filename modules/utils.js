export function showLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'flex';
        console.log('Loading spinner shown');
    }
}

export function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'none';
        console.log('Loading spinner hidden');
    }
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function getStartTime(timeRange) {
    const now = new Date().getTime();
    switch(timeRange) {
        case 'hour':
            return now - (60 * 60 * 1000);
        case 'day':
            return now - (24 * 60 * 60 * 1000);
        case 'week':
            return now - (7 * 24 * 60 * 60 * 1000);
        case 'month':
            return now - (30 * 24 * 60 * 60 * 1000);
        default:
            return now - (24 * 60 * 60 * 1000);
    }
}

export function truncateLabel(label, maxLength = 30) {
    if (!label) return '';
    return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
} 