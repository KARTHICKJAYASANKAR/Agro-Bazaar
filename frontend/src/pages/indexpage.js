import React from 'react'
import '../App.css'

function indexpage() {
  return (
    <div className='indexpage'>
    <div className='index-container'>
      <h3 className='index-heading'>Welcome to </h3>
      <span class="animate-charcter">AgroBazaar</span>
      <div className='ind-btn-div'>
        <a href="/signinbuyer"> <button className='index-btn buy-btn'>Buy</button> </a>
        <a href="/signinseller"> <button className='index-btn sell-btn'>Sell</button> </a> 
      </div>
    </div>
  </div>
  )
}

export default indexpage;
