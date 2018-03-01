const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const issueSchema = new Schema({
  status: {
    type: String,
    required: true,
    enum: ['new', 'inProgress', 'canceled', 'completed'],
    default: 'new'
  },
  description: {
    type: String,
    maxlength: [1000, 'Description must have 1000 characters max']
  },
  imageUrl: {
    type: String,
    maxlength: [500, 'Url must have 500 characters max']
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  tags: [{
    type: String
  }],
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  /*
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
  */
},
{
    timestamps: true
});
// Create the model from the schema and export it
module.exports = mongoose.model('Issue', issueSchema);
