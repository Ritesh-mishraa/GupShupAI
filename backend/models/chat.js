import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
     username: {type: String, required: true},
     messages:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
     createdAt: {type: Date, default: Date.now},
})

export default mongoose.model("Chat", chatSchema);