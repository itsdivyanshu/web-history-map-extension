import { showLoading, hideLoading, getStartTime, truncateLabel } from './utils.js';
import { getDomainColor } from './styles.js';
import { getNodeShape } from './shapes.js';

export function initGraph() {
    console.log('Initializing graph');
    showLoading();
    
    try {
        const timeRangeSelect = document.getElementById('timeRange');
        if (!timeRangeSelect) {
            throw new Error('Time range select not found');
        }
        
        const startTime = getStartTime(timeRangeSelect.value);
        
        chrome.history.search({
            text: '',
            startTime: startTime,
            maxResults: 100
        }, function(historyItems) {
            console.log('Retrieved history items:', historyItems.length);
            try {
                if (!historyItems || historyItems.length === 0) {
                    console.log('No history items found');
                    hideLoading();
                    return;
                }
                createGraph(historyItems);
            } catch (error) {
                console.error('Error creating graph:', error);
                hideLoading();
                alert('Error creating graph. Please try refreshing.');
            }
        });
    } catch (error) {
        console.error('Error in initGraph:', error);
        hideLoading();
        alert('Error initializing graph. Please try refreshing.');
    }
}

export function createGraph(historyItems) {
    console.log('Creating graph with items:', historyItems);
    try {
        const nodes = new window.vis.DataSet();
        const edges = new window.vis.DataSet();
        
        historyItems.forEach((item, index) => {
            nodes.add({
                id: index,
                label: truncateLabel(item.title || new URL(item.url).hostname),
                title: `${item.title}\n${item.url}\nVisited at: ${new Date(item.lastVisitTime).toLocaleString()}`,
                lastVisitTime: item.lastVisitTime,
                color: {
                    background: getDomainColor(new URL(item.url).hostname),
                    border: '#2c3e50',
                    highlight: {
                        background: '#f1c40f',
                        border: '#2c3e50'
                    },
                    hover: {
                        background: '#e74c3c',
                        border: '#2c3e50'
                    }
                },
                shape: getNodeShape(new URL(item.url).hostname),
                size: 30,
                font: {
                    size: 12,
                    face: 'Segoe UI'
                },
                borderWidth: 2,
                shadow: true
            });

            if (index > 0) {
                edges.add({
                    from: index - 1,
                    to: index,
                    arrows: {
                        to: {
                            enabled: true,
                            scaleFactor: 0.5
                        }
                    },
                    color: {
                        color: '#2c3e50',
                        opacity: 0.3,
                        highlight: '#3498db'
                    },
                    smooth: {
                        type: 'curvedCW',
                        roundness: 0.2
                    },
                    width: 2
                });
            }
        });

        const container = document.getElementById('graph-container');
        if (!container) {
            throw new Error('Graph container not found');
        }

        const data = { nodes, edges };
        
        const statsElement = document.getElementById('stats');
        if (statsElement) {
            statsElement.textContent = `Nodes: ${nodes.length} | Connections: ${edges.length}`;
        }

        const options = {
            physics: {
                enabled: true,
                stabilization: {
                    iterations: 100,
                    updateInterval: 25
                },
                barnesHut: {
                    gravitationalConstant: -2000,
                    centralGravity: 0.1,
                    springLength: 200,
                    springConstant: 0.04,
                    damping: 0.09
                }
            },
            interaction: {
                hover: true,
                hoverConnectedEdges: true,
                selectConnectedEdges: true,
                multiselect: true,
                dragNodes: true,
                dragView: true,
                zoomView: true
            }
        };

        if (window.network) {
            window.network.destroy();
            window.network = null;
        }

        window.network = new window.vis.Network(container, data, options);
        
        window.network.on("stabilizationIterationsDone", function () {
            console.log("Stabilization finished");
            hideLoading();
        });

        window.network.on("stabilizationProgress", function(params) {
            console.log('Stabilization progress:', params.iterations, '/', params.total);
        });

        setTimeout(() => {
            if (document.querySelector('.loading').style.display !== 'none') {
                hideLoading();
            }
        }, 5000);

        console.log('Graph created successfully');
    } catch (error) {
        console.error('Error in createGraph:', error);
        hideLoading();
        throw error;
    }
}

export function animateTransition() {
    if (window.network) {
        const nodes = window.network.body.data.nodes;
        const edges = window.network.body.data.edges;
        
        nodes.forEach((node) => {
            node.color = {
                ...node.color,
                opacity: 0
            };
        });
        
        edges.forEach((edge) => {
            edge.color = {
                ...edge.color,
                opacity: 0
            };
        });
        
        window.network.redraw();
    }
} 