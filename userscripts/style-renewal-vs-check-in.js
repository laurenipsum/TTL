// Helper function: add the check-in class to a row, but only if it's not already marked as a renewal
function applyCheckinClass(row) {
  if (row && !row.classList.contains('ttl-renewing')) {
    row.classList.add('ttl-checkin');
  }
}

// Watch for changes to the page (rows are loaded via Ajax after page load)
const renewalObserver = new MutationObserver(() => {
  // Find all checkboxes in the check-in table
  document.querySelectorAll('.select-item').forEach(checkbox => {
    // If the checkbox is already checked, mark the row as a check-in
    if (checkbox.checked) {
      const row = checkbox.closest('.incoming-item');
      applyCheckinClass(row);
    }
  });
});

// Start watching the whole page for DOM changes
renewalObserver.observe(document.body, { childList: true, subtree: true });

// Watch for checkbox changes
document.addEventListener('change', (e) => {
  // If a check-in checkbox was toggled, update the row class accordingly
  const checkbox = e.target.closest('.select-item');
  if (checkbox) {
    const row = checkbox.closest('.incoming-item');
    if (!row) return;
    if (checkbox.checked) {
      applyCheckinClass(row);
    } else {
      row.classList.remove('ttl-checkin');
    }
  }
});

// Watch for button clicks
document.addEventListener('click', (e) => {

  // Mark single row as renewal, clear check-in
  const renewBtn = e.target.closest('.renew-btn');
  if (renewBtn) {
    const row = document.getElementById(`incoming-item-${renewBtn.dataset.id}`);
    if (row) {
      row.classList.remove('ttl-checkin');
      row.classList.add('ttl-renewing');
    }
    return;
  }

  // Mark all rows as renewal, clear check-in
  if (e.target.closest('#renew-all')) {
    document.querySelectorAll('.incoming-item').forEach(row => {
      row.classList.remove('ttl-checkin');
      row.classList.add('ttl-renewing');
    });
    return;
  }

  // Mark single row as check-in
  const checkinBtn = e.target.closest('.checkin-btn');
  if (checkinBtn) {
    const row = document.getElementById(`incoming-item-${checkinBtn.dataset.id}`);
    applyCheckinClass(row);
    return;
  }

  // Mark all rows as check-in
  if (e.target.closest('#checkin-all')) {
    document.querySelectorAll('.incoming-item').forEach(row => {
      applyCheckinClass(row);
    });
    return;
  }

  // Unmark renewal if the item is removed from the checkout section
  const removeBtn = e.target.closest('.remove-item');
  if (removeBtn) {
    const row = document.getElementById(`incoming-item-${removeBtn.dataset.id}`);
    if (row) row.classList.remove('ttl-renewing');
  }

});
