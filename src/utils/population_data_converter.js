import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const inputFile = join(__dirname, '../../data/population_data/population_1950_2024.xlsx');
const outputFile = join(__dirname, '../../data/population_data/population_data.csv');

// Function to normalize kommun names to match our existing format
function normalizeKommunName(name) {
    return name.trim()
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/[Åå]/g, 'a')
        .replace(/[Ää]/g, 'a')
        .replace(/[Öö]/g, 'o')
        .toLowerCase();
}

// Function to validate population value
function isValidPopulation(value) {
    return typeof value === 'number' && !isNaN(value) && value > 0;
}

console.log('Starting population data conversion...');

try {
    // Read the Excel file
    console.log('Reading Excel file...');
    const workbook = XLSX.readFile(inputFile);
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON for easier handling
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });
    
    // Find the header row (the one with 'Kommun' and years)
    const headerRowIndex = rawData.findIndex(row => row[0] === 'Kommun');
    if (headerRowIndex === -1) {
        throw new Error('Could not find header row with "Kommun"');
    }
    
    // Get the column indices for 2018 and 2022
    const headers = rawData[headerRowIndex];
    const year2018Index = headers.indexOf(2018);
    const year2022Index = headers.indexOf(2022);
    
    if (year2018Index === -1 || year2022Index === -1) {
        throw new Error('Could not find columns for 2018 and/or 2022');
    }
    
    // Process the data rows
    const processedData = [];
    let skippedRows = 0;
    
    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
        const row = rawData[i];
        // Skip rows that don't start with a valid kommun name or are comments
        if (!row[0] || typeof row[0] !== 'string' || row[0].toLowerCase().includes('kommentar')) {
            skippedRows++;
            continue;
        }
        
        const population2018 = row[year2018Index];
        const population2022 = row[year2022Index];
        
        // Validate population data
        if (!isValidPopulation(population2018) || !isValidPopulation(population2022)) {
            console.log(`Warning: Invalid population data for ${row[0]}`);
            skippedRows++;
            continue;
        }
        
        const kommun = row[0];
        const normalized = normalizeKommunName(kommun);
        
        processedData.push({
            kommun,
            normalized,
            population2018,
            population2022
        });
    }
    
    // Create CSV content
    const csvHeader = 'kommun,kommun_normalized,population_2018,population_2022';
    const csvRows = processedData.map(row => 
        `${row.kommun},${row.normalized},${row.population2018},${row.population2022}`
    );
    
    // Write to file
    fs.writeFileSync(outputFile, [csvHeader, ...csvRows].join('\n'));
    
    console.log(`\nProcessing complete!`);
    console.log(`Processed ${processedData.length} municipalities`);
    console.log(`Skipped ${skippedRows} invalid rows`);
    console.log(`Output saved to: ${outputFile}`);
    
    // Print first few rows as example
    console.log('\nFirst few rows of output:');
    console.log(csvHeader);
    csvRows.slice(0, 3).forEach(row => console.log(row));
    
    // Print last few rows
    console.log('\nLast few rows of output:');
    csvRows.slice(-3).forEach(row => console.log(row));

} catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
} 