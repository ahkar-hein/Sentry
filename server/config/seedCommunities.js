const mongoose = require("mongoose");
const Community = require("../models/Community");
require("dotenv").config();

// Pre-seeded LA County cities with coordinates
const lacCities = [
  { city: "Pomona", lat: 34.0553, lng: -117.7526, policePhone: "+19097207671" },
  { city: "Los Angeles", lat: 34.0522, lng: -118.2437, policePhone: "+12134858311" },
  { city: "Claremont", lat: 34.0967, lng: -117.7198, policePhone: "+19097492331" },
  { city: "La Verne", lat: 34.1008, lng: -117.7678, policePhone: "+19095967741" },
  { city: "Ontario", lat: 34.0633, lng: -117.6509, policePhone: "+19093958611" },
  { city: "Rancho Cucamonga", lat: 34.1064, lng: -117.5931, policePhone: "+19094778500" },
  { city: "Pasadena", lat: 34.1478, lng: -118.1445, policePhone: "+16267444241" },
  { city: "Long Beach", lat: 33.7701, lng: -118.1937, policePhone: "+15624354011" },
  { city: "Compton", lat: 33.8958, lng: -118.2201, policePhone: "+13106057000" },
  { city: "Inglewood", lat: 33.9617, lng: -118.3531, policePhone: "+13104129565" },
  { city: "Glendale", lat: 34.1425, lng: -118.2551, policePhone: "+18182411900" },
  { city: "Burbank", lat: 34.1808, lng: -118.3090, policePhone: "+18182385300" },
  { city: "Santa Monica", lat: 34.0195, lng: -118.4912, policePhone: "+13104584621" },
  { city: "Torrance", lat: 33.8358, lng: -118.3406, policePhone: "+13103287000" },
  { city: "Carson", lat: 33.8317, lng: -118.2820, policePhone: "+13108301102" },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Community.deleteMany({});
  await Community.insertMany(lacCities);
  console.log("LA County communities seeded!");
  process.exit(0);
};

seed().catch(console.error);
