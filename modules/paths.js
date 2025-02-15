export function togglePaths() {
  window.isPathsVisible = !window.isPathsVisible;
  const edges = window.network.body.data.edges.get();

  edges.forEach((edge) => {
    window.network.body.data.edges.update({
      id: edge.id,
      hidden: !window.isPathsVisible,
    });
  });

  const toggleButton = document.getElementById("togglePaths");
  if (toggleButton) {
    const icon = toggleButton.querySelector(".material-icons");
    if (window.isPathsVisible) {
      icon.textContent = "share";
      toggleButton.title = "Hide Paths";
    } else {
      icon.textContent = "grid_view";
      toggleButton.title = "Show Paths";
    }
  }

  window.network.redraw();
}
