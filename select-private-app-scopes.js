(async () => {
  // ******************* Start Private Apps page **********************/
  // Functions
  const handlerScopes = (domElement, unSelect = false) => {
        const sidebar = domElement.querySelector(".private-modal--sidebar");

        if (!sidebar) {
            console.error("Sidebar Scope Section Not Found.");
            alert("Sidebar Scope Section Not Found.");
            return;
        }

        // Expand sidebar buttons if they are collapsed
        const sidebarButtons = sidebar.querySelectorAll(
            'div.private-clickable[aria-expanded="false"]'
        );
        sidebarButtons.forEach(button => button.click());

        // Select all enabled checkboxes
        const enabledCheckboxes = domElement.querySelectorAll(
            'input[type="checkbox"]:not([disabled])'
        );

        enabledCheckboxes.forEach(checkbox => {
            if (unSelect) {
                // If unSelect is true, uncheck checkboxes
                if (checkbox.checked) {
                    console.log(`🔴 Unchecking checkbox with ID ${checkbox.id}`);
                    checkbox.click();
                }
            } else {
                // If unSelect is false, check checkboxes
                if (!checkbox.checked) {
                    console.log(`🟢 Checking checkbox with ID ${checkbox.id}`);
                    checkbox.click();
                }
            }
        });
  };

  const createDomElement = ({ classes=[], type, url, title, text }) => {
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

  window.addEventListener("load", (e) => {
    // Private Apps page
    const currentUrl = window.location.href;

    // Check if the URL contains 'app.hubspot.com/private-apps/'
    if (currentUrl.includes('app.hubspot.com/private-apps/')) {
      const appContainerSelector = ".private-layer[data-layer-for='UIModalPanel']";

      const observer = new MutationObserver(async (mutations) => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.matches(appContainerSelector)) {

                const headerSidebar = node.querySelector(".private-modal__header__inner");

                if (headerSidebar){
                  const selectScopesButton = createDomElement({
                    classes: [
                      "button--select-all-scopes",
                      "uiButton",
                      "private-button",
                      "private-button--primary",
                      "private-button--xs",
                      "private-button--non-link",
                    ],
                    text: "Select All Scopes",
                    type: "button",
                  });

                  const unSelectScopesButton = createDomElement({
                    classes: [
                      "button--unselect-all-scopes",
                      "uiButton",
                      "private-button",
                      "private-button--secondary",
                      "private-button--xs",
                      "private-button--non-link",
                    ],
                    text: "Unselects All Scopes",
                    type: "button",
                  });

                  headerSidebar.append(selectScopesButton, unSelectScopesButton);

                  headerSidebar.addEventListener("click", (e) => {
                    if (e.target.classList.contains("button--select-all-scopes")) {
                      handlerScopes(node);
                    } else if (e.target.classList.contains("button--unselect-all-scopes")) {
                      handlerScopes(node, true);
                      console.log(
                        "Click en el botón de deselección de todos los scopes"
                      );
                    }
                  });
                }
              }
            }
          });
        }
      });

      const targetNode = document.body;
      const config = { childList: true, subtree: true, attributes: true };

      observer.observe(targetNode, config);
    }
  });
  // ******************* End Private Apps page **********************/
})();
