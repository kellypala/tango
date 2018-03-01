const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("./user");
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
    required: true,
    validate: {
      validator: existUser,
      isAsync: true
    }
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

// Validation si le user exite

function existUser(value, callback){
  User.findOne({ '_id': value }, function (err, user){
    if(user){
      callback(true);
    } else {
      callback(false);
    }
  });
}

// Create the model from the schema and export it
module.exports = mongoose.model('Issue', issueSchema);
