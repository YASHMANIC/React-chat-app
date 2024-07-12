import React from 'react'
import './details.css'
import { auth } from '../lib/firebase'
const Details = () => {
  return (
    <div className='details'>
      <div className="user">
        <img src='./avatar.png'alt=''/>
        <h2>Manic</h2>
        <p>Lorem asip emit.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat settings</span>
            <img src='./arrowUp.png'alt='' />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat settings</span>
            <img src='./arrowUp.png'alt='' />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy % help</span>
            <img src='./arrowUp.png'alt='' />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>SharedPhotos</span>
            <img src='./arrowDown.png'alt='' />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetails">
            <img src='https://c.pxhere.com/photos/d1/ac/cascade_cloudy_environment_falls_lake_landscape_mountain_range_mountains-1174399.jpg!d' />
              <span>Photo_png</span>
              </div>
            <img src='./download.png' alt='' className='icon' />
            </div> 
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>SharedFiles</span>
            <img src='./arrowUp.png'alt='' />
          </div>
        </div>
       <button>Block User</button>
       <button className='logout' onClick={()=>auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Details
