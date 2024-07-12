import { useEffect } from "react";
import Chat from "./components/chat/Chat"
import Details from "./components/details/Details"
import List from "./components/list/List"
import Login from './components/login/Login';
import Notifications from "./components/notifications/Notifications";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/lib/firebase";
import { useUserStore } from "./components/lib/userStore";

const App = () => {
  const {currentUser,isLoading,fetchUserInfo} = useUserStore();
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid);
    })
    return ()=>{
      unsub();
    }
  },[fetchUserInfo]);
  if(isLoading) return <div className="loading">Loading......</div>
  return (
    <div className='container'>
    {currentUser ? (
      <>
      <List/>
      <Chat/>
      <Details/>
      </>
    ) : (
      <Login />
    )}
    <Notifications/>
      
    </div>
  )
}

export default App