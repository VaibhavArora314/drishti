import mongoose from 'mongoose';

// Define User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
    required: true
  },
  SOSEmails: {
    type: [String], 
    default: [] 
  }
});


const UserModel = mongoose.model('User', userSchema);

export default UserModel;