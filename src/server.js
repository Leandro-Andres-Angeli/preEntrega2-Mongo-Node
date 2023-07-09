const express = require("express");
const {
  connectToMongo,
  disconnectToMongo,
  connectToCollection,
  generateId,
} = require("./mongo/mongodb.js");
require("dotenv");
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
const { PORT, HOST } = process.env;

server.get("/frutas", async (req, res) => {
  try {
    const collection = await connectToCollection("frutas");
    const fruits = await collection.find().toArray();
    res.status(200).send(JSON.stringify(fruits, null, "\t"));
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error en el servidor");
  } finally {
    await disconnectToMongo();
  }
});

server.get("/frutas/id/:id", async (req, res) => {
  let { id } = req.params;
  id &= +id;
  try {
    const collection = await connectToCollection("frutas");
    const fruits = await collection.findOne({ id });
    res.status(200).send(JSON.stringify(fruits, null, "\t"));
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error en el servidor");
  } finally {
    await disconnectToMongo();
  }
});
server.get("/frutas/descripcion/:desc", async (req, res) => {
  const { desc } = req.params;
  const reg = new RegExp(desc, "i");
  try {
    const collection = await connectToCollection("frutas");
    const fruits = await collection.find({ nombre: { $regex: reg } }).toArray();

    res.status(200).send(JSON.stringify(fruits, null, "\t"));
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error en el servidor");
  } finally {
    await disconnectToMongo();
  }
});
server.post("/frutas/", async (req, res) => {
  // id": 21, "imagen": "🍌", "nombre": "Plátano macho", "importe": 330, "stock": 80
  let { imagen, nombre, importe, stock } = req.body;
  imagen ??= "🍓";
  importe &&= +importe;
  stock &&= +stock;
  const newFruit = { imagen, nombre, importe, stock };
  console.log(newFruit);
  if (!imagen || !nombre || !importe || !stock){
     return res.status(400).send("Error , datos incompletos");
    }
  try {
    const collection = await connectToCollection("frutas");
    newFruit.id = await generateId(collection);
    await collection.insertOne(newFruit);
    res
      .status(200)
      .send(`Fruta creada :\n  ${JSON.stringify(newFruit, null, "\t")}`);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  } finally {
    await disconnectToMongo();
  }
});

server.use("*", (req, res) => {
  res.status(404).send(`<h1>Error ${res.statusCode}</h1><h3>Not Found</h3> `);
});
server.listen(PORT, HOST, () => console.log(`Running on ${PORT} `));
