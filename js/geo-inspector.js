// Undersök geografisk data från MySQL
console.log('Inspekterar geografisk data från MySQL...');

try {
  dbQuery.use('geo-mysql');
  
  // Kolla vilka kolumner som finns
  const columns = await dbQuery('DESCRIBE geoData');
  console.log('Kolumner i geoData:', columns);
  
  // Hämta exempel på data
  const exampleData = await dbQuery('SELECT * FROM geoData LIMIT 1');
  console.log('Exempel på geografisk data:', exampleData);
  
  // Kolla om vi har län-information
  const lanData = await dbQuery('SELECT DISTINCT county FROM geoData');
  if (lanData && lanData.length > 0) {
    console.log('Län-information finns i MySQL!');
    console.log('Tillgängliga län:', lanData);
    
    // Hämta kommun-län-mappning
    const kommunLanData = await dbQuery('SELECT DISTINCT locality as kommun, CONCAT(county, " län") as lan FROM geoData ORDER BY county, locality');
    console.log('Kommun-län-mappning från MySQL:', kommunLanData);
  }
  
} catch (error) {
  console.error('Error:', error);
} 