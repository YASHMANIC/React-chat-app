import React from 'react'
import './details.css'
import { auth, db } from '../lib/firebase'
import { useUserStore } from './../lib/userStore';
import { useChatStore } from '../lib/chatStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
const Details = () => {
  const {currentUser} = useUserStore();
  const {chatId,user,isCurrentUserBlocked,isReceiverBlocked,changeBlock} = useChatStore();
  const handleBlock = async ()=>{
    if(!user) return;
    const userDocRef = doc(db,"users",currentUser.id);
    try {
      await updateDoc(userDocRef,{
        blocked: isCurrentUserBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      })
      changeBlock();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='details'>
      <div className="user">
        <img src={user?.avatar || './avatar.png'} alt=''/>
        <h2>{user?.username}</h2>
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
       <button onClick={handleBlock}>{isCurrentUserBlocked ? "You are blocked" :isReceiverBlocked?"User Blocked" : "Block User"}</button>
       <button className='logout' onClick={()=>auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Details
