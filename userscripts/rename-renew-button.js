const observer = new MutationObserver(() => {
  //get all the .renew-btn elements; for each thing, call it 'button' and do a thing do it
  document.querySelectorAll('.renew-btn').forEach(button => {
    button.textContent = 'Renew';
  });
});

observer.observe(document.body, { childList: true, subtree: true });
