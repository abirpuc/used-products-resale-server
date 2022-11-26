const express = require('express')
const cors = require('cors')

const port = process.env.PORT || 5000

const app = express();


app.use(express())
app.use(cors())

require('dotenv').config()
console.log(process.env.DB_User);
console.log(process.env.DB_Password)


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://process.env.DB_User:process.env.DB_Password@cluster0.k6rknfb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.get('/', (req,res)=>{
    res.send('used products resale market server is running')
})

app.listen(port, () =>{
    console.log(`used products resale market server is running on ${port}`);
})