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



let deckId = ''

document.querySelector('#deck').addEventListener('click', shuffleDeck)

function shuffleDeck(){
  fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
  .then(res => res.json()) // parse response as JSON
  .then(data => {
    console.log(data)
    deckId = data.deck_id
    document.querySelector('#deckRemaining').value = data.remaining
    
  })
  .catch(err => {
      console.log(`error ${err}`)
  });
}

document.querySelector('#deal').addEventListener('click', dealCards)

function dealCards(){
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        document.querySelector('#p1card1').src = data.cards[0].image 
        document.querySelector('#dcard1').src = data.cards[1].image
        document.querySelector('#p1card2').src = data.cards[2].image 
        document.querySelector('#dcard2').src = data.cards[3].image

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
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)

        let newCard = document.createElement('img')
        newCard.setAttribute('src', data.cards[0].image)
        document.getElementById('p1Cards').appendChild(newCard)

        let player1Val = Number(document.querySelector('#p1Value').innerText)
        let cardValue = convertToNum(data.cards[0].value)

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
