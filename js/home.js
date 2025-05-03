// Add title and project description
addMdToPage(`
# Förändringens geografi: Sverige 2018-2022

## Om projektet
Detta projekt analyserar de politiska förändringarna i Sverige mellan riksdagsvalen 2018 och 2022. 
Min huvudfråga är: Finns det ett samband mellan ekonomiska faktorer och politiska förändringar i Sveriges kommuner?

## Huvudfokus
- **Valresultat 2018-2022**: Analys av valresultaten från dessa specifika riksdagsval
- **Jämförelse mellan valen**: Undersökning av politiska förändringar
- **Ekonomisk korrelation**: Analys av sambandet mellan medelinkomst och röstmönster

## Datakällor
- Valresultat från Valmyndigheten (2018 och 2022)
- Inkomststatistik från SCB
- Geografisk data från Lantmäteriet

## Hypotes
Min grundläggande hypotes är att det finns en korrelation mellan medelinkomst och politiska förändringar i kommunerna. 
Genom att analysera data från olika källor strävar jag efter att undersöka denna hypotes och presentera resultaten på ett 
tydligt och tillgängligt sätt.
`);

// Add a preview of latest election results
addMdToPage(`
## Snabbfakta: Riksdagsvalet 2022
`);

// Fetch and display basic election statistics
try {
  dbQuery.use('riksdagsval-neo4j');
  let totalVotes2022 = await dbQuery('MATCH (n:Partiresultat) RETURN sum(n.roster2022) as total');
  let partyResults = await dbQuery('MATCH (n:Partiresultat) RETURN n.parti as party, sum(n.roster2022) as votes ORDER BY votes DESC LIMIT 8');
  
  // Calculate percentages and create table data
  let total = totalVotes2022[0].total;
  let tableData = partyResults.map(r => ({
    Parti: r.party,
    Röster: r.votes,
    'Andel (%)': ((r.votes / total) * 100).toFixed(2)
  }));

  // Display results table
  tableFromData({
    data: tableData,
    columnNames: ['Parti', 'Röster', 'Andel (%)']
  });
} catch (error) {
  console.error('Error fetching election data:', error);
  addMdToPage(`
  ## Error
  Det gick inte att hämta valstatistiken. Kontrollera databasanslutningen.
  `);
} 