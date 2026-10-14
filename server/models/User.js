import mongoose from 'mongoose';
import { memoryDb } from './dbFallback.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const MongooseUser = mongoose.model('User', userSchema);

const User = {
  get schema() {
    return userSchema;
  },
  async findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.findOne(query);
    }
    return await memoryDb.users.findOne(query);
  },
  findById(id) {
    if (mongoose.connection.readyState === 1) {
      return MongooseUser.findById(id);
    }
    return {
      select: (fields) => {
        return {
          async then(resolve, reject) {
            try {
              const u = await memoryDb.users.findById(id);
              if (!u) return resolve(null);
              const { password, ...safeUser } = u;
              resolve(safeUser);
            } catch (err) {
              reject(err);
            }
          },
        };
      },
      async then(resolve, reject) {
        try {
          const u = await memoryDb.users.findById(id);
          resolve(u);
        } catch (err) {
          reject(err);
        }
      },
    };
  },
  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return await MongooseUser.create(data);
    }
    return await memoryDb.users.create(data);
  },
};

export default User;
