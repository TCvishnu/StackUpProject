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

        fs.readFile('data.json', 'utf8', (readErr, existingData) => {
            if (readErr) {
                console.error(readErr);
                res.status(500).send('Internal Server Error');
            } 
            else{
                let parsedData = JSON.parse(existingData);
                if (parsedData.some(user => user.username === usernameToCheck)){
                    if(parsedData.some(user => user.password === passwordToCheck))
                        res.json({response : true});
                    else
                        res.json({response : "password"});
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
        const contactsToAdd = newData.contacts;

        fs.readFile('data.json', 'utf8', (readErr, existingData) => {
            if (readErr) {
                console.error(readErr);
                res.status(500).send('Internal Server Error');
            } else {
                let parsedData = JSON.parse(existingData);
                const userIndex = parsedData.findIndex(user => user.username === usernameToCheck);

                if (userIndex !== -1) {
                    parsedData[userIndex].contacts = contactsToAdd;
                    fs.writeFile('data.json', JSON.stringify(parsedData, null, 2), 'utf8', (writeErr) => {
                        if (writeErr) {
                            console.error(writeErr);
                            res.status(500).send('Internal Server Error');
                        } else 
                            res.json({ response: true });
                    });
                } else 
                    res.json({ response: "username" });
            }
        });
    }
});

app.listen(port, () => {
    console.log('Listening on port', port);
});
