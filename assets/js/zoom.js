// Initialize medium zoom.
$(document).ready(function () {
  medium_zoom = mediumZoom("[data-zoomable]", {
    background: getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color") + "ee", // + 'ee' for trasparency.
  });

  medium_zoom.on("open", ({ target }) => {
    if (!target.closest(".publications .preview")) {
      medium_zoom.update({ container: null });
      return;
    }

    const { clientWidth, clientHeight } = document.documentElement;
    const headerBottom = document.querySelector("#navbar")?.getBoundingClientRect().bottom ?? 0;
    const footerTop = document.querySelector("footer")?.getBoundingClientRect().top ?? clientHeight;
    const top = Math.max(0, headerBottom);
    const bottom = Math.max(0, clientHeight - footerTop);
    const availableHeight = clientHeight - top - bottom;
    const minVerticalPadding = Math.max(20, availableHeight * 0.05);
    const previewSize = Math.min(800, clientWidth - 32, availableHeight - 2 * minVerticalPadding);
    const verticalPadding = (availableHeight - previewSize) / 2;
    const sidePadding = (clientWidth - previewSize) / 2;

    medium_zoom.update({
      container: { top: top + verticalPadding, bottom: bottom + verticalPadding, left: sidePadding, right: sidePadding },
    });
  });
});
