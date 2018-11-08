const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if(err) {
       return console.log('Unable to connect the mongodb server.'); 
    }   
    console.log('Connected to Mongodb server.');
    const db = client.db('TodoApp')

/*     db.collection("Todos").findOneAndUpdate({
        _id: new ObjectID('5be1e5480f05c90e84bc6ba3')
    }, {
        $set : {
            completed: true
        }
    }, 
    {
        returnOriginal: false
    }
    ).then((result) => {
        console.log(`${JSON.stringify(result.value, undefined, 2)}`);       
    }) */

    db.collection("Users").findOneAndUpdate({
        _id: new ObjectID('5be293917b847224fca615e7')
    }, {
       $inc: {
           age: -10
       }, 
       $set : {
           location: "Mohali, Punjab"
       } 
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(`${JSON.stringify(result.value, undefined, 2)}`);       
    })

    client.close()
})