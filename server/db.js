import { MongoClient } from "mongodb";

export const DB_NAME = process.env.MONGODB_DB || "test";

let clientPromise = null;

export function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!clientPromise) {
    clientPromise = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 })
      .connect()
      .catch((err) => {
        clientPromise = null;
        throw err;
      });
  }
  return clientPromise.then((client) => client.db(DB_NAME));
}
