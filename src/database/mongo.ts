import { Collection, Db, MongoClient } from "mongodb";
import { mongoUrl } from "../helpers";

/*
  Create the mongo client then connect with it,
  Once connected, connect to the database then the collection.
  The collection property will be used as the stores
*/
export default class Mongo {
  client: MongoClient = new MongoClient(mongoUrl);
  db: Db;
  collection: Collection;

  constructor(db: string, collection: string) {
    this.client.connect((err) => {
      if (!err) {
        console.log("\t 📜", collection);
      }
    });

    this.db = this.client.db(db);
    this.collection = this.db.collection(collection);
  }
}

// TODO add a time out and an error if the mongo connection isnt made within a few seconds
