// basic shell of constructor for future add player objects

class CreatePlayer{
  constructor(name,money,curBet){
    this.name = name
    this.money = money
    this.currentBet = curBet
    this.currentHand = ''
  }
  bet(){
   this.currentBet = prompt()
   this.money -= this.currentBet 
  }

  hit(){

  }

  stand(){

  }
}




document.querySelector('#deck').addEventListener('click', shuffleDeck)

//Need to go back and add card count to other functions eventually and have them update the remaining cards. Probably change from input to other element so it won't be confusing and save between referesh. Should add the deck and card count to local storage

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

// Need to add clear to the dealCards function to remove img tags added via hit on previous hand

function dealCards(){
  let deckId = localStorage.getItem('DeckID')
  
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        document.querySelector('#p1card1').src = data.cards[0].image 
        document.querySelector('#dcard1').src = data.cards[1].image
        document.querySelector('#p1card2').src = data.cards[2].image 
        document.querySelector('#dcard2').src = data.cards[3].image
        localStorage.setItem('cardsRemaining', data.remaining)
        document.querySelector('#deckRemaining').innerText = localStorage.getItem('cardsRemaining')

        let player1Val = convertToNum(data.cards[0].value) + convertToNum(data.cards[2].value)
        document.querySelector('#p1Value').innerText = player1Val
        let dealerVal = convertToNum(data.cards[1].value) + convertToNum(data.cards[3].value)
        document.querySelector('#dValue').innerText = dealerVal
        
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

document.querySelector('#p1Hit').addEventListener('click', p1Hit)

function p1Hit(){
  let deckId = localStorage.getItem('DeckID')

  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        localStorage.setItem('cardsRemaining', data.remaining)
        document.querySelector('#deckRemaining').innerText = localStorage.getItem('cardsRemaining')

        let newCard = document.createElement('img')
        newCard.classList.add("addedCard")
        newCard.setAttribute('src', data.cards[0].image)
        document.getElementById('p1Cards').appendChild(newCard)

        let player1Val = Number(document.querySelector('#p1Value').innerText)
        let cardValue = convertToNum(data.cards[0].value)

        //this works to adjust ace when an 11 would cause bust, need to add functionality to display bust in DOM, as well as display 21.
        if(player1Val + cardValue > 21){
          if(data.cards[0].value == 'ACE'){
            player1Val += 1
            document.querySelector('#p1Value').innerText = player1Val
          }else{
            document.querySelector('#p1Value').innerText = (player1Val + cardValue)
            console.log("Bust")
          }
        }else{
          document.querySelector('#p1Value').innerText = (player1Val + cardValue)
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function newHand(){
  document.querySelectorAll(".addedCard").forEach(element => element.remove())
  document.querySelectorAll(".starterCard").forEach(element => element.setAttribute('src', ""))
  document.querySelectorAll(".starterCard").forEach(element => element.setAttribute('src', ""))
}

document.querySelector("#newHand").addEventListener("click", newHand)