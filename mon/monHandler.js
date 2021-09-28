const mongoose = require('mongoose');

// class for handling the mongoose connection
class MonHandler {

  constructor(uri, modelName) {
    this.uri = uri;
    this.modelName = modelName;
  }

  // creates the model based on the provided schema
  createModel(modelSchema) {
    this.schema = new mongoose.Schema(modelSchema);
    mongoose.model(this.modelName, modelSchema);
  }

  // retrieves the document with the provided id
  async getDocument(documentId) {
    // connect to the database
    await mongoose.connect(`${this.uri}`, { useNewUrlParser: true, useUnifiedTopology: true });
    // get the model
    const model = await mongoose.model(this.modelName);
    // get the document
    const data = await model.findById(documentId);
    // close the connection
    await mongoose.connection.close();
    // return the document
    return data;
  }

  // update or create a new document
  async updateDocument(documentId, updatedData) {
    // connect to the database
    await mongoose.connect(`${this.uri}`, { useNewUrlParser: true, useUnifiedTopology: true });
    // get the model
    const model = await mongoose.model(this.modelName);
    // get the document
    const data = await model.findById(documentId);
    // if the document doesn't exist, create it othewise update it
    if (data === null) {
      const newDocument = new model(updatedData);
      await newDocument.save();
    }
    else {
      data.overwrite(updatedData);
      await data.save();
    }
    // close the connection
    await mongoose.connection.close();
  }
}

module.exports = MonHandler;