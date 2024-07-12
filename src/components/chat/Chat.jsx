import React, { useEffect, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { IoIosSend } from "react-icons/io";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useChatStore } from '../lib/chatStore';
import { useUserStore } from '../lib/userStore';
import upload from '../lib/upload';
const Chat = () => {
  const [chat,setChat] = useState();
  const[open,setOpen] = useState(false);
  const[text,setText] = useState("");
  const [img,setImg] = useState({
    file:null,
    Url:""
  })
  const handleImg=(e)=>{
    if(e.target.files[0])
        {
            setImg({
                file:e.target.files[0],
                Url:URL.createObjectURL(e.target.files[0])
            })
        }
}
  const {chatId,user,isCurrentUserBlocked,isReceiverBlocked} = useChatStore();
  const {currentUser} = useUserStore();
  const handleEmoji = (e) =>{
    setText((prev)=> prev+e.emoji)
    setOpen(false);
  }
  const endRef = useRef(null)
  useEffect(()=>{
      endRef.current?.scrollIntoView({behavior:"smooth"});
  },[])

  useEffect(()=>{
    const unSub = onSnapshot(doc(db,"chats",chatId),(res)=>{
      setChat(res.data())
    })
    return ()=>{
      unSub();
    }
  },[chatId])
  const handleSend = async () =>{

    if(text === "" || text === " ") return
    let imgUrl = null;
    try {

      if(img.file)
      {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db,"chats",chatId),{
        messages:arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && {img:imgUrl})
        })
      });
      const userIDs = [currentUser.id,user.id]
      userIDs.forEach(async (id)=>{
        const userChatRef = doc(db,"userchats",id);
        const userChatSnapshot = await getDoc(userChatRef)
  
        if(userChatSnapshot.exists())
        {
          const userChatsData =userChatSnapshot.data();
  
          const ChatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
  
          userChatsData.chats[ChatIndex].lastMessage = text;
          userChatsData.chats[ChatIndex].isSeen = id === currentUser.id ? true : false ;
          userChatsData.chats[ChatIndex].createdAt =  Date.now();
  
          await updateDoc(userChatRef,{
            chats:userChatsData.chats,
          })
        }
      })
    } catch (error) {
      console.log(error)
    };
    setImg({
      file:null,
      Url:""
    })
    setText("");
  }
  return (
    <div className='chat'>
      <div className="top">
      <div className="user">
        <img src={user?.avatar || './avatar.png'} />
        <div className="texts">
          <span>{user?.username}</span>
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
      {chat?.messages?.map((message)=>(
        <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
        <div className="texts">
     {message.img  &&  <img src={message.img} alt=''/>}
          <p>{message.text}</p>
            {/* <span>1 min ago</span> */}
        </div>
      </div>
      ))}
       {img.Url && <div className="message own">
          <div className="texts">
            <img src={img.Url} alt=''/>
          </div>
        </div>}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor='file'>
          <img src='./img.png' alt=''/>
          </label>
        <input type='file' id='file' style={{display:'none'}} onChange={handleImg} disabled={isCurrentUserBlocked || isReceiverBlocked} />
          <img src='./camera.png' alt=''/>
          <img src='./mic.png' alt=''/>
        </div>
        <input type='text' placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? 'You cannot send a message' :'Send a Message'} value={text} onChange={(e) => setText(e.target.value)} disabled={isCurrentUserBlocked || isReceiverBlocked}/>
        <div className="emoji">
          <img src='./emoji.png' alt='' onClick={() => setOpen((prev)=>!prev)}/>
            <div className="picker">
          <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
            </div>
        </div>
        <button className='sendButton' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}><IoIosSend /></button>
      </div>
    </div>
  )
}

export default Chat
