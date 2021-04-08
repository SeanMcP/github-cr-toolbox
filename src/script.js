// ==UserScript==
// @name         GitHub CR Toolkit
// @namespace    https://niche.com
// @version      0.2
// @description  Floating tools to make code reviews on GitHub a little easier
// @author       #learn-over-lunch
// @match        https://github.com/*/*/pull/*/files*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  if (document.body.dataset.gcrt)
    return console.info("🧰 GitHub CR Toolbox already installed");
  document.body.setAttribute("data-gcrt", true);

  // Add styles to document.head
  const styleEl = document.createElement("style");
  styleEl.setAttribute("data-gcrt", true);
  styleEl.innerText = "%CSS%";
  document.head.appendChild(styleEl);

  // Create details element
  const detailsEl = document.createElement("details");
  detailsEl.setAttribute("data-gcrt", true);
  document.body.appendChild(detailsEl);

  const summaryEl = document.createElement("summary");
  summaryEl.textContent = "🧰 GitHub CR Toolbox";
  detailsEl.appendChild(summaryEl);

  // Create container for tools
  const toolboxEl = document.createElement("div");
  detailsEl.appendChild(toolboxEl);

  // Add tools to `toolboxEl`
  const collapseAllFilesButton = document.createElement("button");
  collapseAllFilesButton.classList.add("btn");
  collapseAllFilesButton.textContent = "Collapse all files";
  toolboxEl.appendChild(collapseAllFilesButton);

  collapseAllFilesButton.addEventListener("click", (event) => {
    event.preventDefault();

    document.querySelectorAll(".file.open").forEach((node) => {
      const collapseButton = node.querySelector(".file-info button");
      if (collapseButton) {
        collapseButton.click();
      } else {
        console.log(collapseButton);
      }
    });
  });

  const expandAllFilesButton = document.createElement("button");
  expandAllFilesButton.classList.add("btn");
  expandAllFilesButton.textContent = "Expand all files";
  toolboxEl.appendChild(expandAllFilesButton);

  expandAllFilesButton.addEventListener("click", (event) => {
    event.preventDefault();

    document.querySelectorAll(".file:not(.open)").forEach((node) => {
      const collapseButton = node.querySelector(".file-info button");
      if (collapseButton) {
        collapseButton.click();
      } else {
        console.log(collapseButton);
      }
    });
  });

  const smartCollapseForm = document.createElement("form");
  smartCollapseForm.innerHTML = `
  	<input class="form-control" name="string" />
    <button class="btn">Collapse all</button>
  `;
  smartCollapseForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const string = new FormData(event.target).get("string");

    [...document.querySelectorAll(".file.open")]
      .filter((node) => {
        // TODO: Escape something somehow
        return node.querySelector(`.file-header[data-path*=${string}]`);
      })
      .forEach((node) => {
        const collapseButton = node.querySelector(".file-info button");
        if (collapseButton) {
          collapseButton.click();
        }
      });
  });
  toolboxEl.appendChild(smartCollapseForm);

  const smartViewForm = document.createElement("form");
  smartViewForm.innerHTML = `
  	<input class="form-control" name="string" />
    <button class="btn">View all</button>
  `;
  smartViewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const string = new FormData(event.target).get("string");

    [...document.querySelectorAll(".file")]
      .filter((node) => {
        // TODO: Escape something somehow
        return node.querySelector(`.file-header[data-path*=${string}]`);
      })
      .forEach((node) => {
        const viewedCheckbox = node.querySelector(
          "input[type=checkbox][name=viewed]:not([checked])"
        );
        if (viewedCheckbox) {
          viewedCheckbox.click();
        }
      });
  });
  toolboxEl.appendChild(smartViewForm);

  const highlightLabel = document.createElement("label");
  const labelTextNode = document.createTextNode("Highlight token");
  highlightLabel.appendChild(labelTextNode);
  const highlightCheckbox = document.createElement("input");
  highlightCheckbox.type = "checkbox";
  highlightLabel.appendChild(highlightCheckbox);

  const highlightStyle = document.createElement("style");
  highlightStyle.dataset.gcrt = "highlight-style";
  document.head.appendChild(highlightStyle);

  highlightStyle.innerHTML = `
    [data-gcrt="highlighted"] {
      background-color: rgba(255, 255, 0, 50%);
      font-weight: 900;
    }
  `;

  const highlightedNodes = [];

  function highlightToken(event) {
    const { target } = event;
    if (target.dataset.gcrt === "highlighted") {
      // Unhighlight all highlighted nodes with matching class and text content
      return highlightedNodes.forEach((node) => {
        if (
          node.classList.toString() === target.classList.toString() &&
          node.textContent === target.textContent
        ) {
          node.removeAttribute("data-gcrt");
        }
      });
    }

    // Check first if event.target is within a code preview block
    if (
      !target.classList.contains("blob-code-inner") &&
      !target.parentNode.classList.contains("blob-code-inner")
    ) {
      return;
    }

    const selector = "." + target.classList[0];
    document.querySelectorAll(selector).forEach((node) => {
      if (node.textContent === target.textContent) {
        node.dataset.gcrt = "highlighted";
        highlightedNodes.push(node);
      }
    });
  }

  highlightCheckbox.addEventListener("change", (event) => {
    event.preventDefault();

    if (event.target.checked) {
      window.addEventListener("click", highlightToken);
    } else {
      window.removeEventListener("click", highlightToken);
    }
  });

  toolboxEl.appendChild(highlightLabel);

  //
  const toolboxFooter = document.createElement("footer");
  toolboxFooter.innerHTML =
    "<small>Hacked together at <a href='https://niche.com' target='_blank'>Niche</a>'s Learn Over Lunch 🥪</small>";
  detailsEl.appendChild(toolboxFooter);
})();

/*
// VIVAN'S EXTRA-SPECIAL HIGHLIGHTING (by VIVAN, for VIVAN)
window.addEventListener('click', event=>{
    if (event.target.classList.contains('pl-en')) {
        document.querySelectorAll('.pl-en').forEach(node => {
            if (node.textContent === event.target.textContent) {
                node.style.fontWeight = '900'
            }
        })
    }
}
)
*/
