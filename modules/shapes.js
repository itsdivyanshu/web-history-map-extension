export function getNodeShape(domain) {
    if (domain.includes('github') || domain.includes('stackoverflow')) {
        return 'diamond';
    } else if (domain.includes('google')) {
        return 'dot';
    } else if (domain.includes('youtube')) {
        return 'triangle';
    } else {
        return 'square';
    }
} 