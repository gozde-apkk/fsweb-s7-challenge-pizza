import React from 'react'
import "./Main.css"
import { Link } from "react-router-dom";


const Main = () => {
  return (

    <div className="main-page">

      <div className="text-container">
        <p className='italic-text'>fırsatı kaçırma</p>
        <p className="text">KOD ACIKTIRIR,</p>
        <p className="text">PİZZA DOYURUR!</p>
      </div>

      <br />

      <div className="button-container">

        <Link to="/pizza">
          <button id="order-pizza" type="button" data-test-id="main-page-link"> ACIKTIM </button>
        </Link>

      </div>

    </div>

  )
}

export default Main