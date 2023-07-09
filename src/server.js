const express = require("express")
const { connectToMongo, disconnectToMongo , connectToCollection , generateId} =  require ("./mongo/mongodb.js")
require("dotenv")
const server = express()
server.use(express.json())
server.use(express.urlencoded({extended:true}))
const {PORT,HOST } = process.env

server.get("/frutas",async(req,res)=>{
     try{
        const collection = await connectToCollection("frutas")
        const fruits = await collection.find().toArray();
        res.status(200).send(JSON.stringify(fruits,null,'\t'))  
     }
     catch(err){
        console.log(err.message)
        res.status(500).send("Error en el servidor")
     }
     finally{
        await disconnectToMongo()
     }

})

server.get("/frutas/id/:id",async(req,res)=>{
    let { id} = req.params
    id &= + id
     try{
        const collection = await connectToCollection("frutas")
        const fruits = await collection.findOne({id});
        res.status(200).send(JSON.stringify(fruits,null,'\t'))  
     }
     catch(err){
        console.log(err.message)
        res.status(500).send("Error en el servidor")
     }
     finally{
        await disconnectToMongo()
     }
    // res.status(200).send(JSON.stringify({"id":"data"},null,'\t'))
})
server.get("/frutas/descripcion/:desc",async(req,res)=>{
    const {desc} = req.params
    const reg = new RegExp(desc,"i") 
     try{
        const collection = await connectToCollection("frutas")
        const fruits = await collection.find({nombre:{$regex:reg}}).toArray();
      
        res.status(200).send(JSON.stringify(fruits,null,'\t'))  
     }
     catch(err){
        console.log(err.message)
        res.status(500).send("Error en el servidor")
     }
     finally{
        await disconnectToMongo()
     }
    // res.status(200).send(JSON.stringify({"id":"data"},null,'\t'))
})

server.use("*",(req,res)=>{
    
     res.status(404).send(`<h1>Error ${res.statusCode}</h1><h3>Not Found</h3> `)
     
})
server.listen(PORT,HOST,()=> console.log(`Running on ${PORT} `))