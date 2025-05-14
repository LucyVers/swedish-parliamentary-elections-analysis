// Konverteringsscript för utbildningsdata från SCB Excel-fil till CSV-format
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input och output sökvägar
const inputFile = path.join(__dirname, '../data/education_data/education_by_municipality_2024.xlsx');
const outputFile = path.join(__dirname, '../data/education_data/education_by_municipality_2024.csv');

// Funktion för att normalisera kommunnamn (återanvänd från income-correlation.js)
function normalizeKommunName(name) {
  if (!name) return '';
  
  return name.trim()
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\skommun$/g, '')
    .replace(/\sstad$/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Funktion för att formatera nummer
function formatNumber(num) {
  if (typeof num !== 'number') return '0.00';
  return num.toFixed(2);
}

// Funktion för att hitta start-raden för data
function findDataStartRow(data) {
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    // Letar efter raden som innehåller "Kommunkod" och "Kommun"
    if (row && row[0] === 'Kommunkod' && row[1] === 'Kommun') {
      return i;
    }
  }
  return -1;
}

// Konverteringsfunktion
function convertExcelToCSV() {
  try {
    // Verifiera att filen finns
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Excel-filen finns inte: ${inputFile}`);
    }
    
    console.log('Läser Excel-fil...');
    const workbook = xlsx.readFile(inputFile);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Konvertera till JSON för enklare hantering
    const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`Antal rader i Excel: ${rawData.length}`);
    
    // Hitta var data börjar
    const dataStartRow = findDataStartRow(rawData);
    if (dataStartRow === -1) {
      throw new Error('Kunde inte hitta början på data i Excel-filen');
    }
    console.log(`Data börjar på rad: ${dataStartRow}`);
    
    // Skapa CSV-header
    const csvHeader = [
      'kommunId',
      'kommun',
      'totalBefolkning',
      'forskningUtbildning',
      'eftergymnasial3Plus',
      'eftergymnasialMindre3',
      'gymnasial3Ar',
      'gymnasialHogst2Ar',
      'grundskola',
      'forgymnasial',
      'kommunNormalized'
    ].join(';');
    
    const csvRows = [csvHeader];
    let currentKommun = null;
    let currentKommunId = null;
    
    // Bearbeta data, börja efter kolumnrubrikerna
    for (let i = dataStartRow + 2; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;
      
      // Om raden börjar med en kommunkod (numerisk)
      if (row[0] && !isNaN(row[0])) {
        currentKommunId = row[0].toString();
        currentKommun = row[1];
        continue;
      }
      
      // Om det är totalraden för kommunen
      if (row[2] === 'Totalt' && currentKommun) {
        const normalized = normalizeKommunName(currentKommun).replace(/[^a-z0-9\s]/g, '');
        
        // Extrahera och formatera utbildningsdata
        const csvRow = [
          currentKommunId.trim(),
          currentKommun.trim(),
          Math.round(row[3] || 0).toString(),
          formatNumber(row[10]),
          formatNumber(row[9]),
          formatNumber(row[8]),
          formatNumber(row[7]),
          formatNumber(row[6]),
          formatNumber(row[5]),
          formatNumber(row[4]),
          normalized.trim()
        ].join(';');
        
        csvRows.push(csvRow);
      }
    }
    
    // Skapa data-mappen om den inte finns
    const dataDir = path.dirname(outputFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Spara CSV-filen med UTF-8 encoding och utan BOM
    const csvContent = csvRows
      .map(row => row.replace(/[^a-zA-Z0-9åäöÅÄÖ\s;\.]/g, '').trim())
      .join('\n')
      .trim();
    fs.writeFileSync(outputFile, csvContent + '\n', { encoding: 'utf8' });
    
    console.log('\nKonvertering slutförd!');
    console.log(`Antal kommuner bearbetade: ${csvRows.length - 1}`); // -1 för header
    
    // Verifiera första och sista raden
    console.log('\nFörsta raden:');
    console.log(csvRows[1]);
    console.log('\nSista raden:');
    console.log(csvRows[csvRows.length - 1]);
    
  } catch (error) {
    console.error('Ett fel uppstod vid konvertering:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Kör konverteringen
convertExcelToCSV(); 