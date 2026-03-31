//get all the .renew-btn elements
const renewButtons = document.querySelectorAll('.renew-btn'); 

//for each thing returned by renewButtons, call it 'button' and do a thing do it
renewButtons.forEach((button) => {
  button.textContent = "Renew"; 
});