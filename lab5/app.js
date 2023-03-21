const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const {
    MONGO_DB_HOSTNAME,
    MONGO_DB_PORT,
    MONGO_DB
} = process.env

const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;

const animalScheme = new Schema({
    type: String,
    name: String,
    age: String
}, { versionKey: false });

const Animal = mongoose.model("Animal", animalScheme);

app.use(express.static(__dirname + "/public"));

mongoose.connect(url, {
    useNewUrlParser: true,
    retryWrites: true,
    w: "majority"}, function (err) {
        
    if (err) return console.log(err);
    app.listen(3000, function () {console.log("Server is waiting for connection ...");});
});

    
app.get("/animals", function (req, res) {
    Animal.find({}, function (err, animals) {
        if (err) return console.log(err);
        res.send(animals)
    });
});

app.get("/animal/:id", function (req, res) {
    const id = req.params.id;
    Animal.findOne({ _id: id }, function (err, animal) {

            if (err) return console.log(err);
            res.send(animal);
    });

});

app.post("/animal", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const animalType = req.body.type;
    const animalName = req.body.name;
    const animalAge = req.body.age;
    const animal = new Animal({ type: animalType, name: animalName, age: animalAge });
    animal.save(function (err) {
        if (err) return console.log(err);
        res.send(animal);
    });

});


app.delete("/animal/:id", function (req, res) {
    const id = req.params.id;
    Animal.findByIdAndDelete(id, function (err, animal) {

            if (err) return console.log(err);
            res.send(animal);
    });

});

app.put("/animal", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const animalType = req.body.type;
    const animalName = req.body.name;
    const animalAge = req.body.age;
    const newAnimal = { type: animalType, name: animalName, age: animalAge };
    Animal.findOneAndUpdate({ _id: id }, newAnimal, { new: true }, function (err, animal) {
        if (err) return console.log(err);
        res.send(animal);
    });
});
