// Undersök MySQL-databasens struktur
addMdToPage(`
# MySQL Databasinspektör
`);

try {
  dbQuery.use('geo-mysql');
  
  // Hämta första raden för att se kolumnerna
  const result = await dbQuery('SELECT * FROM geoData LIMIT 1');
  
  if (result && result.length > 0) {
    const columns = Object.keys(result[0]);
    addMdToPage(`
    ## Kolumner i geoData:
    - ${columns.join('\n- ')}
    `);
  } else {
    addMdToPage(`
    ## Varning
    Ingen data hittades i tabellen.
    `);
  }
  
} catch (error) {
  addMdToPage(`
  ## Error
  Kunde inte hämta databasstruktur: ${error.message}
  `);
} 