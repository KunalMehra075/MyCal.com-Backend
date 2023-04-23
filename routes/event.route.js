const express = require("express");
const mongoose = require("mongoose");


const EventRouter = express.Router()

require("dotenv").config();
let Dbmodel;
let email;

// Creating new user collection  step 2
function MakeUserCollection(nameofcollection) {
    email = nameofcollection;
    let EventSchema = mongoose.Schema({
        title: String,
        discription: String,
        startdate: String,
        enddate: String,
        starttime: String,
        endtime: String,
        email: String,
    })
    const DBCmodel = mongoose.model(nameofcollection, EventSchema);
    Dbmodel = DBCmodel;
    return;
}
// Creating new user collection step 1
EventRouter.post("/register", (req, res) => {
    let data = req.body;

    if (email == data.email) {
    } else {
        let data = MakeUserCollection(data.email);
        console.log("User Collection Created");
        res.json({ Message: "Usercollection is created " + data });
    }
});
// Creating new user collection step 1

// new event creating
EventRouter.post("/newevent", async (req, res) => {
    let collection = req.headers.collection;
    let data = req.body;
    if (email == collection) {
    } else {
        MakeUserCollection(collection);
    }
    console.log(collection);

    let d = await Dbmodel.aggregate([
        { $match: { startdate: data.startdate, starttime: data.starttime } },
    ]);
    console.log(data.startdate);

    let m = await Dbmodel.aggregate([{ $match: { startdate: data.startdate } }]);

    let c = 0;
    for (let i = 0; i < m.length; i++) {
        if (m[i].endtime >= data.starttime) {
            c++;
        }
    }
    if (d.length > 0) {
        res.json({ Message: "Time Slot Not Available", Created: false });
    } else if (c > 0) {
        res.json({ Message: "Time Slot Not Available", Created: false });
    } else {
        Dbmodel.insertMany([data]);
        res.json({ Message: "New event added", Created: true });
    }
});

// New event creating

EventRouter.get("/allevents", async (req, res) => {
    let collection = req.headers.collection;
    if (email == collection) {
    } else {
        MakeUserCollection(collection);
    }
    let data = await Dbmodel.find();
    res.json({ Message: "Here are all the events", Data: data });
});

EventRouter.delete("/delete", async (req, res) => {
    let data = req.body;
    if (email == data.email) {
    } else {
        MakeUserCollection(data.email);
    }

    let deleted = await Dbmodel.findOneAndDelete({ _id: data.id });
    console.log("Deleted the event", deleted);
    res.json({ Message: "Deleted", Deleted: deleted });
});


module.exports = { EventRouter };