export function searchNodes(query) {
  if (!window.network || !query) {
    resetHighlight();
    return;
  }

  console.log("Searching for:", query);
  const nodes = window.network.body.nodes;
  const edges = window.network.body.edges;

  window.highlightedNodes.clear();
  window.highlightedEdges.clear();

  Object.values(nodes).forEach((node) => {
    if (!node.options || !node.options.title) return;

    const nodeTitle = node.options.title.toLowerCase();
    const nodeLabel = node.options.label.toLowerCase();
    const searchQuery = query.toLowerCase();

    if (nodeTitle.includes(searchQuery) || nodeLabel.includes(searchQuery)) {
      window.highlightedNodes.add(node.id);

      const connectedNodes = window.network.getConnectedNodes(node.id);
      connectedNodes.forEach((connectedNode) => {
        window.highlightedNodes.add(connectedNode);
      });
    }
  });

  Object.values(edges).forEach((edge) => {
    if (
      window.highlightedNodes.has(edge.fromId) &&
      window.highlightedNodes.has(edge.toId)
    ) {
      window.highlightedEdges.add(edge.id);
    }
  });

  updateNodeStyles();
}

export function resetHighlight() {
  window.highlightedNodes.clear();
  window.highlightedEdges.clear();
  updateNodeStyles();
}

export function updateNodeStyles() {
  if (!window.network) return;

  const nodes = window.network.body.nodes;
  const edges = window.network.body.edges;

  const currentHighlight = {
    nodes: new Set(window.highlightedNodes),
    edges: new Set(window.highlightedEdges),
  };

  Object.values(nodes).forEach((node) => {
    if (!node.options) return;

    if (currentHighlight.nodes.size === 0) {
      node.options.color = {
        ...node.options.color,
        opacity: 1,
      };
      node.options.font = {
        ...node.options.font,
        color: "#000000",
        size: 14,
      };
    } else if (currentHighlight.nodes.has(node.id)) {
      node.options.color = {
        background: "#f1c40f",
        border: "#2c3e50",
        opacity: 1,
        highlight: {
          background: "#f1c40f",
          border: "#2c3e50",
        },
        hover: {
          background: "#f1c40f",
          border: "#2c3e50",
        },
      };
      node.options.font = {
        ...node.options.font,
        color: "#000000",
        size: 16,
        bold: true,
      };
    } else {
      node.options.color = {
        ...node.options.color,
        opacity: 0.1,
      };
      node.options.font = {
        ...node.options.font,
        color: "#999999",
        size: 12,
      };
    }
  });

  Object.values(edges).forEach((edge) => {
    if (!edge.options) return;

    if (currentHighlight.edges.size === 0) {
      edge.options.color = {
        color: "#2c3e50",
        opacity: 0.8,
      };
    } else if (currentHighlight.edges.has(edge.id)) {
      edge.options.color = {
        color: "#e74c3c",
        opacity: 1,
      };
      edge.options.width = 2;
    } else {
      edge.options.color = {
        color: "#cccccc",
        opacity: 0.1,
      };
    }
  });

  window.network.redraw();
}
