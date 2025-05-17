import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const populationFile = join(__dirname, '../../data/population_data/population_data.csv');
const unemploymentFile = join(__dirname, '../../data/unemployment_data/unemployment_data.csv');
const outputFile = join(__dirname, '../../data/unemployment_data/unemployment_rates.csv');

console.log('Starting unemployment rate calculation...');

try {
    // Read population data
    console.log('Reading population data...');
    const populationData = fs.readFileSync(populationFile, 'utf-8')
        .split('\n')
        .map(line => line.split(','))
        .filter(row => row.length > 1); // Filter out empty rows

    // Read unemployment data
    console.log('Reading unemployment data...');
    const unemploymentData = fs.readFileSync(unemploymentFile, 'utf-8')
        .split('\n')
        .map(line => line.split(','))
        .filter(row => row.length > 1); // Filter out empty rows

    // Get headers
    const populationHeaders = populationData[0];
    const unemploymentHeaders = unemploymentData[0];
    
    // Create map for population data
    const populationMap = new Map();
    
    // Skip header row and process population data
    for (let i = 1; i < populationData.length; i++) {
        const row = populationData[i];
        const kommun = row[0];
        const population2018 = parseFloat(row[2]);
        const population2022 = parseFloat(row[3]);
        
        if (kommun && !isNaN(population2018) && !isNaN(population2022)) {
            populationMap.set(kommun, {
                population2018,
                population2022
            });
        }
    }

    // Calculate unemployment rates and create output
    const outputRows = [
        'kommun,kommun_normalized,unemployment_2018,unemployment_2022,population_2018,population_2022,unemployment_rate_2018,unemployment_rate_2022'
    ];

    // Skip header row for unemployment data
    for (let i = 1; i < unemploymentData.length; i++) {
        const row = unemploymentData[i];
        const kommun = row[0];
        const normalized = row[1];
        const unemployed2018 = parseFloat(row[2]);
        const unemployed2022 = parseFloat(row[3]);
        
        const populationData = populationMap.get(kommun);
        
        if (populationData && !isNaN(unemployed2018) && !isNaN(unemployed2022)) {
            const { population2018, population2022 } = populationData;
            
            const rate2018 = ((unemployed2018 / population2018) * 100).toFixed(2);
            const rate2022 = ((unemployed2022 / population2022) * 100).toFixed(2);
            
            outputRows.push(
                `${kommun},${normalized},${unemployed2018},${unemployed2022},${population2018},${population2022},${rate2018},${rate2022}`
            );
        } else {
            console.log(`Warning: Missing or invalid data for kommun: ${kommun}`);
        }
    }

    // Save results
    fs.writeFileSync(outputFile, outputRows.join('\n'));
    
    console.log('\nCalculation complete!');
    console.log(`Results saved to: ${outputFile}`);
    
    // Print some statistics
    const processedRows = outputRows.length - 1; // Subtract header row
    console.log(`\nProcessed ${processedRows} municipalities.`);
    
    // Print first few rows as example
    console.log('\nFirst few rows of output:');
    console.log(outputRows[0]); // Header
    outputRows.slice(1, 4).forEach(row => console.log(row));
    
    // Calculate and print average rates
    const rates = outputRows.slice(1).map(row => {
        const parts = row.split(',');
        return {
            rate2018: parseFloat(parts[6]),
            rate2022: parseFloat(parts[7])
        };
    });
    
    const avgRate2018 = (rates.reduce((sum, r) => sum + r.rate2018, 0) / rates.length).toFixed(2);
    const avgRate2022 = (rates.reduce((sum, r) => sum + r.rate2022, 0) / rates.length).toFixed(2);
    
    console.log('\nAverage unemployment rates:');
    console.log(`2018: ${avgRate2018}%`);
    console.log(`2022: ${avgRate2022}%`);

} catch (error) {
    console.error('Error during calculation:', error);
    process.exit(1);
} 