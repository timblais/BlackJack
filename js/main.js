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


document.querySelector('#deckRemaining').innerText = localStorage.getItem('cardsRemaining')

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
        document.querySelector('#dcard2').hidden = true

        let backCard = document.createElement('img')
        backCard.classList.add("addedCard", "cardBack")
        backCard.setAttribute('src', "images/cardback.png")
        document.getElementById('dCards').appendChild(backCard)


        localStorage.setItem('cardsRemaining', data.remaining)
        document.querySelector('#deckRemaining').innerText = localStorage.getItem('cardsRemaining')
        localStorage.setItem("hiddenValue", data.cards[3].value)

        let player1Val = convertToNum(data.cards[0].value) + convertToNum(data.cards[2].value)
        document.querySelector('#p1Value').innerText = player1Val
        let dealerVal = convertToNum(data.cards[1].value) 
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
  let result

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
            result = "Player 1 busts!"
            document.querySelector("#result").innerText = result
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
  document.querySelectorAll(".values").forEach(element => element.innerText = "")
  document.querySelector("#result").innerText = "Result: "
}

document.querySelector("#newHand").addEventListener("click", newHand)


function stand(){
  document.querySelector(".cardBack").remove()
  document.querySelector('#dcard2').hidden = false
  
  let hiddenVal = convertToNum(localStorage.getItem("hiddenValue"))
  let dealerVal = Number(document.querySelector('#dValue').innerText)
  document.querySelector('#dValue').innerText = dealerVal + hiddenVal

  dealerVal = dealerVal + hiddenVal

  return dealerVal > 16 ? calcWinner() : dealerHit()

}

document.querySelector(".stand").addEventListener("click", stand)

function calcWinner(){
  let p1Val = Number(document.getElementById('p1Value').innerText)
  let dVal = Number(document.getElementById('dValue').innerText)
  let result

  if(p1Val > dVal){
    result = "Player 1 wins!"
  }else if(p1Val == dVal){
    result = "Draw"
  }else if(p1Val < dVal){
    result = "Dealer wins!"
  }
  document.querySelector("#result").innerText = result
}

function dealerHit(){
  let deckId = localStorage.getItem('DeckID')
  let result
  let dealerVal = Number(document.querySelector('#dValue').innerText)

  if(dealerVal > 16 && dealerVal <=21){
    return calcWinner()
  }else{
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
          document.getElementById('dCards').appendChild(newCard)
  
          let dealerVal = Number(document.querySelector('#dValue').innerText)
          let cardValue = convertToNum(data.cards[0].value)
  
          //this works to adjust ace when an 11 would cause bust, need to add functionality to display bust in DOM, as well as display 21.
          if(dealerVal + cardValue > 21){
            if(data.cards[0].value == 'ACE'){
              dealerVal += 1
              document.querySelector('#dValue').innerText = dealerVal
              //currently only accounts for the last card being an ace. Probably need to store the first two cards in local storage or on a dealer object. First need to create dealer object. maybe having hit/stand as object methods would be cleaner in the end
            }else{
              document.querySelector('#dValue').innerText = (dealerVal + cardValue)
              console.log("Bust")
              result = "Dealer busts! Player 1 wins!"
              document.querySelector("#result").innerText = result
            }
          }else{
            document.querySelector('#dValue').innerText = (dealerVal + cardValue)
            return dealerHit()
          }
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
  }

  
}