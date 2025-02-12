function exportPeople(people) {
  const csv = ['Name,Role,Company,LinkedIn'];
  for (const person of people) {
    csv.push(
      `${person.name},${person.role},${person.company},${person.linkedIn}`,
    );
  }
  const csvContent = csv.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  GM_download(url, 'linkedin-search-results.csv');
}

export function parseSearchResults() {
  // Find search results
  // li item in ul in second div of div with class search-results-container
  const results = document.querySelectorAll(
    'div.search-results-container div:nth-child(2) ul.npFrdIwnjUnWcSAmnedpSMsmoBVMY li',
  );
  if (results.length === 0) return;

  // Verify all search results have class htUBjwMCFPTCQhfUTyujUArnHOoQFhhFHbcgWk, if not the data is not ready
  for (const result of results) {
    if (!result.classList.contains('htUBjwMCFPTCQhfUTyujUArnHOoQFhhFHbcgWk'))
      return;
  }

  const people = [];
  for (const result of results) {
    const person = {};
    // Extract name and LinkedIn profile link
    const firstLink = result.querySelector('a');
    const href = firstLink.href.split('?')[0];
    person['linkedIn'] = href;

    const img = firstLink.querySelector('img');
    if (img) person['name'] = img.alt;
    else {
      const name = firstLink.querySelector('div.visually-hidden');
      if (name) person['name'] = name.textContent.trim();
    }

    // Extract position
    const firstP = result.querySelector(
      'div.qivXzyrgLIrYokxdLJBRarMndkDohstxcYmnoV.TmdDCweNgyjeXdxtTOISGeSfIscbKIPfYuPkstY p',
    );
    if (firstP) {
      const text = firstP.textContent.trim().split(':')[1];
      // Split by the last 'at', everything before is the role and everything after is the company
      const split = text.split(' at ');
      if (split.length > 1) {
        person['role'] = split.slice(0, -1).join(' at ').trim();
        person['company'] = split[1].trim();
      } else {
        person['role'] = text.trim();
      }
    }

    people.push(person);
  }
  exportPeople(people);
  // Disconnect the observer
  return true;
}
