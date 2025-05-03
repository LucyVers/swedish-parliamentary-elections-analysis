// Undersök kommun-data från MongoDB
console.log('Inspekterar kommun-data från MongoDB...');

try {
  dbQuery.use('kommun-info-mongodb');
  
  // Hämta ett exempel på kommun-data
  const kommunData = await dbQuery.collection('incomeByKommun').find({}).limit(1);
  console.log('Exempel på kommun-data:', JSON.stringify(kommunData, null, 2));
  
  // Hämta alla unika kommuner
  const kommuner = await dbQuery.collection('incomeByKommun').find({});
  console.log('Alla kommuner från MongoDB:', kommuner.map(k => k.kommun));
  
  // Kolla om vi har län-information
  if (kommunData[0].lan) {
    console.log('Län-information finns i MongoDB!');
    const lanKommunMap = {};
    for (const k of kommuner) {
      if (!lanKommunMap[k.lan]) {
        lanKommunMap[k.lan] = [];
      }
      lanKommunMap[k.lan].push(k.kommun);
    }
    console.log('Län-kommun-mappning:', lanKommunMap);
  }
  
} catch (error) {
  console.error('Error:', error);
} 