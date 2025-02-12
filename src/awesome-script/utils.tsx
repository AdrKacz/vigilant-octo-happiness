import styles from './style.module.css';

export function updateButtonTemplate(
  node: Node,
  text: string,
  onClick: () => void,
) {
  let button: HTMLElement | null = null;

  if (node.nodeName.toLowerCase() === 'button') {
    button = node as HTMLElement;
    button.classList.add(styles.awesomebutton);
  } else if (node instanceof Element) {
    button = node.querySelector('button');
    if (button) {
      button.classList.add(styles.awesomebutton);
    }
  }

  if (button) {
    button.textContent = text;
    button.onclick = onClick;
  }

  return node;
}

export function cleanUpButtonTemplate(node: Element) {
  // Remove all 'id' parameters (recursively)
  const removeId = (element: Element) => {
    if (element.hasAttribute('id')) {
      element.removeAttribute('id');
    }
    for (const child of element.children) {
      removeId(child);
    }
  };
  removeId(node);

  // Empty all aria-label parameters (recursively)
  const emptyAriaLabel = (element: Element) => {
    if (element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', '');
    }
    for (const child of element.children) {
      emptyAriaLabel(child);
    }
  };
  emptyAriaLabel(node);

  // Detach any function if any (recursively, if button)
  const detachFunctions = (element: Element) => {
    if (element.tagName.toLowerCase() === 'button') {
      (element as HTMLElement).onclick = null;
    }
    for (const child of element.children) {
      detachFunctions(child);
    }
  };
  detachFunctions(node);

  // Keep all classes
  return node;
}
