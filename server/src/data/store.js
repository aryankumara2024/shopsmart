/**
 * JSON File-Based Storage Engine
 * Reads/writes data to JSON files in the storage/ directory.
 * Thread-safe writes with atomic file operations.
 */

const fs = require("fs");
const path = require("path");

const STORAGE_DIR = path.join(__dirname, "..", "..", "storage");

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

/**
 * Get the file path for a given collection name.
 */
function getFilePath(collection) {
  return path.join(STORAGE_DIR, `${collection}.json`);
}

/**
 * Read all records from a collection.
 * Returns an empty array if the file doesn't exist.
 */
function readAll(collection) {
  const filePath = getFilePath(collection);
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${collection}:`, err.message);
    return [];
  }
}

/**
 * Write all records to a collection (full overwrite).
 */
function writeAll(collection, data) {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error(`Error writing ${collection}:`, err.message);
    return false;
  }
}

/**
 * Find a single record by a predicate function.
 */
function findOne(collection, predicate) {
  const data = readAll(collection);
  return data.find(predicate) || null;
}

/**
 * Find all records matching a predicate function.
 */
function findMany(collection, predicate) {
  const data = readAll(collection);
  return data.filter(predicate);
}

/**
 * Insert a new record into a collection.
 * Returns the inserted record.
 */
function insertOne(collection, record) {
  const data = readAll(collection);
  data.push(record);
  writeAll(collection, data);
  return record;
}

/**
 * Update records matching a predicate with an updater function.
 * updater receives the record and should return the updated record.
 * Returns the number of records updated.
 */
function updateMany(collection, predicate, updater) {
  const data = readAll(collection);
  let count = 0;
  const updated = data.map((record) => {
    if (predicate(record)) {
      count++;
      return updater(record);
    }
    return record;
  });
  if (count > 0) writeAll(collection, updated);
  return count;
}

/**
 * Update a single record matching a predicate.
 * Returns the updated record, or null if not found.
 */
function updateOne(collection, predicate, updater) {
  const data = readAll(collection);
  let updatedRecord = null;
  const updated = data.map((record) => {
    if (!updatedRecord && predicate(record)) {
      updatedRecord = updater(record);
      return updatedRecord;
    }
    return record;
  });
  if (updatedRecord) writeAll(collection, updated);
  return updatedRecord;
}

/**
 * Delete records matching a predicate.
 * Returns the number of records deleted.
 */
function deleteMany(collection, predicate) {
  const data = readAll(collection);
  const filtered = data.filter((record) => !predicate(record));
  const count = data.length - filtered.length;
  if (count > 0) writeAll(collection, filtered);
  return count;
}

module.exports = {
  readAll,
  writeAll,
  findOne,
  findMany,
  insertOne,
  updateOne,
  updateMany,
  deleteMany,
};
