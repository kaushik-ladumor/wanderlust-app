const mongoose = require('mongoose');
const data = require('./data');
const Listing = require('../models/listing');


main()
  .then(() => {
    console.log("MongoDB Connection Successfully");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airBnb");
}


const initDB = async () => {
    await Listing.deleteMany({});
    Listing.insertMany(data.data);
    console.log("Data was initialized")
}

initDB();