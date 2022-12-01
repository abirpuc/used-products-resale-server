const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const userCollection = client.db('ResaleMarket').collection('user');

        // generate token

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            console.log(email);
            const user = await userCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: '' })
        })
        // user information
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.get('/user/admin/:email', async(req,res) =>{
            const email = req.params.email;
            const query = {email:email}
            const user = await userCollection.findOne(query);
            res.send({isAdmin: user?.userType === 'admin'})
        })

        app.get('/user/seller/:email', async(req, res) =>{
            const email = req.params.email;
            const query = {email:email}
            const user = await userCollection.findOne(query);
            res.send({isSeller: user?.userType === 'seller'})
        })

        app.get('/users/buyer', async (req, res) => {
            let query = { userType: 'user' };
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })

        app.delete('/users/buyer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/users/seller', async (req, res) => {
            let query = { userType: 'seller' };
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })

        app.delete('/users/seller/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/users/admin/:id', async (req, res) => {
            // const email = req.params.email;
            // const query = {email:email};
            // const user = await userCollection.findOne(query)

            // if(user?.userType !=='admin'){
            //     return res.status(403).send({message: 'forbidden access'})
            // }
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    userType: 'admin'
                }
            }

            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.put('/seller/verified/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    verified: 'true'
                }
            }

            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })


        app.get('/products', async (req, res) => {
            const query = {}
            const result = await productsCollection.find().toArray();
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result)
        })

        app.get('/myproducts', async (req, res) => {
            let query = {}
            if (req.query.seller_email) {
                query = {
                    seller_email: req.query.seller_email
                }
            }
            const result = await productsCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/myproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result)
        })

        app.put('/myproducts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    advertise: 'advertise'
                }
            }
            const result = await productsCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.patch('/products/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id : ObjectId(id)}
            const product = req.body;
            const options = {upsert: true}
            const updateDoc = {
                $set:{

                }
            }
            const result = await productsCollection.updateOne(filter,updateDoc,options)
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

        app.get('/booking', async (req, res) => {
            let query = {}
            if (req.query.customerEmail) {
                query = {
                    customerEmail: req.query.customerEmail
                }
            }
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
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