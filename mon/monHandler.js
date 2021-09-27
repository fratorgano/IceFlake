const mongoose = require('mongoose');

class MonHandler {
  constructor(uri, modelName) {
    this.uri = uri;
    this.modelName = modelName;
  }

  createModel(modelSchema) {
    this.schema = new mongoose.Schema(modelSchema);
    mongoose.model(this.modelName, modelSchema);
  }

  getModel() {
    return mongoose.model(this.modelName);
  }

  async getDocument(documentId) {
    await mongoose.connect(`${this.uri}`, { useNewUrlParser: true, useUnifiedTopology: true });
    const model = await mongoose.model(this.modelName);
    const data = await model.findById(documentId);
    await mongoose.connection.close();
    return data;
  }

  async updateDocument(documentId, updatedData) {
    await mongoose.connect(`${this.uri}`, { useNewUrlParser: true, useUnifiedTopology: true });
    const model = await mongoose.model(this.modelName);
    const data = await model.findById(documentId);
    if (data === null) {
      const newDocument = new model(updatedData);
      await newDocument.save();
    }
    else {
      data.overwrite(updatedData);
      await data.save();
    }
    await mongoose.connection.close();
  }

  async getTop3() {
    await mongoose.connect(`${this.uri}`, { useNewUrlParser: true, useUnifiedTopology: true });
    const model = await mongoose.model(this.modelName);
    const data = await model.find().sort('-points').limit(3).exec();
    return data;
  }
}

module.exports = MonHandler;