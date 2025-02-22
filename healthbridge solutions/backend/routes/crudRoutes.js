import express from "express";

const createCrudRoutes = (client, dbName, collectionName) => {
  const router = express.Router();
  const collection = client.db(dbName).collection(collectionName);

  // GET all documents
  router.get("/", async (req, res) => {
    try {
      const data = await collection.find({}).toArray();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching data", error });
    }
  });

  // GET a document by ID
  router.get("/:id", async (req, res) => {
    try {
      const { ObjectId } = await import("mongodb");
      const document = await collection.findOne({ _id: new ObjectId(req.params.id) });
      if (!document) return res.status(404).json({ message: "Document not found" });
      res.status(200).json(document);
    } catch (error) {
      res.status(500).json({ message: "Error fetching document", error });
    }
  });

  // POST - Create a new document
  router.post("/", async (req, res) => {
    try {
      const newDoc = req.body;
      const result = await collection.insertOne(newDoc);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error adding document", error });
    }
  });

  // PUT - Replace a document by ID
  router.put("/:id", async (req, res) => {
    try {
      const { ObjectId } = await import("mongodb");
      const updatedDoc = req.body;
      const result = await collection.replaceOne({ _id: new ObjectId(req.params.id) }, updatedDoc);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error updating document", error });
    }
  });

  // PATCH - Update part of a document by ID
  router.patch("/:id", async (req, res) => {
    try {
      const { ObjectId } = await import("mongodb");
      const updates = req.body;
      const result = await collection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updates }
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error updating document", error });
    }
  });

  // DELETE - Remove a document by ID
  router.delete("/:id", async (req, res) => {
    try {
      const { ObjectId } = await import("mongodb");
      const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error deleting document", error });
    }
  });

  return router;
};

export default createCrudRoutes;
