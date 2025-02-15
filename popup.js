import { initializeEventListeners } from "./modules/eventListeners.js";
import { initGraph } from "./modules/graph.js";

window.network = null;
window.isPathsVisible = true;
window.highlightedNodes = new Set();
window.highlightedEdges = new Set();

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded");
  initializeEventListeners();
  initGraph();
});
