import VM from '@violentmonkey/dom';
import { parseSearchResults } from './parseSearchResults';
import { cleanUpButtonTemplate, updateButtonTemplate } from './utils';
// global CSS
import globalCss from './style.css';
// CSS modules
import { stylesheet } from './style.module.css';
GM_addStyle(globalCss + stylesheet);

// Add a button in the filter bar similar to the previous one
const randomId = Math.random().toString(36).slice(2);
VM.observe(document.body, () => {
  // Check the element is not already here
  if (document.getElementById(randomId)) return;

  // Find the nav bar's second div
  const nav = document.querySelector('div#search-reusables__filters-bar');
  if (!nav) return;

  // Get second div within the fist div
  const div = nav.querySelector('div.display-flex.align-items-center');
  if (!div) return;

  // Capture the second child of the div
  const separator = div.querySelector(':first-child');
  const child = div.querySelector(':nth-child(2)');
  if (!separator || !child) return;
  const template = cleanUpButtonTemplate(child);

  // Duplicate the second div before editing it
  const divClone = div.cloneNode(true);
  (divClone as HTMLElement).id = randomId;
  // Remove all children
  while (divClone.firstChild) {
    divClone.removeChild(divClone.firstChild);
  }
  // Add separator
  divClone.appendChild(separator.cloneNode(true));

  // Add button from the template, text is 'Export results' and onclick show an alert
  const exportButton = updateButtonTemplate(
    template.cloneNode(true),
    'Export results',
    () => {
      if (!parseSearchResults()) VM.observe(document.body, parseSearchResults);
    },
  );
  divClone.appendChild(exportButton);

  // Append newDiv to the nav
  nav.appendChild(divClone);
});
