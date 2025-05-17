import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Läs in databasanslutningar från konfigurationsfilen
const dbConnectionsPath = path.join(__dirname, 'database_connections.json');
const dbConnections = JSON.parse(fs.readFileSync(dbConnectionsPath, 'utf8'));

// Håll reda på aktiv databas
let activeDatabase = dbConnections[0]?.name || null;

// Funktion för att byta aktiv databas
function useDatabase(name) {
  const database = dbConnections.find(db => db.name === name);
  if (!database) {
    throw new Error(`Database "${name}" not found in configuration`);
  }
  activeDatabase = name;
}

// Funktion för att utföra databasfrågor
async function query(queryString, params = {}) {
  const database = dbConnections.find(db => db.name === activeDatabase);
  if (!database) {
    throw new Error('No active database selected');
  }

  // Här skulle vi normalt ha logik för att utföra själva databasfrågan
  // För nu returnerar vi bara en simulerad respons
  return [];
}

// Exportera databasfunktioner
export const dbQuery = {
  use: useDatabase,
  query: query
}; 