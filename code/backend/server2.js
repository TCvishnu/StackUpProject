const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.all('/signup', (req, res) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const newData = req.body;
        newData.contacts = [];
        const usernameToCheck = newData.username;
        const emailToCheck = newData.email;

        fs.readFile('data.json', 'utf8', (readErr, existingData) => {
            if (readErr) {
                console.error(readErr);
                res.status(500).send('Internal Server Error');
            } else {
                let parsedData = JSON.parse(existingData);

                if (parsedData.some(user => user.username === usernameToCheck)) 
                    res.status(200).json({response: "username"});
                else if (parsedData.some(user => user.email === emailToCheck)) 
                    res.status(200).json({response: "email"});
                else {
                    parsedData.push(newData);
                    fs.writeFile('data.json', JSON.stringify(parsedData), 'utf8', (writeErr) => {
                        if (writeErr) {
                            console.error(writeErr);
                            res.status(500).send('Internal Server Error');
                        } else 
                            res.json({response: true});
                    });
                }
            }
        });
    } else {
        res.status(405).send('Method Not Allowed');
    }
});

app.all('/login', (req, res) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const newData = req.body;
        const usernameToCheck = newData.username;
        const passwordToCheck = newData.password;
        let data
        fs.readFile('data.json', 'utf8', (readErr, existingData) => {
            if (readErr) {
                console.error(readErr);
                res.status(500).send('Internal Server Error');
            } 
            else{
                let parsedData = JSON.parse(existingData);
                if (parsedData.some(user => user.username === usernameToCheck)){
                    if(parsedData.some(user => {
                        data=user.contacts
                        return user.password === passwordToCheck
                    }))
                        res.json({response : true, data });
                    else
                        res.json({response : "password" });
                }
                else    
                    res.json({response : "username"});
            }
        });
    } 
});

app.all('/contacts', (req, res) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const newData = req.body;
        const usernameToCheck = newData.username;
        const contactToAdd = newData.contacts;

        fs.readFile('data.json', 'utf8', (readErr, existingData) => {
            if (readErr) {
                console.error(readErr);
                res.status(500).send('Internal Server Error');
            } else {
                let parsedData = JSON.parse(existingData);
                const userIndex = parsedData.findIndex(user => user.username === usernameToCheck);

                if (userIndex !== -1) {
                    if (!Array.isArray(parsedData[userIndex].contacts)) 
                        parsedData[userIndex].contacts = [];
                    
                    parsedData[userIndex].contacts.push(contactToAdd);
                    parsedData[userIndex].contacts.sort((a,b)=>{
                        const nameA=a.name.toUpperCase()
                        const nameB=b.name.toUpperCase()

                        if(nameA<nameB)
                            return -1
                        if (nameA>nameB)
                            return 1
                        return 0
                    })
                    fs.writeFile('data.json', JSON.stringify(parsedData, null, 2), 'utf8', (writeErr) => {
                        if (writeErr) {
                            console.error(writeErr);
                            res.status(500).send('Internal Server Error');
                        } else 
                            res.json({ response: true , userData:parsedData[userIndex].contacts });
                    });
                } else 
                    res.json({ response: "username" });
            }
        });
    }
});

app.all('/delete', (req, res) => {
    const usernameToCheck = req.body.username; // Assuming username is in the request body
    const contactIndexToDelete = req.body.index;

    fs.readFile('data.json', 'utf8', (readErr, existingData) => {
        if (readErr) {
            console.error(readErr);
            res.status(500).send('Internal Server Error');
            return; // Exit the function to avoid further execution
        }

        let parsedData;

        try {
            // Check if existingData is already an object
            parsedData = typeof existingData === 'object' ? existingData : JSON.parse(existingData);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing JSON data');
            return; // Exit the function to avoid further execution
        }

        const userIndex = parsedData.findIndex(user => user.username === usernameToCheck);

        if (userIndex !== -1) {
            // Use filter to exclude the contact based on the specified index
            parsedData[userIndex].contacts = parsedData[userIndex].contacts.filter((contact, index) => index !== contactIndexToDelete);

            fs.writeFile('data.json', JSON.stringify(parsedData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.json({ response: true, userData: parsedData[userIndex].contacts });
                }
            });
        } else {
            res.status(404).json({ response: "User not found" });
        }
    });
});

app.all('/edit', (req, res) => {
    const usernameToCheck = req.body.username; // Assuming username is in the request body
    const contactIndexToEdit = req.body.index;
    const updatedContactData = req.body.updatedContact; // Assuming updatedContact contains the new data

    fs.readFile('data.json', 'utf8', (readErr, existingData) => {
        if (readErr) {
            console.error(readErr);
            res.status(500).send('Internal Server Error');
            return; // Exit the function to avoid further execution
        }

        let parsedData;
        try {
            // Check if existingData is already an object
            parsedData = typeof existingData === 'object' ? existingData : JSON.parse(existingData);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing JSON data');
            return; // Exit the function to avoid further execution
        }
        const userIndex = parsedData.findIndex(user => user.username === usernameToCheck);

        if (userIndex !== -1) {

            if (contactIndexToEdit >= 0 && contactIndexToEdit < parsedData[userIndex].contacts.length) {
                // Edit the contact based on the specified index
                parsedData[userIndex].contacts[contactIndexToEdit] = { ...updatedContactData };
                parsedData[userIndex].contacts.sort((a,b)=>{
                    const nameA=a.name.toUpperCase()
                    const nameB=b.name.toUpperCase()

                    if(nameA<nameB)
                        return -1
                    if (nameA>nameB)
                        return 1
                    return 0
                })
                fs.writeFile('data.json', JSON.stringify(parsedData, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.json({ response: true, userData: parsedData[userIndex].contacts });
                    }
                });
            } else {
                res.status(404).json({ response: "Contact index out of bounds" });
            }
        } else {
            res.status(404).json({ response: "User not found" });
        }
    });
});

app.listen(port, () => {
    console.log('Listening on port', port);
});
