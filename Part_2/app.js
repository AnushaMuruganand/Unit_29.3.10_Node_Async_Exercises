// 1) Make a request to the Deck of Cards API to request a single card from a newly shuffled deck. Once you have the card, console.log the value and the suit (e.g. “5 of spades”, “queen of diamonds”).

async function part1() {
    let res = await axios.get("https://deckofcardsapi.com/api/deck/new/draw/");
    let {value , suit} = res.data.cards[0];
    console.log(`${value} of ${suit}`)
}
part1();

// 2) Make a request to the deck of cards API to request a single card from a newly shuffled deck. Once you have the card, make a request to the same API to get one more card from the same deck.
// Once you have both cards, console.log the values and suits of both cards.
let cards = [];

async function part2() {
    let res1 = await axios.get("https://deckofcardsapi.com/api/deck/new/draw/");
    cards.push(res1.data.cards[0]);
    let deck_id = res1.data.deck_id;

    let res2 = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/`);
    cards.push(res2.data.cards[0]);

    for (let card of cards) {
        console.log(`${card.value} of ${card.suit}`);
    }
}
part2();

// 3) Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. Every time you click the button, display a new card, until there are no cards left in the deck.

let deck_id;

const btn = document.querySelector("button");
const card = document.querySelector("#card-area");

async function part3() {
    // Create a new deck of cards from the API
    let res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/");
    deck_id = res.data.deck_id;

    // Displaying the button when we make this request
    btn.style.display = "block";
}
part3();

// When the button is clicked display a card from the DECK we created from API based on "deck_id" until there is no card in that DECK
btn.addEventListener("click", async function (e) {
    e.preventDefault();

    // Make a request to the API with the "deck_id" and draw a card and display it
    let res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/`);
    
    // Getting the card image from the response
    let cardImg = res.data.cards[0].image;
    console.log(res.data)

    // Appending the card into the DOM "#card-area" element
    card.innerHTML += cardMarkup(cardImg);

    // If all the cards in the deck is shown then hide the button 
    if (res.data.remaining === 0) btn.style.display = "none";
})

function cardMarkup(cardImg) {
    let angle = Math.random() * 90 - 45;
    let randomX = Math.random() * 40 - 20;
    let randomY = Math.random() * 40 - 20;
    return `<img src = ${cardImg} style = "transform: translate(${randomX}px, ${randomY}px) rotate(${angle}deg)">`;
}