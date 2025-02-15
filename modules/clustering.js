import { getTimeColor } from './styles.js';
import { getDomainColor } from './styles.js';
import { getNodeShape } from './shapes.js';

export function applyClusteringStrategy(strategy) {
    if (!window.network) return;

    window.network.setData(window.network.body.data);
    
    switch(strategy) {
        case 'domain':
            clusterByDomain();
            break;
        case 'type':
            clusterByType();
            break;
        case 'time':
            clusterByTime();
            break;
        default:
            window.network.setData(window.network.body.data);
    }
}

export function clusterByDomain() {
    // First, decluster if already clustered
    window.network.setData(window.network.body.data);
    
    const nodes = window.network.body.data.nodes.get();
    const domains = {};
    
    // Group nodes by domain
    nodes.forEach((node) => {
        if (typeof node.id === 'string' && node.id.startsWith('time_')) return;
        
        try {
            const url = new URL(node.title.split('\n')[1]);
            const domain = url.hostname;
            
            if (!domains[domain]) {
                domains[domain] = [];
            }
            domains[domain].push(node.id);
        } catch (e) {
            console.log('Skipping node:', node);
        }
    });

    // Create clusters for each domain
    Object.entries(domains).forEach(([domain, nodeIds]) => {
        if (nodeIds.length > 1) {
            window.network.cluster({
                joinCondition: (nodeOptions) => {
                    return nodeIds.includes(nodeOptions.id);
                },
                clusterNodeProperties: {
                    label: domain,
                    shape: 'dot',
                    size: 30 + (nodeIds.length * 5),
                    color: getDomainColor(domain),
                    font: {
                        size: 14,
                        face: 'Segoe UI'
                    },
                    borderWidth: 2,
                    shadow: true,
                    title: `${domain}\nNodes: ${nodeIds.length}`
                }
            });
        }
    });
}

export function clusterByType() {
    window.network.setData(window.network.body.data);
    
    const nodes = window.network.body.data.nodes.get();
    const types = {
        'Development': [],
        'Search': [],
        'Video': [],
        'Other': []
    };
    
    nodes.forEach((node) => {
        if (typeof node.id === 'string' && node.id.startsWith('time_')) return;
        
        try {
            const url = new URL(node.title.split('\n')[1]);
            const domain = url.hostname;
            
            if (domain.includes('github') || domain.includes('stackoverflow')) {
                types['Development'].push(node.id);
            } else if (domain.includes('google')) {
                types['Search'].push(node.id);
            } else if (domain.includes('youtube')) {
                types['Video'].push(node.id);
            } else {
                types['Other'].push(node.id);
            }
        } catch (e) {
            console.log('Skipping node:', node);
        }
    });

    Object.entries(types).forEach(([type, nodeIds]) => {
        if (nodeIds.length > 0) {
            window.network.cluster({
                joinCondition: (nodeOptions) => {
                    return nodeIds.includes(nodeOptions.id);
                },
                clusterNodeProperties: {
                    label: type,
                    shape: getNodeShape(type.toLowerCase()),
                    size: 40,
                    color: getDomainColor(type.toLowerCase()),
                    font: {
                        size: 16,
                        face: 'Segoe UI'
                    },
                    borderWidth: 2,
                    shadow: true,
                    title: `${type}\nNodes: ${nodeIds.length}`
                }
            });
        }
    });
}

export function clusterByTime() {
    window.network.setData(window.network.body.data);
    
    const nodes = window.network.body.data.nodes.get();
    const timeRanges = {};
    
    nodes.forEach((node) => {
        if (node.id.toString().startsWith('cluster_')) return;
        
        try {
            const lastVisitTime = node.lastVisitTime;
            
            if (lastVisitTime) {
                const date = new Date(lastVisitTime);
                const hour = date.getHours();
                
                if (!isNaN(hour)) {
                    if (!timeRanges[hour]) {
                        timeRanges[hour] = [];
                    }
                    timeRanges[hour].push(node.id);
                }
            }
        } catch (e) {
            console.log('Error processing node:', node);
        }
    });

    const totalHours = Object.keys(timeRanges).length;
    Object.entries(timeRanges).forEach(([hour, nodeIds], index) => {
        if (nodeIds.length > 0) {
            const angle = (2 * Math.PI * index) / totalHours;
            const radius = 300;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            window.network.cluster({
                joinCondition: (nodeOptions) => {
                    return nodeIds.includes(nodeOptions.id);
                },
                clusterNodeProperties: {
                    id: `cluster_time_${hour}`,
                    label: `${hour}:00\n(${nodeIds.length} items)`,
                    shape: 'dot',
                    size: 30 + (nodeIds.length * 3),
                    color: {
                        background: getTimeColor(parseInt(hour)),
                        border: '#34495e'
                    },
                    font: {
                        size: 14,
                        face: 'Segoe UI',
                        bold: true
                    },
                    borderWidth: 2,
                    shadow: true,
                    title: `Hour: ${hour}:00\nNodes: ${nodeIds.length}`,
                    x: x,
                    y: y,
                    fixed: {
                        x: true,
                        y: true
                    }
                }
            });
        }
    });
} 