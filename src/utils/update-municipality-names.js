import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definiera mappningar för kommunnamn som behöver ändras
const nameMappings = {
    'DalsEd': 'Dals-Ed',
    'Habo': 'Håbo',
    'MalungSalen': 'Malung-Sälen',
    'UpplandssBro': 'Upplands-Bro'
};

// Sökvägar till filer
const inputPath = path.join(__dirname, '../../data/education_data/education_by_municipality_2024.csv');
const outputPath = path.join(__dirname, '../../data/education_data/education_by_municipality_2024.updated.csv');

// Läs in original CSV-filen
const fileContent = fs.readFileSync(inputPath, 'utf8');
const rows = fileContent.split('\n');

// Uppdatera kommunnamnen
const updatedRows = rows.map((row, index) => {
    if (index === 0) return row; // Behåll header-raden oförändrad
    
    const columns = row.split(';');
    if (columns.length < 2) return row; // Skippa tomma rader
    
    const kommunNamn = columns[1];
    if (nameMappings[kommunNamn]) {
        // Uppdatera kommunnamnet
        columns[1] = nameMappings[kommunNamn];
        // Uppdatera det normaliserade namnet (sista kolumnen)
        columns[columns.length - 1] = columns[1]
            .toLowerCase()
            .replace(/å/g, 'a')
            .replace(/ä/g, 'a')
            .replace(/ö/g, 'o')
            .replace(/[^a-z]/g, '');
    }
    
    return columns.join(';');
});

// Skriv till en ny fil
fs.writeFileSync(outputPath, updatedRows.join('\n'), 'utf8');

console.log('CSV-fil uppdaterad och sparad som "education_by_municipality_2024.updated.csv"');
console.log('Kontrollera den nya filen innan du ersätter originalet.'); 