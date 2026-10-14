// Persistent JSON file fallback store for development when MongoDB is not running
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadData() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      };
    }
  } catch (err) {
    console.error('Error reading fallback db.json, creating clean store:', err.message);
  }
  const initial = { users: [], tasks: [] };
  saveData(initial);
  return initial;
}

function saveData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving fallback db.json:', err.message);
  }
}

class JsonCollection {
  constructor(collectionName) {
    this.name = collectionName;
  }

  generateId() {
    return crypto.randomBytes(12).toString('hex');
  }

  getAll() {
    const data = loadData();
    return data[this.name] || [];
  }

  saveAll(items) {
    const data = loadData();
    data[this.name] = items;
    saveData(data);
  }

  wrapDocument(doc) {
    if (!doc) return null;
    const self = this;
    return {
      ...doc,
      save: async function () {
        this.updatedAt = new Date().toISOString();
        const items = self.getAll();
        const idx = items.findIndex((i) => i._id.toString() === this._id.toString());
        const plain = { ...this };
        delete plain.save;
        delete plain.deleteOne;
        delete plain.select;
        if (idx !== -1) {
          items[idx] = plain;
        } else {
          items.push(plain);
        }
        self.saveAll(items);
        return self.wrapDocument(plain);
      },
      deleteOne: async function () {
        const items = self.getAll().filter((i) => i._id.toString() !== this._id.toString());
        self.saveAll(items);
        return { acknowledged: true, deletedCount: 1 };
      },
    };
  }

  async findOne(query) {
    const items = this.getAll();
    const found = items.find((item) => {
      for (const key of Object.keys(query)) {
        const expected = query[key];
        const actual = item[key];
        if (typeof expected === 'string' && typeof actual === 'string') {
          if (expected.toLowerCase() !== actual.toLowerCase()) return false;
        } else if (expected !== actual) {
          return false;
        }
      }
      return true;
    });
    return this.wrapDocument(found);
  }

  async findById(id) {
    const items = this.getAll();
    const found = items.find((i) => i._id.toString() === id.toString());
    return this.wrapDocument(found);
  }

  async find(query = {}) {
    const items = this.getAll();
    const matches = items.filter((item) => {
      for (const key of Object.keys(query)) {
        const expected = query[key];
        const actual = item[key];
        if (expected && expected._id) {
          if (actual?.toString() !== expected._id.toString()) return false;
        } else if (actual?.toString() !== expected?.toString()) {
          return false;
        }
      }
      return true;
    });

    const wrapped = matches.map((m) => this.wrapDocument(m));

    return {
      sort: (sortObj) => {
        if (sortObj?.createdAt === -1) {
          return [...wrapped].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return wrapped;
      },
    };
  }

  async create(data) {
    const _id = this.generateId();
    const now = new Date().toISOString();
    const doc = {
      _id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const items = this.getAll();
    items.push(doc);
    this.saveAll(items);
    return this.wrapDocument(doc);
  }

  async deleteMany(query) {
    const items = this.getAll();
    const filtered = items.filter((item) => {
      for (const key of Object.keys(query)) {
        const expected = query[key];
        const actual = item[key];
        if (expected && expected._id) {
          if (actual?.toString() === expected._id.toString()) return false;
        } else if (actual?.toString() === expected?.toString()) {
          return false;
        }
      }
      return true;
    });
    const deletedCount = items.length - filtered.length;
    this.saveAll(filtered);
    return { acknowledged: true, deletedCount };
  }
}

export const memoryDb = {
  users: new JsonCollection('users'),
  tasks: new JsonCollection('tasks'),
  dbPath: DB_FILE,
};
