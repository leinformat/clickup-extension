(async () => {
  // ******************* Start Private Apps page **********************/
  const openIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M88 289.6L64.4 360.2L64.4 160C64.4 124.7 93.1 96 128.4 96L267.1 96C280.9 96 294.4 100.5 305.5 108.8L343.9 137.6C349.4 141.8 356.2 144 363.1 144L480.4 144C515.7 144 544.4 172.7 544.4 208L544.4 224L179 224C137.7 224 101 250.4 87.9 289.6zM509.8 512L131 512C98.2 512 75.1 479.9 85.5 448.8L133.5 304.8C140 285.2 158.4 272 179 272L557.8 272C590.6 272 613.7 304.1 603.3 335.2L555.3 479.2C548.8 498.8 530.4 512 509.8 512z"/></svg>`;
  const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M512 512L128 512C92.7 512 64 483.3 64 448L64 272L576 272L576 448C576 483.3 547.3 512 512 512zM576 224L64 224L64 160C64 124.7 92.7 96 128 96L266.7 96C280.5 96 294 100.5 305.1 108.8L343.5 137.6C349 141.8 355.8 144 362.7 144L512 144C547.3 144 576 172.7 576 208L576 224z"/></svg>`;

  // Functions
  const createDomElement = ({ classes = [], type, url, title, text }) => {
    const element = document.createElement(type);
    // Check if classes is an array and has elements
    if (Array.isArray(classes) && classes.length) {
      element.classList.add(...classes);
    }
    if (!!url && type == "a") element.href = url;
    if (!!title) element.title = title;
    if (!!text) element.textContent = text;

    return element;
  };

  const handlerSidebar = (sidebar, toolbar) => {
    if (!sidebar || !toolbar) {
      console.error("Sidebar Scope Section Not Found.");
      return;
    }

    const sidebarParent = sidebar.parentElement;

    sidebarParent.classList.add("module-sidebar-container");
    toolbar.classList.add("module-toolbar-container");

    const close = createDomElement({
      classes: ["close-module-options-container"],
      type: "div"
    });
    close.innerHTML=`${openIcon}`;

    toolbar.append(close);
    
  };

  window.addEventListener("load", (e) => {
    // Design Manager page
    const currentUrl = window.location.href;
    const isModuleEditor = /app\.hubspot\.com\/design-manager/.test(currentUrl);

    if (isModuleEditor) {
      const appContainerSelector = "[data-test-id='custom-widget-editor-sidebar']";
      const editorToolbarSelector = "[data-test-id='editor-toolbar']";

      const firstSidebar = document.querySelector(appContainerSelector);
      const editorToolbar = document.querySelector(editorToolbarSelector);

      handlerSidebar(firstSidebar,editorToolbar);

      const observer = new MutationObserver(async (mutations) => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.matches(appContainerSelector)) {
                const toolbar = document.querySelector(editorToolbarSelector);
                handlerSidebar(node, toolbar);
              }
            }
          });
        }
      });

      const targetNode = document.body;
      const config = { childList: true, subtree: true, attributes: true };

      observer.observe(targetNode, config);

      targetNode.addEventListener("click", (e) => {
        if (e.target.classList.contains("close-module-options-container") || e.target.closest(".close-module-options-container")) {
          const sidebar = document.querySelector(appContainerSelector).parentElement;
          sidebar.classList.toggle("sidebar-is-closed");

          const closeBtn = document.querySelector(".close-module-options-container");
          if (sidebar.classList.contains("sidebar-is-closed")) {
            closeBtn.innerHTML=`${closeIcon}`;
          } else {
            closeBtn.innerHTML=`${openIcon}`;
          }
        }
      });
    }
  });
  // ******************* End Design Manager page **********************/
})();
