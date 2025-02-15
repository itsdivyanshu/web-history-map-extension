export function getDomainColor(domain) {
    if (domain.includes('github') || domain.includes('stackoverflow')) {
        return '#87CEEB'; // Light blue for development sites
    } else if (domain.includes('google')) {
        return '#90EE90'; // Light green for search
    } else if (domain.includes('youtube')) {
        return '#FFB6C1'; // Light red for video
    } else {
        return '#DCDCDC'; // Light gray for others
    }
}

export function getTimeColor(hour) {
    // Morning (6-11): Light blue
    if (hour >= 6 && hour < 12) {
        return '#87CEEB';
    }
    // Afternoon (12-17): Light green
    else if (hour >= 12 && hour < 18) {
        return '#90EE90';
    }
    // Evening (18-23): Light orange
    else if (hour >= 18 && hour < 24) {
        return '#FFB6C1';
    }
    // Night (0-5): Dark blue
    else {
        return '#B0C4DE';
    }
} 