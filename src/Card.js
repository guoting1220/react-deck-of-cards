import React, { useState, useSffect } from 'react';
import "./Card.css"

const Card = ({ image, tranformAngle}) => {  

    return (
        <div className="Card">
            <img src={image} alt="" style={{ "transform": `rotate(${tranformAngle})`}}></img>
        </div>
    )
}

export default Card;