import { initGraph, animateTransition } from "./graph.js";
import { searchNodes } from "./search.js";
import { applyClusteringStrategy } from "./clustering.js";
import { togglePaths } from "./paths.js";
import { debounce } from "./utils.js";

export function initializeEventListeners() {
  const timeRangeSelect = document.getElementById("timeRange");
  const refreshButton = document.getElementById("refresh");
  const zoomInButton = document.getElementById("zoomIn");
  const zoomOutButton = document.getElementById("zoomOut");
  const fitScreenButton = document.getElementById("fitScreen");
  const clusterBySelect = document.getElementById("clusterBy");
  const togglePathsButton = document.getElementById("togglePaths");
  const searchInput = document.getElementById("searchInput");

  if (timeRangeSelect) {
    timeRangeSelect.addEventListener("change", () => {
      animateTransition();
      initGraph();
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener("click", initGraph);
  }

  if (zoomInButton) {
    zoomInButton.addEventListener("click", () => {
      if (window.network) {
        const scale = window.network.getScale() * 1.2;
        window.network.moveTo({ scale: scale });
      }
    });
  }

  if (zoomOutButton) {
    zoomOutButton.addEventListener("click", () => {
      if (window.network) {
        const scale = window.network.getScale() * 0.8;
        window.network.moveTo({ scale: scale });
      }
    });
  }

  if (fitScreenButton) {
    fitScreenButton.addEventListener("click", () => {
      if (window.network) {
        window.network.fit();
      }
    });
  }

  if (clusterBySelect) {
    clusterBySelect.addEventListener("change", (e) => {
      if (window.network) {
        applyClusteringStrategy(e.target.value);
      }
    });
  }

  if (togglePathsButton) {
    togglePathsButton.addEventListener("click", togglePaths);
    togglePathsButton.title = "Hide Paths";
  }

  if (searchInput) {
    const debouncedSearch = debounce((value) => {
      searchNodes(value);
    }, 300);
    searchInput.addEventListener("input", (e) => {
      debouncedSearch(e.target.value);
    });
  }
}
