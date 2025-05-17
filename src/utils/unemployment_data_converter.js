import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const inputFile = join(__dirname, '../../data/unemployment_data/unemployment_2006_2025.xlsx');
const outputFile = join(__dirname, '../../data/unemployment_data/unemployment_data.csv');
const populationFile = join(__dirname, '../../data/population_data/population.csv'); // You'll need to provide this

// Target periods for analysis
const TARGET_PERIODS = ['2018-09', '2022-09'];

// Column indices (based on the Excel structure)
const COLUMNS = {
    PERIOD: 0,
    LAN: 1,
    KOMMUN: 2,
    ARBETSLOSA: 3,
    ARBETSKRAFT: 4  // Add this if available in the Excel file
};

// Function to normalize kommun names to match our existing format
function normalizeKommunName(name) {
    return name.trim()
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/[Åå]/g, 'a')
        .replace(/[Ää]/g, 'a')
        .replace(/[Öö]/g, 'o')
        .toLowerCase();
}

console.log('Starting unemployment data conversion...');

try {
    // Read the Excel file
    console.log('Reading Excel file...');
    const workbook = XLSX.readFile(inputFile);
    
    // Use the Total sheet
    const worksheet = workbook.Sheets['Total'];
    if (!worksheet) {
        throw new Error('Could not find Total sheet');
    }
    
    // Convert to JSON for easier handling
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });
    
    // Print the first few rows to understand the structure
    console.log('\nExcel file structure:');
    console.log('First row:', rawData[0]);
    console.log('Second row:', rawData[1]);
    console.log('Third row:', rawData[2]);
    console.log('\nNumber of columns:', rawData[0].length);
    
    process.exit(0); // Exit after printing structure

} catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
} 