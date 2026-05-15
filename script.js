// Card Deck System
class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  getDisplay() {
    const valueMap = { 11: 'J', 12: 'Q', 13: 'K', 1: 'A', 'JKR': '🃏' };
    const suitMap = { 'hearts': '♥', 'diamonds': '♦', 'clubs': '♣', 'spades': '♠', 'joker': '' };
    const displayValue = valueMap[this.value] || this.value;
    return `${displayValue}${suitMap[this.suit]}`;
  }
}

class Deck {
  constructor() {
    this.cards = [];
    this.createDeck();
  }

  createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // Ace, 2-10, J, Q, K

    for (let suit of suits) {
      for (let value of values) {
        this.cards.push(new Card(suit, value));
      }
    }

    // Add two jokers
    this.cards.push(new Card('joker', 'JKR'));
    this.cards.push(new Card('joker', 'JKR'));
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard() {
    return this.cards.pop();
  }

  drawMultiple(count) {
    const drawnCards = [];
    for (let i = 0; i < count && this.cards.length > 0; i++) {
      drawnCards.push(this.drawCard());
    }
    return drawnCards;
  }

  getRemainingCount() {
    return this.cards.length;
  }
}

// Game State
const mainDeck = new Deck();
const playfield = [];
let playerHand = [];
let opponentHand = [];

// Initialize Game
function initGame() {
  mainDeck.shuffle();

  // Deal initial cards to players
  playerHand = mainDeck.drawMultiple(5);
  opponentHand = mainDeck.drawMultiple(5);

  renderCards();
}

// Render Cards to UI
function renderCards() {
  // Render player's hand
  const playerCardsContainer = document.querySelector('.my-cards-hand');
  playerCardsContainer.innerHTML = '';
  playerHand.forEach((card, index) => {
    const cardEl = createCardElement(card, 'player', index);
    playerCardsContainer.appendChild(cardEl);
  });

  // Render opponent's cards (face down)
  const opponentCardsContainer = document.querySelector('.opponent-cards');
  opponentCardsContainer.innerHTML = '';
  opponentHand.forEach((card, index) => {
    const cardEl = createCardElement(null, 'opponent', index);
    opponentCardsContainer.appendChild(cardEl);
  });

  // Render deck
  const deckContainer = document.querySelector('.cards-deck');
  deckContainer.innerHTML = '';
  if (mainDeck.getRemainingCount() > 0) {
    const deckEl = document.createElement('div');
    deckEl.className = 'card card-back';
    deckEl.textContent = mainDeck.getRemainingCount();
    deckEl.onclick = () => drawFromDeck();
    deckContainer.appendChild(deckEl);
  }

  // Render playfield (stacked)
  const playfieldContainer = document.querySelector('.playfield-cards');
  playfieldContainer.innerHTML = '';

  // Calculate total offset to center the stack
  const totalOffsetX = (playfield.length - 1) * 25;
  const totalOffsetY = (playfield.length - 1) * 25;
  const startX = -totalOffsetX / 2;
  const startY = -totalOffsetY / 2;

  playfield.forEach((card, index) => {
    const cardEl = createCardElement(card, 'playfield', index);
    const offsetX = startX + index * 25;
    const offsetY = startY + index * 25;
    const rotation = index * 5;
    cardEl.style.position = 'absolute';
    cardEl.style.zIndex = index;
    cardEl.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
    cardEl.style.top = '50%';
    cardEl.style.left = '50%';
    cardEl.style.marginTop = '-60px';
    cardEl.style.marginLeft = '-40px';
    playfieldContainer.appendChild(cardEl);
  });
}

function createCardElement(card, type, index) {
  const cardEl = document.createElement('div');

  if (type === 'opponent') {
    cardEl.className = 'card card-back';
    cardEl.textContent = '?';
  } else if (card) {
    cardEl.className = `card card-${card.suit}`;
    cardEl.textContent = '';
    cardEl.setAttribute('data-value', card.getDisplay());

    if (type === 'player') {
      cardEl.onclick = () => playCard(index);
      cardEl.style.cursor = 'pointer';
    }
  }

  return cardEl;
}

function drawFromDeck() {
  if (mainDeck.getRemainingCount() > 0) {
    const card = mainDeck.drawCard();
    playerHand.push(card);
    renderCards();
  }
}

function playCard(index) {
  const card = playerHand[index];
  playfield.push(card);
  playerHand.splice(index, 1);
  renderCards();
}

// Start game when page loads
document.addEventListener('DOMContentLoaded', initGame);
