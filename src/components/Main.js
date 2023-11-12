import React from 'react'
import "./Main.css"
import { Link } from "react-router-dom";
import MainPage from "./MainPage";


const Main = () => {
  return (

    <div className="main-page">

      <div className="text-container">
       
        <p className="text">KOD ACIKTIRIR,</p>
        <p className="text">PİZZA DOYURUR!</p>
        <p className='italic-text'>fırsatı kaçırma</p>
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