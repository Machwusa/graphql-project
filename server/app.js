const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const schema = require('./schema/schema')

const app = express()

const mongoose = require('mongoose')

const cors = require('cors')
const port = process.env.PORT || 4000


/*
*mongodb+srv://User1:GKPMr3KQ2Pbc2sN6@cluster0.gnvaj.mongodb.net/<dbname>?retryWrites=true&w=majority
* */

mongoose.connect('mongodb+srv://User1:GKPMr3KQ2Pbc2sN6@cluster0.gnvaj.mongodb.net/ProjectX?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })


mongoose.connection.once('open', () => {
    console.log('We are connected!!')
})


app.use(cors())
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

app.listen(port, () => {
    console.log('Listening for requests')
})
