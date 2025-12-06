// import mongoose from "mongoose";

// const ThreadSchema = new mongoose.Schema({
//   threadId: {
//     type: String,
//     required: true, 
//     unique: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   title: {
//     type: String,
//     required: true,
//   },
//   messages: [
//     {
//       type: String,
//     },
//   ],
// });

// export default mongoose.model("Thread", ThreadSchema);


import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant', 'system', 'model'] // strict roles
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ThreadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String, // Or mongoose.Schema.Types.ObjectId if linking to User model
    required: false
  },
  title: {
    type: String,
    required: false
  },
  // KEY FIX: messages must be an array of MessageSchema, not just [String]
  messages: [MessageSchema] 
}, { timestamps: true });

const Thread = mongoose.model('Thread', ThreadSchema);

export default Thread;