import { useState, useEffect, useRef } from "react";
import "../build/App.css";

const symbols = ["🐶", "🐱", "🐭", "🦊", "🐼", "🐯", "🐵"];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    initializeCards();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (matchedCards.length === symbols.length * 2) {
      setGameCompleted(true);
    }
  }, [matchedCards]);

  const initializeCards = () => {
    const newCards = symbols.flatMap((symbol) => [
      { symbol, isFlipped: false, isMatched: false },
      { symbol, isFlipped: false, isMatched: false },
    ]);

    shuffleCards(newCards);
    setCards(newCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setGameCompleted(false);
  };

  const shuffleCards = (cards) => {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  };

  const handleCardClick = (index) => {
    const flippedCardIndex = flippedCards[0];

    // Ignore click if the card is already flipped or matched
    if (cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    if (flippedCards.length === 1) {
      const flippedCard = cards[flippedCardIndex];

      if (flippedCard.symbol === cards[index].symbol) {
        const updatedCards = [...cards];
        updatedCards[index].isFlipped = true;
        updatedCards[index].isMatched = true;
        updatedCards[flippedCardIndex].isMatched = true;
        setCards(updatedCards);
        setMatchedCards([...matchedCards, index, flippedCardIndex]);
      } else {
        const updatedCards = [...cards];
        updatedCards[index].isFlipped = true;

        setTimeout(() => {
          updatedCards[index].isFlipped = false;
          updatedCards[flippedCardIndex].isFlipped = false;
          setCards(updatedCards);
        }, 1000);
      }

      setFlippedCards([]);
    } else {
      const updatedCards = [...cards];
      updatedCards[index].isFlipped = true;
      setCards(updatedCards);
      setFlippedCards([index]);
    }
  };

  const resetGame = () => {
    initializeCards();
  };

  const closePopup = () => {
    setGameCompleted(false);
  };

  const renderCards = () => {
    return cards.map((card, index) => (
      <div
        key={index}
        className={`card ${card.isFlipped ? "flipped" : ""} ${
          card.isMatched ? "matched" : ""
        }`}
        onClick={() => handleCardClick(index)}
      >
        <div className="card-inner">
          <div className="card-front">
            <span>{card.symbol}</span>
          </div>
          <div className="card-back"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="container">
      <h1>Memory Game</h1>
      <div className="card-grid">{renderCards()}</div>
      {gameCompleted && (
        <div className="popup">
          <div className="popup-content" ref={popupRef}>
            <h2>Congratulations!</h2>
            <p>You won the game!</p>
            <button className="btn" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
