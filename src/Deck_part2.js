/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import axios from "axios";
import './Deck.css';

/* Deck: uses deck API, allows drawing card at a time. */
const Deck_part2 = () => {
    const [deck, setDeck] = useState(null);  
    const [remaining, setRemaining] = useState(null);
    const [cards, setCards] = useState([]);
    const [isAutoDrawing, setIsAutoDrawing] = useState(false);
    const timerId = useRef(null);


    /*  get a deck from API */
    async function getDeck() {
        const deckRes = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/");
        // make sure that we change state after getting back a response
        setDeck(deckRes.data);
        setRemaining(deckRes.data.remaining);
        setCards([]);
        setIsAutoDrawing(false);
    }


    /* get a random angle */
    const getRandomAngle = () => {
        return Math.floor(Math.random() * 360) + "deg";
    }


    /* get a card from the deck */
    async function getCard() {        
        const cardRes = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/`);
        if (cardRes.data.remaining === 0 && !cardRes.data.success) {
            setIsAutoDrawing(false);
            // stopTimer();
            return;
        }
        const card = cardRes.data.cards[0];
        card.tranformAngle = getRandomAngle();
        // make sure that we change state after getting back a response
        setCards(cards => [...cards, card]);
        setRemaining(cardRes.data.remaining);
    }

    const toggleAutoDrawing = () => {
         setIsAutoDrawing(!isAutoDrawing);
    }

    // const restart = () => {
    //     getDeck();
    //     setCards([]);  
    // }

    // if calling setDeck() with the return value of async getDeck(), not working, because getDeck() is async
    // useEffect(() => {        
    //     setDeck(getDeck());
    // }, [])


    // useEffect cannot be an async function, we must define an async function inside/outside and invoke it
  
  
    useEffect(() => { getDeck() }, []);

    useEffect(() => {
        if (isAutoDrawing) {
            timerId.current = setInterval(async () => {
                await getCard();
            }, 1000)
        }       

        return () => {
            clearInterval(timerId.current);
            timerId.current = null;
        };
    }, [isAutoDrawing])


    return (
        <div className="Deck">
            <button 
                className="Deck-giveCardBtn" 
                onClick={toggleAutoDrawing}
            >
                {(isAutoDrawing) ? "Stop Drawing" : "Start Drawing"}
            </button>
            <p className="Deck-remaining">{(remaining === 0) ? "No more!" : `Remaining: ${remaining}`}</p>
            {cards.map(card =>
                <Card
                    key={card.code}
                    image={card.image}
                    tranformAngle={card.tranformAngle}
                />
            )}
            {remaining < 52 && <button className="Deck-restartBtn" onClick={getDeck}>Restart</button>}
        </div>
    )

}

export default Deck_part2;