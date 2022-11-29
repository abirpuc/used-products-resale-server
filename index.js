const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

require('dotenv').config()
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.k6rknfb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db('ResaleMarket').collection('productsCategory');
        const productsCollection = client.db('ResaleMarket').collection('products');
        const bookingCollection = client.db('ResaleMarket').collection('booking');

        app.get('/products', async (req, res) => {
            const query = {}
            const result = await productsCollection.find().toArray();
            res.send(result)
        })

        app.get('/category', async (req, res) => {
            const query = {}
            const result = await categoryCollection.find().toArray()
            res.send(result)
        })

        app.get('/products/:category_id', async (req, res) => {
            const id = req.params.category_id;
            const query = { category_id: id }
            const result = await productsCollection.find(query).toArray()
            res.send(result)
        })

        // booking products

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result)
        })

        app.get('/booking', async(req, res)=>{
            let query = {}
            if(req.query.customerEmail){
                query = {
                    customerEmail: req.query.customerEmail
                }
            }
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })
    }
    finally {

    }
}


run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('used products resale market server is running')
})


app.listen(port, () => {
    console.log(`used products resale market server is running on ${port}`);
})