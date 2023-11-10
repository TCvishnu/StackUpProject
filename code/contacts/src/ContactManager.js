import React from 'react';
import { useState, useEffect } from 'react';
import searchIcon from './images/search.png';
import editIcon from './images/edit.png';
import deleteIcon from './images/trash.png';

export default function ContactManager(){
    const [adding, setAdding] = useState(false);

    const [addName, setAddName] = useState('');
    const [addMail, setAddMail] = useState('');
    const [addNumber, setAddNumber] = useState('');

    const [searchName, setSearchName] = useState('');
   

    const [numMsg , setNumMsg] = useState([]);
    const [contacts, setContacts] = useState(
        [
            {
                name: "Arun Nair",
                number: 1234567890,
                email: "arunnair@gmail.com"
            },
            {
                name: "Divya Menon",
                number: 9876543211,
                email: "divyamenon@gmail.com"
            },
            {
                name: "Krishna Pillai",
                number: 2345678902,
                email: "krishnapillai@gmail.com"
            },
            {
                name: "Meera Kumar",
                number: 8765432193,
                email: "meerakumar@gmail.com"
            },
            {
                name: "Sanjay Nambiar",
                number: 3456789014,
                email: "sanjaynambiar@gmail.com"
            },
            {
                name: "Priya Iyer",
                number: 7654321958,
                email: "priyaiyer@gmail.com"
            },
            {
                name: "Gopika Suresh",
                number: 4567869012,
                email: "gopikasuresh@gmail.com"
            },
            {
                "name": "Rahul Menon",
                "number": 6543271987,
                "email": "rahulmenon@gmail.com"
            },
            {
                name: "Nikhil Warrier",
                number: 5432199876,
                email: "nikhilwarrier@gmail.com"
            }
        ]
        
        );

        useEffect(()=>{
            handleSearch();
        }, [searchName]);

        const [storeContacts, setStoreContacts] = useState(contacts);

        const getTrElementByKey = (key) => {
            const trElements = document.querySelectorAll('tr');
            for (const tr of trElements) {

              if (tr.firstChild.firstChild.data === key) {
                return key;
              }
            }
            return null;
        };

        useEffect(()=>{
            checkNumber();
        }, [addNumber])

        const checkNumber = () => {
            let msg = true;
            setNumMsg([]);
            if(addNumber.length !== 10){
                setNumMsg(prev => [...prev, "Number must contain only 10 digits"]);
                msg = false;
            }
            if(!/^\d+$/.test(addNumber) && addNumber.length !== 0){
                setNumMsg(prev => [...prev, "Number must contain only digits"]);
                msg = false;
            }
            return msg;

        }
        const handleSubmit = (event) => {
            event.preventDefault();
            setNumMsg([]);
            if(checkNumber()){
                console.log("submited");
                fetch("localhost:5000/contacts",{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: addName,
                        number: addNumber,
                        email: addMail
                    }).then(()=>{console.log("working")})
                })
                //setContacts(prev => [...prev, {name: addName, number: addNumber, email: addMail}]);
                
                sortContacts();
                setStoreContacts(contacts);
                setAdding(false);
            }
            
        }

        const sortContacts = () => {
            setContacts(prev => {
                const sortedContacts = [...prev];
                sortedContacts.sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();

                    if (nameA < nameB) {
                    return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                return sortedContacts;
            })
            setStoreContacts(contacts);
        }

        const deleteContact = (key) => {
            const deleteKey = getTrElementByKey(key);
            setContacts((prev) => {
                return prev.filter((contact) => {
                    return contact.name !== deleteKey;
                })
            });

            setStoreContacts(contacts);
            
        }

    const handleSearch = () => {
        
        setContacts(() => {
            const searchedArr = storeContacts.filter(contact => {
                const mainStr = contact.name.toLowerCase();
                const subStr = searchName.toLowerCase();

                return mainStr.includes(subStr);
            })


            return searchedArr;
        });
        console.log(storeContacts);
    }

    return (
        <div className="flex flex-col w-screen h-screen items-center justify-start gap-7">
            <h1 className="text-2xl mt-2">Pahv Contact Manager</h1>
            <h1 className="text-xl">Welcome back 
            <span> Kokkachi</span></h1>
                
            <input type="text" 
            placeholder="Search Contacts"
            className="text-center rounded-full custom-shadow outline-none hover:scale-110"
            onChange={({target})=>{
                setSearchName(target.value);
            }}>
                
            </input>
                
           
            <button onClick={()=>{setAdding(true)}}
                className='addBtn w-1/12 rounded-xl bg-slate-100'>Add Contact</button>
            

            {adding && <form className='flex flex-col w-3/12 gap-4 addForm items-center justify-center h-auto rounded-md'>
                <input className="text-center w-8/12 mt-2 rounded-md"
                 placeholder='Name' 
                 onChange={({target}) => setAddName(target.value)}
                 required></input>
                <input className="text-center w-8/12 rounded-md" 
                type="email"
                placeholder='Email' 
                onChange={({target}) => setAddMail(target.value)}
                required></input>
                <input className='text-center w-8/12 rounded-md' 
                
                placeholder='Number'
                min="10"
                onChange={({target}) => {
                    setAddNumber(target.value);
                    checkNumber();    
                }
                }
                onBlur={()=>{setNumMsg([])}}
                required></input>

                <input type="submit" value={"Add Contact"}
                className='w-6/12 bg-slate-100 rounded-full'
                onClick={handleSubmit}></input>

                <button onClick={()=>{setAdding(false)}}
                className='w-6/12 bg-slate-100 mb-2 rounded-full'>Close</button>

                {numMsg.map((message) => {
                    return <p key={message}className='text-xs text-white'>{message}</p>
                })}
            </form>
            }
            <table className="w-11/12 table table-shadow">
                <thead>
                    <tr>
                        <th className='w-1/5 header-cell'>Name</th>
                        <th className='w-1/5 header-cell'>Email</th>
                        <th className='w-1/5 header-cell'>Contact</th>
                        <th className='w-1/5 header-cell' colSpan="2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact)=>{
                        return (<tr key={contact.name} className='row'>
                            <td className='cell p-2'>{contact.name}</td>
                            <td className='cell p-2'>{contact.email}</td>
                            <td className='cell p-2'>{contact.number}</td>
                            <td className='cell text-center p-2' colSpan="1">
                                <button className='actionBtn' title='Edit Contact'>
                                    <img src={editIcon} alt="edit"
                                    className='h-5/6'/>
                                </button>
                            </td>
                            <td className='cell text-center p-2' colSpan="1">
                                <button className='actionBtn' 
                                title="Delete Contact"
                                onClick={()=>{deleteContact(contact.name)}}>
                                    <img src={deleteIcon} alt="delete"
                                    className="h-5/6"
                                    />
                                    
                                </button>
                            </td>
                            
                        </tr>);
                    })}
                </tbody>
            </table>
            
            
        </div>
    );
}