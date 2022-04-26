/* NEXT STEPS:
- clean up general play functionality eg new hand/deal cards should be obvious as next steps
- add betting and system to keep track of player bets
*/

const player1 = {
  name: "Player 1",
  total: 0,
  cardValues: [],
  bust: false,
  money: 0,
  currentBet: 0,

  hit: function(){
    // grabs deckID from storage and sets API url to draw 1 card
    let deckId = localStorage.getItem('DeckID')
    const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
          // Locally stores cards remaining and adds value to DOM
          localStorage.setItem('cardsRemaining', data.remaining)
          document.querySelector('#deckRemaining').innerText = localStorage.getItem('cardsRemaining')

          // Creates new img element and adds the card drawn to player 1's hand
          let newCard = document.createElement('img')
          newCard.classList.add("addedCard")
          newCard.setAttribute('src', data.cards[0].image)
          document.getElementById('p1Cards').appendChild(newCard)

          // Adds value of new card to player1 object cardvalues array
          player1.cardValues.push(convertToNum(data.cards[0].value))
          player1.calcTotal()
        })
        .catch(err => {
          console.log(`error ${err}`)
      });
    
    
  },

  stand: function(){
    return dealer.playTurn()
  },
  
  calcTotal: function(){
    // Calculate current total
    player1.total = player1.cardValues.reduce((a,c) => a + c)
    // if less than 21, display total in the DOM
    if(player1.total <= 21){
      document.querySelector('#p1Value').innerText = player1.total
    }else if (player1.total > 21){
      // if over 21, determine if there is an ace. If so, replace value with 1 and rerun this method
      if(player1.cardValues.includes(11)){
        let index = player1.cardValues.findIndex(x => x > 10)
        player1.cardValues.splice(index, 1, 1)
        return player1.calcTotal()
      // if no ace, player busts. Display total in DOM and run bust method
      }else{
        document.querySelector('#p1Value').innerText = player1.total
        player1.bust = true
        return player1.playerBust()
      }
    }
  },

  playerBust: function(){
    document.querySelector("#result").innerText = `${this.name} busts!`
    // add functions here to clear the player's bet and restrict access to hit and stand buttons
  },
}

