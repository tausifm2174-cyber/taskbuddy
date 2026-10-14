import mongoose from 'mongoose';
import { memoryDb } from './dbFallback.js';

const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Task text is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    category: {
      type: String,
      enum: ['General', 'Work', 'Personal'],
      default: 'General',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseTask = mongoose.model('Task', taskSchema);

const Task = {
  get schema() {
    return taskSchema;
  },
  find(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongooseTask.find(query);
    }
    return {
      async sort(sortObj) {
        const res = await memoryDb.tasks.find(query);
        return res.sort(sortObj);
      },
      async then(resolve, reject) {
        try {
          const res = await memoryDb.tasks.find(query);
          resolve(res.sort({ createdAt: -1 }));
        } catch (err) {
          reject(err);
        }
      },
    };
  },
  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseTask.findById(id);
    }
    return await memoryDb.tasks.findById(id);
  },
  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseTask.create(data);
    }
    return await memoryDb.tasks.create(data);
  },
  async deleteMany(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseTask.deleteMany(query);
    }
    return await memoryDb.tasks.deleteMany(query);
  },
};

export default Task;
