import React from 'react';
import {useState} from 'react';
import Form from './Form';

const gotoLogClass = 'loginBtn mb-3 text-white';
const gotoRegClass = 'goBackBtn mb-32 text-white';
function App() {

  const [curPage, setCurPage] = useState('Registration');
  
  const changePage = () => {
    if (curPage === 'Registration'){
      setCurPage('Login');
      return;
    }
    setCurPage('Registration');
  }

  return (
    <div className="mainDivBg h-screen w-screen flex flex-col items-center justify-start">
      
      
      {curPage === "Registration" && 
      <Form registration={true} 
      submit="Register"
      topPara="Are you new here? Register with us to manage your contacts"/>}

      {curPage === "Login" && 
      <Form registration={false} 
      submit="Login"
      topPara="Login to access your contacts" />}

      <button className={(curPage === 'Registration')? gotoLogClass: gotoRegClass}
      onClick={changePage}>
        {(curPage === 'Registration')? 'Login': 'Go back'}
      </button>
    </div>
  );
}

export default App;