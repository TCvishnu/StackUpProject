import React from "react";

import {useState, useEffect} from 'react';

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const uppercaseRegex = /[A-Z]/;
const digitRegex = /\d/;
const lowercaseRegex = /[a-z]/;
const specialCharRegex = /[!@#$]/;

const regClass = "flex flex-col items-center justify-start gap-2 bg-gray-400 h-5/6 w-1/3 rounded-lg formShadow mt-12";
const logClass = "flex flex-col items-center justify-center gap-2 bg-gray-400 h-3/5 w-1/3 rounded-lg formShadow mt-12";

export default function Form(props){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [wrongPassMsg, setWrongPassMsg] = useState([]);

    const [proceedLogin, setProceedLogin] = useState(true);


    useEffect(()=>{
        checkPassword();
    }, [pass]);
    const [dataArr, setDataArr] = useState([
      {username: 'Vishnutc',email: 'vishnu@gmail.com', password: 'v!shnu69', favMovie: 'ABCD', favFood: 'Paneer'},
      {username: 'DinganN',email: 'dingan@gmail.com', password: 'd!ngan03', favMovie: 'UVWXYZ', favFood: 'Chicken'}
    ]);

  const checkPassword = () => {
    setWrongPassMsg([]);
    let msg = true;
    if (!uppercaseRegex.test(pass)){
      setWrongPassMsg(prev => [...prev, "Password must contain atleast 1 upper case character"]);
      msg = false;
    }
    if (!lowercaseRegex.test(pass)){
      setWrongPassMsg(prev => [...prev, "Password must contain atleast 1 lower case character"]);
      msg = false;

    }
    if (!digitRegex.test(pass)){
      setWrongPassMsg(prev => [...prev, "Password must contain atleast 1 digit"]);
      msg = false;
    }
    if (!specialCharRegex.test(pass)){
      setWrongPassMsg(prev => [...prev, "Password must contain atleast 1 special character: ! @ # or $"]);
      msg = false;
    }
    if (pass.length < 8){
      setWrongPassMsg(prev => [...prev, "Password must contain atleast 8 characters"]);
      msg = false;
    }
    return msg;

    
  } 
    const handleSubmit = (event) => {
        setProceedLogin(true);
        event.preventDefault();
        if(!props.registration){
          fetch("http://localhost:5000/login",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: pass
                })
            }).then(item=>item.json)
            .then(item=>{console.log(item)})
        }
        if(!checkEmail() && !checkPassword() && !checkUserName()){
            setProceedLogin(false)
            fetch("http://localhost:5000/signup",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: pass
                })
            }).then(console.log('working'))
        }
    }

    const checkUserName = () => {
      for(const user of dataArr){
        if(username === user.username){
          alert("Username exists already");
          return false;
        }
      }
    }

    const checkEmail = () => {
      if(!emailPattern.test(email)){
        return false;
      }
    }

    const handleForgotPassword = () => {
      alert("Wait to recover!!");
    }


    return (
    <div className="mainDivBg h-screen w-screen flex flex-col items-center justify-start">

        <h1 className="text-2xl font-bold mt-5">
          Welcome to pahv contact manager</h1>

        <p className="text-xl mt-2">
          {props.topPara}</p>

      <form className={props.registration? regClass: logClass}
       onSubmit={handleSubmit}>
        <label htmlFor="username" 
        className="text-slate-100 mt-1 text-lg">Username:</label>

        <input type="text" 
        id="username"
        placeholder="Username" 
        className=" text-center inpField"
        value={username}
        onChange={({target})=> {setUsername(target.value)}}
        required/>

        { props.registration && <div className="flex flex-col items-center">
            <label htmlFor="mail" className="text-slate-100 text-lg">Email ID:</label>
            <input type="email" 
            id="mail" 
            placeholder="abcd@gmail.com" 
            className="text-center inpField"
            value={email}
            onChange={({target})=> {setEmail(target.value)}}
            required/>
        </div>
        }

        {props.registration && <div className="flex flex-col items-center gap-3 mt-2 w-full">
            <p className="text-sm text-white" title="These will be used for forgot password?">Answer the 2 security Questions</p>
            <input type="text" 
            placeholder="What is your Favourite Movie?" 
            className="text-sm w-1/2 text-center inpField" required></input>
            <input type="text" 
            placeholder="What is your Favourite Food?"
            className="text-sm w-1/2 text-center inpField" required></input>
          </div>}
        
        <label htmlFor="password" className="text-slate-100 text-lg">Password: </label>
        <input type="password" 
        id="password" 
        placeholder="Enter your Password" 
        className=" text-center inpField"
        
        onChange={({target})=> {
            setPass(target.value)
        }}
        onBlur={()=>{setWrongPassMsg([])}}
        required/>

    
        <input type="submit" value={props.submit}
         className='bg-white rounded-md w-1/5 mt-3 subBtn'/>

        {props.registration && 
        wrongPassMsg.map(message => 
        <p className="text-xs text-white">{message}</p>)}

        {!props.registration && <button className="mt-4 text-md underline text-white"
          onClick={handleForgotPassword}
          type="reset">
          forgot password?</button>}

      </form>
        {props.registration && <p className="mt-3 mb-3 text-xl">
            Already have an account? Login to manage your contacts
        </p>
        }
      
    </div>
    );
}