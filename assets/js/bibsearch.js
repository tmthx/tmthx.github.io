document.addEventListener("DOMContentLoaded", function () {
  const getSearchableText = (element) => {
    const visibleEntry = element.cloneNode(true);
    visibleEntry.querySelectorAll(".hidden, script, style").forEach((hiddenElement) => hiddenElement.remove());
    return visibleEntry.textContent.toLowerCase();
  };

  // actual bibsearch logic
  const filterItems = (searchTerm) => {
    document.querySelectorAll(".bibliography, .unloaded").forEach((element) => element.classList.remove("unloaded"));

    if (window.CSS && CSS.highlights) {
      CSS.highlights.clear();
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    if (normalizedSearchTerm) {
      document.querySelectorAll(".bibliography > li").forEach((element) => {
        const visibleText = getSearchableText(element);
        if (visibleText.indexOf(normalizedSearchTerm) == -1) {
          element.classList.add("unloaded");
        }
      });
    }

    document.querySelectorAll("h2.bibliography").forEach(function (sectionHeading) {
      let iterator = sectionHeading.nextElementSibling;
      let sectionHasVisibleEntry = false;

      while (iterator && iterator.tagName !== "H2") {
        if (iterator.tagName === "OL") {
          const unloadedSiblings = iterator.querySelectorAll(":scope > li.unloaded");
          const totalSiblings = iterator.querySelectorAll(":scope > li");

          if (unloadedSiblings.length === totalSiblings.length) {
            const previousElement = iterator.previousElementSibling;
            if (previousElement && previousElement.tagName !== "H2") {
              previousElement.classList.add("unloaded");
            }
            iterator.classList.add("unloaded");
          } else {
            sectionHasVisibleEntry = true;
          }
        }
        iterator = iterator.nextElementSibling;
      }

      if (!sectionHasVisibleEntry) {
        sectionHeading.classList.add("unloaded");
      }
    });
  };

  const updateInputField = () => {
    const hashValue = decodeURIComponent(window.location.hash.substring(1)); // Remove the '#' character
    document.getElementById("bibsearch").value = hashValue;
    filterItems(hashValue);
  };

  // Sensitive search. Only start searching if there's been no input for 300 ms
  let timeoutId;
  document.getElementById("bibsearch").addEventListener("input", function () {
    clearTimeout(timeoutId); // Clear the previous timeout
    const searchTerm = this.value.toLowerCase();
    timeoutId = setTimeout(() => filterItems(searchTerm), 300);
  });

  window.addEventListener("hashchange", updateInputField); // Update the filter when the hash changes

  updateInputField(); // Update filter when page loads
});
