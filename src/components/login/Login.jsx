import React, { useState } from 'react'
import './login.css'
import { toast } from 'react-toastify'
import {createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth'
import { auth, db } from '../lib/firebase'
import { doc, setDoc } from "firebase/firestore"; 
import upload from '../lib/upload'
const Login = () => {
  const [loading,setLoading] = useState(false)
  const [logLoading,setLogLoading] = useState(false);
    const [avatar,setAvatar] = useState({
        file:null,
        url:""
    })
    const handleAvatar=(e)=>{
        if(e.target.files[0])
            {
                setAvatar({
                    file:e.target.files[0],
                    url:URL.createObjectURL(e.target.files[0])
                })
            }
    }
    const handleLogin =async (e) =>{
      e.preventDefault();
      setLogLoading(true);
      const formdata = new FormData(e.target)
      const{email,password} = Object.fromEntries(formdata);
      try {
       const log = await signInWithEmailAndPassword(auth,email,password)
       console.log(log)
        toast.success("Logged In Successfully")
      } catch (error) {
        console.log(error)
        toast.error(error.message);
      }
      finally{
        setLogLoading(false)
      }
      
    }
    const handleRegister =async (e) =>{
      setLoading(true)
      e.preventDefault();
      const formdata = new FormData(e.target)
      const{username,email,password} = Object.fromEntries(formdata);
      console.log(username)
      try {
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const imgUrl = await upload(avatar.file)
        await setDoc(doc(db, "users", res.user.uid), {
        id:res.user.uid,
        username,
        avatar:imgUrl,
        email,
        blocked:[]
        });
        await setDoc(doc(db, "userchats", res.user.uid), {
          chats:[]
          });
        toast.success("Account created successfully")
      } catch (error) {
        console.log(error)
        toast.error(error.message);
      }
      finally{
        setLoading(false);
      }
    }
  return (
    <div className='login'>
      <div className="item">
        <h1>Welcome</h1>
        <form onSubmit={handleLogin}>
            <input type='text' name='email' placeholder='Email' />
            <input type='password' name='password' placeholder='Password' />
            <button disabled={logLoading}>{logLoading ? "Loading" : "LogIn"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
      <h1>Create an Accont</h1>
        <form onSubmit={handleRegister}>
            <label htmlFor='file'> <img src={avatar.url||'./avatar.png'} alt='' />Upload an Image</label>
            <input type='file' id='file' style={{display:"none"}} onChange={handleAvatar} />
            <input type='text' name='username' placeholder='UserName' />
            <input type='text' name='email' placeholder='Email' />
            <input type='password' name='password' placeholder='Password' />
            <button disabled={loading}>{loading ? "Loading" : "SignUp"}</button>
        </form>
      </div>
    </div>
  )
}

export default Login
