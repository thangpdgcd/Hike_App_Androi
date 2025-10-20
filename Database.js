import * as SQLite from "expo-sqlite";

const database_name = "HikeApp.db";

let db;

const initDatabase = () => {
  return new Promise(async (resolve, reject) => {
    try {
      db = await SQLite.openDatabaseAsync(database_name);
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS hikeApp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        location TEXT,
        date DATETIME,
        parking TEXT,
        length TEXT,
        level TEXT,
        description TEXT
      );
    `);
      resolve(database_name);
      console.log("Database and table created successfully.");
    } catch (error) {
      reject(database_name);
      console.log("Error initializing database:", error);
    }
  });
};

// Helper functions use async/await
const getHike = async () => {
  const allRows = await db.getAllAsync("SELECT * FROM HikeApp");
  console.log(`get all data + ${allRows}`);
  return allRows;
};

const addHike = async (
  name,
  location,
  date,
  parking,
  length,
  level,
  description
) => {
  if (
    !name ||
    !location ||
    !date ||
    !parking ||
    !length ||
    !level ||
    !description
  ) {
    throw new Error("All fields must be provided.");
  }

  const result = await db.runAsync(
    "INSERT INTO hikeApp (name, location, date, parking, length, level, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, location, date, parking, length, level, description]
  );
  return result.lastInsertRowId;
};

const editHike = async (
  id,
  name,
  location,
  date,
  parking,
  length,
  level,
  description
) => {
  const result = await db.runAsync(
    "UPDATE hikeApp SET name=?, location=?, date=?, parking=?, length=?, level=?, description=? WHERE id=?",
    [name, location, date, parking, length, level, description, id]
  );
  if (result.changes === 0) throw new Error(`Hike with id ${id} not found`);
  return result.changes;
};

const deleteHike = async (id) => {
  await db.runAsync("DELETE FROM hikeApp WHERE id=?", [id]);
};

const deleteAllHike = async () => {
  await db.runAsync("DELETE FROM hikeApp");
};

const getHikesByName = async (name) => {
  const rows = await db.getAllAsync("SELECT * FROM hikeApp WHERE name LIKE ?", [
    `%${name}%`,
  ]);
  return rows;
};

export default {
  initDatabase,
  addHike,
  getHike,
  editHike,
  deleteHike,
  deleteAllHike,
  getHikesByName,
};
