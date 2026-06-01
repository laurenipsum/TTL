// Wait for the page to finish loading before running
document.addEventListener('DOMContentLoaded', () => {

  // Get all the .renew-btn elements
  const renewButtons = document.querySelectorAll('.renew-btn'); 

  // For each thing returned by renewButtons, call it 'button' and do a thing to it
  renewButtons.forEach((button) => {
    button.textContent = "Renew"; 
  });

});
