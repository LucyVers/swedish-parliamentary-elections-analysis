import {
  getElectionMunicipalities,
  getEducationMunicipalities,
  analyzeMunicipalityNames,
  generateReport
} from './municipality-name-analyzer.js';

async function runTests() {
  console.log('=== TESTAR MUNICIPALITY NAME ANALYZER ===\n');

  // Test 1: Läs utbildningsdata
  console.log('Test 1: Läser utbildningsdata...');
  const educationData = await getEducationMunicipalities();
  console.log(`Hittade ${educationData.length} kommuner i utbildningsdata`);
  console.log('Exempel på första 3 kommuner:');
  console.log(educationData.slice(0, 3));
  console.log();

  // Test 2: Läs valdata
  console.log('Test 2: Läser valdata...');
  const electionData = await getElectionMunicipalities();
  console.log(`Hittade ${electionData.length} kommuner i valdata`);
  console.log('Exempel på första 3 kommuner:');
  console.log(electionData.slice(0, 3));
  console.log();

  // Test 3: Kör fullständig analys
  console.log('Test 3: Kör fullständig analys...');
  await analyzeMunicipalityNames();

  // Test 4: Generera och spara rapport
  console.log('\nTest 4: Genererar rapport...');
  const differences = await analyzeMunicipalityNames();
  const report = generateReport(differences);
  
  console.log('\nAnalys slutförd! Rapport:');
  console.log(report);
}

// Kör testerna
console.log('Startar tester...\n');
runTests().catch(error => {
  console.error('Ett fel uppstod under testningen:', error);
}); 