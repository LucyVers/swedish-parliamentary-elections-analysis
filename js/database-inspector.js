// Lägg till titel och beskrivning
addMdToPage(`
# Databasinspektör

Detta verktyg visar vilken information som finns tillgänglig i våra olika databaser.
`);

try {
  // 1. Undersök SQLite-databasen (counties-sqlite)
  addMdToPage(`
  ## SQLite-databasen (counties-sqlite)
  Information om Sveriges län
  `);
  
  dbQuery.use('counties-sqlite');
  let countyInfo = await dbQuery('SELECT * FROM countyInfo');
  console.log('County info:', countyInfo);
  tableFromData({ data: countyInfo });

  // 2. Undersök MySQL-databasen (geo-mysql)
  addMdToPage(`
  ## MySQL-databasen (geo-mysql)
  Geografisk information om svenska tätorter
  `);
  
  dbQuery.use('geo-mysql');
  let geoData = await dbQuery('SELECT * FROM geoData LIMIT 25');
  console.log('Geo data:', geoData);
  tableFromData({ data: geoData });

  // 3. Undersök MongoDB-databasen (kommun-info-mongodb)
  addMdToPage(`
  ## MongoDB-databasen (kommun-info-mongodb)
  Information om kommuner
  `);
  
  dbQuery.use('kommun-info-mongodb');
  
  // Kolla incomeByKommun collection
  addMdToPage(`
  ### Inkomstdata per kommun
  `);
  let incomeData = await dbQuery.collection('incomeByKommun').find({}).limit(25);
  console.log('Income data:', incomeData);
  tableFromData({ data: incomeData });
  
  // Kolla ageByKommun collection
  addMdToPage(`
  ### Åldersdata per kommun
  `);
  let ageData = await dbQuery.collection('ageByKommun').find({}).limit(25);
  console.log('Age data:', ageData);
  tableFromData({ data: ageData });

  // 4. Undersök Neo4j-databasen (riksdagsval-neo4j)
  addMdToPage(`
  ## Neo4j-databasen (riksdagsval-neo4j)
  Valresultat från riksdagsvalen 2018 och 2022
  `);
  
  dbQuery.use('riksdagsval-neo4j');
  let electionData = await dbQuery('MATCH (n:Partiresultat) RETURN n.kommun as kommun, n.parti as parti, n.roster2018 as roster2018, n.roster2022 as roster2022 LIMIT 25');
  console.log('Election data:', electionData);
  tableFromData({ data: electionData });

} catch (error) {
  console.error('Error:', error);
  addMdToPage(`
  ## Error
  Det gick inte att hämta data från databaserna: ${error.message}
  `);
} 