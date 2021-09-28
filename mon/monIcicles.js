// schema for mongodb database
const schema = {
  _id: String,
  members: [{
    id: String,
    points: Number,
  }],
};
module.exports = schema;