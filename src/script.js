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
  if (document.body.dataset.gcrt) return;
  document.body.setAttribute("data-gcrt", true);

  // Add styles to document.head
  const styleEl = document.createElement("style");
  styleEl.setAttribute("data-gcrt", true);
  styleEl.innerText = `
      details[data-gcrt] {
      	--border: 1px solid var(--color-border-primary);
        background: var(--color-bg-primary);
      	bottom: 0;
        box-shadow: 0 0 8px hsla(0, 0%, 0%, 0.2);
        left: 0;
      	position: fixed;
        right: 0;
        z-index: 10000;
      }

      details[data-gcrt] > * {
        padding: 8px;
      }

      details[data-gcrt] summary {
      	background-color: var(--color-bg-secondary);
        border-bottom: var(--border);
        border-top: var(--border);
      }

      details[data-gcrt] footer {
      	border-top: var(--border);
        text-align: center;
      }
    `;
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

  //
  const toolboxFooter = document.createElement("footer");
  toolboxFooter.innerHTML =
    "<small>Hacked together at Niche's Learn Over Lunch 🥪</small>";
  detailsEl.appendChild(toolboxFooter);
})();