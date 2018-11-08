const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if(err) {
       return console.log('Unable to connect the mongodb server.'); 
    }   
    console.log('Connected to Mongodb server.');
    const db = client.db('TodoApp')

    db.collection("Todos").deleteOne({text: "eat lunch"}).then((result) => {
        console.log(`${result.result.n} records deleted.`);       
    })

    db.collection("Todos").findOneAndDelete({completed: true}).then((result) => {
        console.log(`${JSON.stringify(result.value, undefined, 2)}`);       
    })

   db.collection("Todos").deleteMany({text: "eat lunch"}).then((result) => {
       console.log(`${result.result.n} records deleted.`);       
   })

    client.close()
})