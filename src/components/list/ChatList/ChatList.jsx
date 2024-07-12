import React, { useEffect, useState } from 'react'
import './chatList.css'
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import AddUser from './adduser/AddUser';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';
const ChatList = () => {
  const {currentUser} = useUserStore();
  const[chats,setChats] = useState([]);
  const[add,setAdd] = useState(false);
  useEffect(()=>{
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async(res) => {
      const items = res.data().chats;
      const promises= items.map(async(item)=>{
        const userDocRef =doc(db,"users",item.receiverId) ;
        const userDocSnap =await getDoc(userDocRef) ;
        const user = userDocSnap.data();
        return {...item , user}
      })
      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a,b)=>b.updatedAt-a.updatedAt))
  });
  return ()=>{
    unSub();
  }
  },[currentUser.id])
  return (
    <div className='chatlist'>
      <div className="search">
        <div className="searchbar">
          <img src='./search.png' />
          <input type='text' placeholder='search'/>
        </div>
        <img src={add ? "./minus.png":"./plus.png"} className='add' onClick={() => setAdd((prev)=>!prev)} />
        
      </div>
      {chats.map((chat)=>(
       <div className="item" key={chat.chatId}>
       <img src={chat.user.avatar ||  './avatar.png'} />
       <div className="texts">
         <span>{chat.user.username}</span>
      <p>{chat.lastMessage}</p>
       </div>
       </div>
      ))}
        {add && <AddUser/>}
    </div>
  )
}

export default ChatList


{/* <div className="item" key='chats.chatId'>
          <img src='./avatar.png' />
          <div className="texts">
            <span>Manic</span>
         <p>Hello</p>
          </div>
          </div> */}