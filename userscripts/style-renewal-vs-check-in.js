<script type="text/javascript">

function applyCheckinClass(row) {
  if (row && !row.classList.contains('ttl-renewing')) {
    row.classList.add('ttl-checkin');
  }
}

const observer = new MutationObserver(() => {
  document.querySelectorAll('.select-item').forEach(checkbox => {
    console.log('found checkbox, checked:', checkbox.checked, 'row:', checkbox.closest('.incoming-item'));
    if (checkbox.checked) {
      const row = checkbox.closest('.incoming-item');
      applyCheckinClass(row);
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener('change', (e) => {
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

  // Unmark renewal if removed from checkout
  const removeBtn = e.target.closest('.remove-item');
  if (removeBtn) {
    const row = document.getElementById(`incoming-item-${removeBtn.dataset.id}`);
    if (row) row.classList.remove('ttl-renewing');
  }
});
</script>
