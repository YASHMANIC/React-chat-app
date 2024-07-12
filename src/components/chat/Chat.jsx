import React, { useEffect, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { IoIosSend } from "react-icons/io";
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
const Chat = () => {
  const [chat,setChat] = useState();
  const[open,setOpen] = useState(false);
  const[text,setText] = useState("");
  const handleEmoji = (e) =>{
    setText((prev)=> prev+e.emoji)
    setOpen(false);
  }
  const endRef = useRef(null)
  useEffect(()=>{
      endRef.current?.scrollIntoView({behavior:"smooth"});
  },[])

  useEffect(()=>{
    const unSub = onSnapshot(doc(db,"chats","OuhYXcGx3DTTGlBjtCFg"),(res)=>{
      setChat(res.data())
    })
    return ()=>{
      unSub();
    }
  },[])
  console.log(chat)

  return (
    <div className='chat'>
      <div className="top">
      <div className="user">
        <img src='./avatar.png' />
        <div className="texts">
          <span>Manic</span>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
        </div>
      </div>
      <div className="icons">
        <img src='./phone.png'/>
        <img src='./video.png' />
        <img src='./info.png' />
      </div>
      </div>
      <div className="center">
        <div className="message own">
          <div className="texts">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Necessitatibus in, nobis sequi saepe
              itaque ipsam modi aut deleniti dolorum nam officiis maiores dolor delectus neque voluptas 
              distinctio laboriosam nihil? Minima.</p>
              <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src='./avatar.png'alt=''/>
          <div className="texts">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Necessitatibus in, nobis sequi saepe
              itaque ipsam modi aut deleniti dolorum nam officiis maiores dolor delectus neque voluptas 
              distinctio laboriosam nihil? Minima.</p>
              <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Necessitatibus in, nobis sequi saepe
              itaque ipsam modi aut deleniti dolorum nam officiis maiores dolor delectus neque voluptas 
              distinctio laboriosam nihil? Minima.</p>
              <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
        <img src='./avatar.png'alt=''/>
          <div className="texts">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Necessitatibus in, nobis sequi saepe
              itaque ipsam modi aut deleniti dolorum nam officiis maiores dolor delectus neque voluptas 
              distinctio laboriosam nihil? Minima.</p>
              <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
          <img src='https://c.pxhere.com/photos/d1/ac/cascade_cloudy_environment_falls_lake_landscape_mountain_range_mountains-1174399.jpg!d' />
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Necessitatibus in, nobis sequi saepe
              itaque ipsam modi aut deleniti dolorum nam officiis maiores dolor delectus neque voluptas 
              distinctio laboriosam nihil? Minima.</p>
              <span>1 min ago</span>
          </div>
        </div>
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src='./img.png' alt=''/>
          <img src='./camera.png' alt=''/>
          <img src='./mic.png' alt=''/>
        </div>
        <input type='text' placeholder='Send a Message' value={text} onChange={(e) => setText(e.target.value)}/>
        <div className="emoji">
          <img src='./emoji.png' alt='' onClick={() => setOpen((prev)=>!prev)}/>
            <div className="picker">
          <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
            </div>
        </div>
        <button className='sendButton'><IoIosSend /></button>
      </div>
    </div>
  )
}

export default Chat
