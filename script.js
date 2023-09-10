const gameContainer = document.getElementById("game");
let numCardVisible = 0;

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

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
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

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  console.log("you just clicked", event.target, "cards visible:", numCardVisible);
  switch (numCardVisible){
    case 0:
      if(!event.target.classList.contains('visible')){ // clicking on matched card doesn't count
        event.target.classList.toggle('visible', true);
        numCardVisible++;
      }
      break; // no timeout yet on one card
    case 1:
      if(!event.target.classList.contains('visible')){
        event.target.classList.toggle('visible', true);
        numCardVisible++;
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
  console.log("now cards visible:", numCardVisible);
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
    if(a.classList.length == b.classList.length){ // have to have same length
      for(let value of a.classList){
        if(value !== 'match' && value !== 'visible'){ // value should be a color
          if(b.classList.contains(value)){ // is the color found in the other classlist?
            match = true;
            a.classList.toggle('match', true);
            b.classList.toggle('match', true);
          }
        }
      }
    }
  return match;
}


// when the DOM loads
createDivsForColors(shuffledColors);
