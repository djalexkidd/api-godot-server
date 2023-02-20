const gameTitleField = document.querySelector(".game-name");
const gameName = window.location.pathname.split("/").pop();
gameTitleField.innerHTML = gameName.charAt(0).toUpperCase() + gameName.slice(1);