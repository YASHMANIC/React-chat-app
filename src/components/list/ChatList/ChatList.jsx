import React, { useEffect, useState } from 'react'
import './chatList.css'
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import AddUser from './adduser/AddUser';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';
const ChatList = () => {
  const {currentUser} = useUserStore();
  const {changeChat} = useChatStore();
  const[chats,setChats] = useState([]);
  const [input,setInput] = useState("");
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

  const handleSelect = async (chat)=>{
    const userChats = chats.map((item) => {
      const {user,...rest} = item;
      return rest;
    })
    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)
    userChats[chatIndex].isSeen = true;
    const userChatRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatRef,{chats:userChats});
      changeChat(chat.chatId,chat.user)
    } catch (error) {
      console.log(error);
    }
  }

  const filteredChats = chats.filter((c)=>c.user.username.toLowerCase().includes(input.toLowerCase()))
  return (
    <div className='chatlist'>
      <div className="search">
        <div className="searchbar">
          <img src='./search.png' />
          <input type='text' placeholder='search' onChange={(e)=>setInput(e.target.value)}/>
        </div>
        <img src={add ? "./minus.png":"./plus.png"} className='add' onClick={() => setAdd((prev)=>!prev)} />
        
      </div>
      {filteredChats.map((chat)=>(
       <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)} style={{backgroundColor:chat?.isSeen ? "transparent" : "#5183fe"}}>
       <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar} />
       <div className="texts">
         <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
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