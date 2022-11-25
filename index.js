const express = require('express')
const cors = require('cors')

const port = process.env.PORT || 5000

const app = express();


app.use(express())
app.use(cors())

app.get('/', (req,res)=>{
    res.send('used products resale market server is running')
})

app.listen(port, () =>{
    console.log(`used products resale market server is running on ${port}`);
})