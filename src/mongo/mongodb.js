const { MongoClient } = require("mongodb");
const path = require("path");
const { disconnect } = require("process");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const { DBURL, DBNAME } = process.env;
const client = new MongoClient(DBURL);
const connectToMongo = async () => {
  let connection;
  try {
    connection = await client.connect();
  } catch (err) {
    console.log(err);
    connection = null;
  }
  return connection;
};
const disconnectToMongo = async () => {
  try {
    await client.close();
    console.log("desconectado");
  } catch (err) {
    console.log(err);
  }
};
const connectToCollection = async (colName) => {
  try {
    const connection = await connectToMongo(colName);
    const db = connection.db(DBNAME);
    const collection = db.collection(colName);
    return collection;
  } catch (err) {
    console.log(err);
  }
};
const generateId = async (colName)=> {
    const documentMaxId = await colName.find().sort({ id: -1 }).limit(1).toArray();
    const maxId = documentMaxId[0]?.id ?? 0;

    return maxId + 1;
}
  
module.exports = { connectToMongo, disconnectToMongo , connectToCollection , generateId};
