// Watch for changes to the page (buttons are loaded via Ajax after page load)
const renameObserver = new MutationObserver(() => {
  // Get all .renew-btn elements that haven't been renamed yet
  document.querySelectorAll('.renew-btn:not([data-renamed])').forEach((button) => {
    // Rename the button and mark it so we don't process it again
    button.textContent = 'Renew';
    button.dataset.renamed = true;
  });
});

// Start watching the whole page for DOM changes
renameObserver.observe(document.body, { childList: true, subtree: true });
