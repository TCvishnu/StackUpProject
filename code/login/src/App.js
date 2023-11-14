import React from 'react';
import {useState} from 'react';
import Form from './Form';
import ContactManager from './ContactManager';

const gotoLogClass = 'loginBtn mb-3 text-white';
const gotoRegClass = 'goBackBtn mb-32 text-white';
function App() {

  const [loginData, setLoginData] = useState([]);
  const [isContactPage, setIsContactPage] = useState(false);

  

  const [curPage, setCurPage] = useState('Registration');
  
  const changePage = () => {
    if (curPage === 'Registration'){
      setCurPage('Login');
      return;
    }
    setCurPage('Registration');
  }

  const handleFormData = (data) => {
    setLoginData(data);
    //console.log(`AppJS ${data}`);
    setCurPage('Contacts');
    setIsContactPage(data[1]);
  }

  const comeBackToLoginPage = () => {
    setCurPage('Login');
    setIsContactPage(false);
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
      topPara="Login to access your contacts"
      onLoginData={handleFormData} />}

      {!isContactPage && <button className={(curPage === 'Registration')? gotoLogClass: gotoRegClass}
      onClick={changePage}>
        {(curPage === 'Registration')? 'Login': 'Go back'}
      </button>}

      {isContactPage && <ContactManager user={loginData[0]} contacts={loginData[2]} onLogout={comeBackToLoginPage}/>}
    </div>
  );
}

export default App;
