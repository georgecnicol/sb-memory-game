const gameContainer = document.getElementById("game");
const startButton = document.getElementById("start");
let numCardVisible = 0;
let score = 0;
/*
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];
*/

const officeImages = [
  "images/g1.png",
  "images/g2.png",
  "images/g3.png",
  "images/g4.png",
  "images/g5.png",
  "images/g6.png",
  "images/g7.png",
  "images/g8.png",
  "images/g9.png",
  "images/g10.png",
  "images/g11.png",
  "images/g12.png",
]

function getNumber(){
  return (Math.floor(Math.random() * 5)) + 4 // between 4 and 8 pairs
}


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
//// This shuffles the officeImage order, we shorten the array in createDivs
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForImages(baseArray, aNumber) {
  if (aNumber > officeImages.length){
    aNumber = officeImages.length;
  }
  picArray = JSON.stringify(baseArray); //deep copy original
  picArray = JSON.parse(picArray);
  picArray.splice(aNumber, (picArray.length-aNumber)); // shorten pair values to needed length
  picArray = picArray.concat(picArray); // double - turn pair values into individual cards
  picArray = shuffle(picArray); // now shuffle the cards themselves
                                // the first shuffle just rnadomized which images would be used.
  for (const img of picArray ){
    // create a new div
    const newDiv = document.createElement("div");
    const newImg = document.createElement("img");

    // give it a class attribute for the value we are looping over
    newImg.classList.add("hidden");
    newImg.src=img;
    newImg.alt="pic from The Office";
    newImg.width="150";
    newImg.height="220";

    newDiv.append(newImg);
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  switch (numCardVisible){
    case 0:
      if(!event.target.classList.contains('visible')){ // clicking on matched card doesn't count
        event.target.classList.toggle('visible', true);
        numCardVisible++;
        updateScore();
      }
      break; // no timeout yet on one card
    case 1:
      if(!event.target.classList.contains('visible')){
        event.target.classList.toggle('visible', true);
        numCardVisible++;
        updateScore();
        if (isMatch()){
          numCardVisible = 0;
        }else{ //not matched
          setTimeout(function(){
            setNotVisible();
            numCardVisible = 0;
          },1000);
        }
      } // no action taken when clicking on card that is already visible
    default: // two or more cards already visible
      break;

  }
  // you can use event.target to see which element was clicked
  //console.log("you just clicked", event.target, "cards visible:", numCardVisible);
}

function updateScore(){
  score++;
  showMessage(`Your score: ${score}`);
}

// remove visible class from those cards that aren't a match
function setNotVisible(){
  const visibleCards = document.querySelectorAll('.visible');
    for(const card of visibleCards){
      if (!card.classList.contains('match')){
        card.classList.toggle('visible', false);
    }
  }
}


// a card only contains at most three classes: color, visible, match
function isMatch(){
  let match = false;
  const visibleCards = document.querySelectorAll('.visible:not(.match)');
  let a = visibleCards[0];
  let b = visibleCards[1];
    //if(a.classList.length == b.classList.length){ // have to have same length
  if(a.getAttribute('src') === b.getAttribute('src')){
    match = true;
    a.classList.toggle('match', true);
    b.classList.toggle('match', true);
  }
  return match; //new
}




// destroy the deck and recreate a new one
function rebuild(){
  setBestScore();
  showBestScore();
  const memCards = document.querySelectorAll('#game div');
  for (const card of memCards){
    card.remove();
  }
  let shuffledOffice = shuffle(officeImages);
  createDivsForImages(shuffledOffice, getNumber());
  numCardVisible = 0;
  score = 0;
  showMessage(`Your score: ${score}`);

}

// display a message, reset score.
function showMessage(message){
  const messageContainer = document.getElementById('messages');
  const newMessage = document.createElement('p');
  newMessage.innerText = message;
  if (messageContainer.firstElementChild){
    messageContainer.removeChild(messageContainer.firstElementChild); // remove old message
  };
  messageContainer.append(newMessage);
}

function showBestScore(){
  const messageContainer = document.getElementById('bestscore');
  const newMessage = document.createElement('p');
  if (!localStorage.bestScore){
    localStorage.bestScore = 100;
  }
  newMessage.innerText = `Best Score: ${localStorage.bestScore}`;
  if (messageContainer.firstElementChild){
    messageContainer.removeChild(messageContainer.firstElementChild); // remove old message
  };
  messageContainer.append(newMessage);
}

// make a reset button and initialize the game board and remove yourself
startButton.addEventListener('click', function(){
  makeResetButton();
  rebuild();
  showMessage(`Your score: ${score}`);
  startButton.remove()
})


// invoked when pressing start
function makeResetButton() {
  const buttonBox = document.querySelector(".button-container");
  const resetButton = document.createElement("button");
  resetButton.setAttribute('id', 'reset');
  resetButton.classList.add('button');
  resetButton.innerText = "Reset";
  resetButton.addEventListener('click', function(){
    rebuild();
  })
  buttonBox.append(resetButton);
}

function setBestScore(){
  let completeGame = true;
  const memCards = document.querySelectorAll('#game div');
  if (memCards.length){
    for (const card of memCards){
      if (!card.classList.contains('match')){
        completeGame = false;
      }
    }
  }else{ // !memCards.length
    completeGame = false;
  }
  if (completeGame){
    localStorage.bestScore = score;
  }
}






/* dark mode stuff */
const toggleSwitch = document.querySelector('#checkbox');

if(localStorage.darkmode == 'true'){
  toggleSwitch.checked = 'true';
  document.body.className = "dark";
}

toggleSwitch.addEventListener('click', function(e){
  const {checked} = toggleSwitch;
  document.body.className = checked ? "dark" : "";
  localStorage.darkmode = checked;
});
