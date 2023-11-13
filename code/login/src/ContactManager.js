import React from 'react';
import { useState, useEffect } from 'react';
import editIcon from './images/edit.png';
import deleteIcon from './images/trash.png';

export default function ContactManager(props){
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [addName, setAddName] = useState('');
    const [addMail, setAddMail] = useState('');
    const [addNumber, setAddNumber] = useState('');

    const [editedName, setEditedName] = useState('');
    const [editedMail, setEditedMail] = useState('');
    const [editedNumber, setEditedNumber] = useState('');

    const [searchName, setSearchName] = useState('');
    const [dltContact, setDltContact] = useState('');
    const [beforeEditContact, setBeforeEditContact] = useState({});
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

        

        const [storeContacts, setStoreContacts] = useState(contacts);
        const [openDialogue, setOpenDialogue] = useState(false);
        const [confirmLogOut, setConfirmLogOut] = useState(false);
        

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
                setContacts(prev => [...prev, {name: addName, number: addNumber, email: addMail}]);
                
                sortContacts();
                setStoreContacts(prev => [...prev, {name: addName, number: addNumber, email: addMail}]);
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
        }

        const getTrElementByKey = (key) => {
            const trElements = document.querySelectorAll('tr');
            for (const tr of trElements) {
                
              if (tr.firstChild.firstChild.data === key) {
                //console.log(key);
                return key;
              }
            }
            return null;
        };

        const deleteContact = (key) => {
            const deleteKey = getTrElementByKey(key);
            setContacts((prev) => {
                return prev.filter((contact) => {
                    return contact.name !== deleteKey;
                })
            });
            
            setStoreContacts((prev) => {
                return prev.filter((contact) => {
                    return contact.name !== deleteKey;
                })
            });
            
            
            
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
        sortContacts();
    }

    useEffect(()=>{
        handleSearch();
    }, [searchName]);

    const handleEdit = (contact) => {
        const editKey = getTrElementByKey(contact.name);
        setEditing(true);
        setBeforeEditContact(contact);
        setEditedName(editKey);
        setEditedMail(contact.email);
        setEditedNumber(contact.number);
        console.log(contact.email, contact.number);

    }


    const makeChanges = (event) => {
        event.preventDefault();
        setEditing(false);
        setContacts((prev)=>{
            let newContacts = prev.filter((contact) => {
                return beforeEditContact.name !== contact.name;
            });

            const editedContact = {name: editedName, email: editedMail, number: editedNumber};
            newContacts = [...newContacts, editedContact];
            return newContacts;

        });
        setStoreContacts((prev)=>{
            let newContacts = prev.filter((contact) => {
                return beforeEditContact.name !== contact.name;
            });

            const editedContact = {name: editedName, email: editedMail, number: editedNumber};
            newContacts = [...newContacts, editedContact];
            return newContacts;
        });

        sortContacts();

    }

    const sendDataToLoginPage = () => {
        props.onLogout();
    }

    return (
        <div className="flex flex-col w-screen h-screen items-center justify-start gap-7">
            <h1 className="text-2xl mt-2">Pahv Contact Manager</h1>
            <h1 className="text-xl">Welcome back <span>{props.user}</span></h1>

            <button className=' absolute logOut rounded-full bg-blue-500 w-1/12 text-white hover:scale-110'
            onClick={()=>{setOpenDialogue(true)}}>Log Out</button>
            {openDialogue && <div className='flex flex-col fixed top-1/3 w-3/12 h-1/6
             justify-center items-center bg-blue-400 dialogueDiv gap-7'>
                <p className='w-full text-center'>Are you sure you want to Log out?</p>
                <div className='flex flex-row gap-6 w-full items-center justify-center'>
                    <button className='bg-white w-1/4 rounded-sm'
                    onClick={()=> {
                            sendDataToLoginPage();
                            setOpenDialogue(false);
                        }
                    }>Yes</button>
                    <button className=" bg-white w-1/4 rounded-sm" onClick={()=>{setOpenDialogue(false)}}>No</button>
                </div>
                
            </div>}
                
            <input type="text" 
            placeholder="Search.."
            className=" text-center rounded-sm w-2/12 custom-shadow outline-none hover:scale-110
            text-lg "
            onChange={({target})=>{
                setSearchName(target.value);
            }}>
                
            </input>
                
           
            <button onClick={()=>{setAdding(true)}}
                className='addBtn w-40 text-lg rounded-md bg-slate-100
                hover:scale-110'>Add Contact</button>
            

            {adding && <form className='flex flex-col w-3/12 gap-4 addForm 
            items-center justify-center fixed top-1/3 dialogueDiv h-auto rounded-md'>
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

            {editing && <form className='flex flex-col w-3/12 gap-4 addForm
            dialogueDiv fixed top-1/3 items-center justify-center h-auto rounded-md'>
                <input className='mt-2 rounded-md text-center' 
                onChange={({target})=> {setEditedName(target.value)}}
                value={editedName}></input>

                <input className='rounded-md text-center' type="email"
                onChange={({target}) => {setEditedMail(target.value)}}
                value={editedMail}></input>

                <input className='rounded-md text-center'
                onChange={({target}) => {setEditedNumber(target.value)}}
                value={editedNumber}
                min="10"></input>

                <button onClick={makeChanges}>Make Changes</button>
                <button onClick={()=>{setEditing(false)}}>Cancel</button>
            </form>}

            {deleting && <div className='flex flex-col w-3/12 gap-2 addForm
            dialogueDiv fixed top-1/3 items-center justify-center h-1/6 rounded-md'>
                <p className='text-white'>Delete {dltContact} ?</p>
                <div className='w-full flex flex-row items-center justify-center gap-5'>
                <button onClick={()=>{
                    setDeleting(false);
                    deleteContact(dltContact);
                }}
                className="rounded-sm bg-white w-3/12"
                >Yes</button>
                <button onClick={()=>{setDeleting(false)}}
                className='rounded-sm bg-white w-3/12'
                >No</button>
                </div>
            </div>}

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
                    {contacts.map((contact, index)=>{
                        return (<tr key={index} className='row hover:bg-slate-100'>
                            <td className='cell p-2 hover:bg-slate-300'>
                                {contact.name}
                            </td>
                            <td className='cell p-2 hover:bg-slate-300'>
                                {contact.email}
                            </td>
                            <td className='cell p-2 hover:bg-slate-300'>
                                {contact.number}
                            </td>
                            <td className='cell text-center p-2 hover:bg-slate-300' colSpan="1">
                                <button className='actionBtn ' title='Edit Contact'
                                    onClick={() => {handleEdit(contact)}}>
                                    <img src={editIcon} alt="edit"
                                    className='h-5/6'/>
                                </button>
                            </td>
                            <td className='cell text-center p-2 hover:bg-slate-300' colSpan="1">
                                <button className='actionBtn' 
                                title="Delete Contact"
                                onClick={()=>{setDltContact(contact.name);
                                setDeleting(true);}}>
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