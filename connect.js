const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if(err) {
       return console.log('Unable to connect the mongodb server.'); 
    }   
    console.log('Connected to Mongodb server.');
    const db = client.db('TodoApp')

    
    db.collection('Todos').insertOne({
        text: 'Task to do',
        completed: false
    }, (err, result) => {
        if(err) {
            return console.log('Unable to insert Todos.', err); 
         } 
         console.log(JSON.stringify(result.ops, undefined, 2));
         
    }) 

    db.collection('Users').insertOne({
        name: 'John Doe',
        age: 34,
        location: "Mohali Punjb, 160062"
    }, (err, result) => {
        if(err) {
            return console.log('Unable to insert Users.', err); 
         } 
         console.log(JSON.stringify(result.ops, undefined, 2));
         console.log(result.ops[0]._id.getTimestamp());
    })
    client.close()
})