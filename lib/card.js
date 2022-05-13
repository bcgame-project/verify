class Card {
    static POINTS = ' ,A,2,3,4,5,6,7,8,9,10,J,Q,K'.split(',');
    static SUITS = ['♠', '♥', '♣', '♦'];
    cardId;
    suit;
    suitStr;
    point;
    pointStr;
  
    constructor(cardId) {
      this.cardId = cardId;
  
      this.suit = (cardId & 240) / 16 - 10;
      this.suitStr = Card.SUITS[this.suit];
  
      this.point = cardId % 16;
      this.pointStr = Card.POINTS[this.point];
    }
  
    static encodeByString(suit, point) {
      return this.encode(Card.SUITS.indexOf(suit), Card.POINTS.indexOf(point));
    }
  
    static encode(suit, point) {
      return ((suit + 10) << 4) + point;
    }
  }
  
