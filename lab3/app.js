const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { 'useUnifiedTopology': true });

let dbClient;

app.use(express.static(__dirname + "/public"));

mongoClient.connect(function (err, client) {
    dbClient = client;
    app.locals.collection = client.db("myMongoDB").collection("animals");
    app.listen(3000, function () {
        console.log("The server started http://localhost:3000/");
    });
});
    
app.get("/animals", function (req, res) {
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function (err, animals) {
        if (err) return console.log(err);
        res.send(animals)
    });
});

app.get("/animal/:id", function (req, res) {
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({ _id: id }, function (err, animal) {
        if (err) return console.log(err);
        res.send(animal);
    });
});

app.post("/animal", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const animalType = req.body.type;
    const animalName = req.body.name;
    const animalAge = req.body.age;
    const animal = { type: animalType, name: animalName, age: animalAge };
    const collection = req.app.locals.collection;
    collection.insertOne(animal, function (err, result) {
        if (err) return console.log(err);
        res.send(animal);
    });
});


app.delete("/animal/:id", function (req, res) {
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({ _id: id }, function (err, result) {
        if (err) return console.log(err);
        let animal = result.value;
        res.send(animal);
    });
});

app.put("/animal", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const animalType = req.body.type;
    const animalName = req.body.name;
    const animalAge = req.body.age;
    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({ _id: id }, { $set: { type: animalType, name: animalName, age: animalAge } }, { returnOriginal: false }, function (err, result) {
        if (err) return console.log(err);
        const animal = result.value;
        res.send(animal);
    });
});

process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});