const dealer = {
  total: 0, //used to store dealer's total card value
  cardValues: [], //stores card values in an array that can be summed to a total and modified for aces when soft hands exist
  bust: false, // true/false to identify if the dealer has busted

  // The hit function only performs the hit, makes the API call and adds that card to the DOM, cardValues, and total. after the hit is complete, returns playTurn function
  hit: function(){
    let deckId = localStorage.getItem('DeckID') // locally stored DeckID for use with API call
    const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`

    fetch(url)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            console.log(data)
            localStorage.setItem('cardsRemaining', data.remaining) // locally stored cards remaining, next line places in the DOM. might get rid of DOM display later
            document.querySelector('#deckRemaining').innerText = localStorage.getItem('cardsRemaining')
            
            // Creates new image element with addedCard class, pulls the card image from the API response and adds to the DOM
            let newCard = document.createElement('img') 
            newCard.classList.add("addedCard")
            newCard.setAttribute('src', data.cards[0].image)
            document.getElementById('dCards').appendChild(newCard)
            
            // adds newly drawn card value to dealer cardValues and updates total, then updates total display in the DOM
            this.cardValues.push(Number(convertToNum(data.cards[0].value)))
            this.total = this.cardValues.reduce((a,c) => a + c)
            document.querySelector('#dValue').innerText = this.total
          })
          .then(data => {
            this.playTurn() // runs playTurn function
          })
            .catch(err => {
              console.log(`error ${err}`)
          });

  },

  // playTurn function performs dealer total calculations and determines next step in dealer's turn
  playTurn: function(){
    document.querySelector(".cardBack").hidden = true
    document.querySelector('#dcard2').hidden = false
    
    this.total = this.cardValues.reduce((a,c) => a + c)
    document.querySelector('#dValue').innerText = this.total
    if(this.total > 16 && this.total <= 21){
      return calcWinner() // returns calcWinner function if dealer is within stand parameters
    }else if(this.total < 17){
      return this.hit() // tells dealer to hit if under 17
    }else if(this.total > 21){ // if dealer is over 21, checks to see if the hand was soft with an ace included. If an ace exists on the cardValues property, replaces it with a 1, updates the total, and reruns this function. If no ace, declares bust and runs calcWinner function
      if(this.cardValues.includes(11)){
        this.cardValues = this.cardValues.filter(x => x < 11)
        this.cardValues.push(1)

        // let index = this.cardValues.findIndex(x => x > 10)
        // this.cardValues.splice(index, 1, 1)
        return this.playTurn() 
      }else{
        this.bust = true
        return calcWinner()
      }
    }
  },
  
}
    
document.querySelector('#deckRemaining').innerText = localStorage.getItem('cardsRemaining')

document.querySelector('#deck').addEventListener('click', shuffleDeck)

function shuffleDeck(){
  fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
  .then(res => res.json()) // parse response as JSON
  .then(data => {
    console.log(data)
    localStorage.setItem('DeckID', data.deck_id)
    localStorage.setItem('cardsRemaining', data.remaining)
    document.querySelector('#deckRemaining').innerText = localStorage.getItem('cardsRemaining')
    
  })
  .catch(err => {
      console.log(`error ${err}`)
  });
}

document.querySelector('#deal').addEventListener('click', dealCards)

function dealCards(){
  // grabs deckID from storage and sets API url to draw 4 cards
  let deckId = localStorage.getItem('DeckID')
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        // Locally stores cards remaining and adds value to DOM
        localStorage.setItem('cardsRemaining', data.remaining)
        document.querySelector('#deckRemaining').innerText = localStorage.getItem('cardsRemaining')

        // Add Card Images to the DOM. Dealer's second card is hidden
        document.querySelector('#p1card1').src = data.cards[0].image 
        document.querySelector('#dcard1').src = data.cards[1].image
        document.querySelector('#p1card2').src = data.cards[2].image 
        document.querySelector('#dcard2').src = data.cards[3].image
        document.querySelector('#dcard2').hidden = true

        // Creates face down card image for dealer's second card
        let backCard = document.createElement('img')
        backCard.classList.add("addedCard", "cardBack")
        backCard.setAttribute('src', "images/cardback.png")
        document.getElementById('dCards').appendChild(backCard)

        // Adds player1's cards to cardvalues and total properties on object, then adds total to DOM
        player1.cardValues.push(convertToNum(data.cards[0].value))
        player1.cardValues.push(convertToNum(data.cards[2].value))
        player1.total = player1.cardValues.reduce((a,c) => a + c)
        document.querySelector('#p1Value').innerText = player1.total

        // Adds dealer's cards to cardvalues and total properties on object, then sets total to only the first card
        dealer.cardValues.push(convertToNum(data.cards[1].value))
        dealer.cardValues.push(convertToNum(data.cards[3].value))
        dealer.total = dealer.cardValues[0]
        document.querySelector('#dValue').innerText = dealer.total
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function convertToNum(val){
  if(val === 'ACE'){
    return 11
  }else if(val === 'KING'){
    return 10
  }else if(val === 'QUEEN'){
    return 10
  }else if(val === 'JACK'){
    return 10
  }else{
    return Number(val)
  }
}

document.querySelector('#p1Hit').addEventListener('click', player1.hit)

function newHand(){
  
  // actions to clear display of the DOM
  document.querySelectorAll(".addedCard").forEach(element => element.remove())
  document.querySelectorAll(".starterCard").forEach(element => element.setAttribute('src', ""))
  document.querySelectorAll(".values").forEach(element => element.innerText = "")
  document.querySelector("#result").innerText = "Result: "

  // actions to clear object property values:
  dealer.total = 0
  dealer.cardValues = []
  dealer.bust = false
  player1.total = 0
  player1.cardValues = []
  player1.bust = false
  player1.currentBet = 0

}

document.querySelector("#newHand").addEventListener("click", newHand)

document.querySelector(".stand").addEventListener("click", player1.stand)

function calcWinner(){
  let result

  if(player1.total > dealer.total){
    result = "Player 1 wins!"
    player1.money += player1.currentBet * 2
    //add money value to DOM
  }else if(dealer.bust == true){
    result = "Dealer Busts! Player 1 wins!"
    player1.money += player1.currentBet * 2
    //add money value to DOM
  }else if(player1.total == dealer.total){
    result = "Draw"
    player1.money += player1.currentBet
    //add money value to DOM
  }else if(player1.total < dealer.total){
    result = "Dealer wins!"
  }
  document.querySelector("#result").innerText = result
}

