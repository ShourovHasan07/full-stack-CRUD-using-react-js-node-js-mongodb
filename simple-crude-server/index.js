const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection string
const uri =
  "mongodb+srv://shourovhasan001:SQuAZdirwEO14he5@cluster0.mv9wo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const database = client.db("usersDB");
    const usersCollection = database.collection("users");
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
      console.log(user);
    });

    // POST route to add a new user
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("new user", user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // update
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
    
      // Log the received ID and user data
      console.log(id, user);
    
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
    
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
    
      const result = await usersCollection.updateOne(filter, updateUser, options);
      res.send(result);
    });
    

    // delete

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Delete ID from database:", id);
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
  // Do not close the client here; keep it open for ongoing requests
}

// Run the MongoDB connection and route setup
run().catch(console.dir);

// Root route
app.get("/", (req, res) => {
  res.send("simple CRUD is running");
});

// Start the server
app.listen(port, () => {
  console.log(`SIMPLE CRUD is running on port ${port}`);
});
