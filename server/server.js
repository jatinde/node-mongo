const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, err => {
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    
    Todo.find().then((todos) => {
        res.send({todos});
    }, err => {
        res.status(400).send(err);
    })
});

app.get('/todos/:id', (req, res) => {
    const {id} = req.params;
        
    if(!ObjectID.isValid(id)) {
        return res.status(400).send({
                status: 'BAD_REQUEST',
                message: `Id not valid: ${id}`
            });
    }
    Todo.findById(id)
        .then(todo => {
            if(!todo){
                return res.status(404).send({
                    status: 'NOT_FOND',
                    message: `Todo not found for id: ${id}`
                });
            }
            res.send(todo)
        })
})

app.listen(port, () => {
    console.log('====================================');
    console.log("Web Server started at Port:", port);
    console.log('====================================');
});

module.exports = { app }


