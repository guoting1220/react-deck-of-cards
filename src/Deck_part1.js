/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Card from './Card';
import axios from "axios";
import './Deck.css';

/* Deck: uses deck API, allows drawing card at a time. */
const Deck_part1 = () => {
    const [deck, setDeck] = useState(null);
    // const [card, setCard] = useState({});
    const [remaining, setRemaining] = useState(null);
    const [cards, setCards] = useState([]);


    /*  get a deck from API */
    async function getDeck () {
        const deckRes = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/");  
        setDeck(deckRes.data); 
        setRemaining(deckRes.data.remaining); 
    }

    // if calling setDeck() with the return value of async getDeck(), not working, because getDeck() is async
    // useEffect(() => {        
    //     setDeck(getDeck());
    // }, [])


    // useEffect cannot be an async function, we must define an async function inside/outside and invoke it

    useEffect(() => {getDeck()}, [])


    const getRandomAngle = () => {
        return Math.floor(Math.random() * 360) + "deg";
    }

    /* get a card from the deck */
    async function getCard() {
        if (remaining === 0) return;
        const cardRes = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/`);
        const card = cardRes.data.cards[0];
        card.tranformAngle = getRandomAngle();
        setCards(cards => [...cards, card]);
        setRemaining(cardRes.data.remaining); 
    }


    return (
        <div className="Deck">            
            <button className="Deck-giveCardBtn" onClick={getCard}>Start </button>
            <p className="Deck-remaining">{(remaining === 0) ? "No more!" : `Remaining: ${remaining}`}</p>        
            {cards.map(card => 
                <Card 
                    key={card.code}
                    image={card.image} 
                    tranformAngle={card.tranformAngle}
                />
            )}            
        </div>
    )

}

export default Deck_part1;