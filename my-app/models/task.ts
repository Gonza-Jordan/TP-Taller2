// models/task.ts
import mongoose, { Schema, model } from 'mongoose';

const taskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = model('Task', taskSchema);

export default Task;