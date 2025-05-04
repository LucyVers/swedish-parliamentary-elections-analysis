// Add title and project description
addMdToPage(`
# Förändringens geografi: Sverige 2018-2022

## Om projektet
Detta projekt analyserar de politiska förändringarna i Sverige mellan riksdagsvalen 2018 och 2022. 
Min huvudfråga är: Finns det ett samband mellan ekonomiska faktorer och politiska förändringar i Sveriges kommuner?

## Huvudfokus och Resultat
- **Valresultat 2018-2022**: Detaljerad analys av förändringar i partistöd mellan valen för alla riksdagspartier
- **Inkomstkorrelation**: Omfattande analys av samband mellan medelinkomst och röstmönster för samtliga partier
- **Geografiska Mönster**: Identifiering av regionala trender och kommunala skillnader i politiska förändringar

## Viktiga Upptäckter
1. **Inkomstsamband**:
   - Varierande korrelationer mellan inkomstnivåer och partistöd
   - Både positiva och negativa samband identifierade
   - Komplext mönster som visar olika socioekonomiska kopplingar

2. **Regionala Trender**:
   - Tydliga geografiska mönster i politiska förändringar
   - Variationer mellan storstadsområden och övriga kommuner
   - Särskild analys av Stockholms län med alla 26 kommuner
   - Jämförelser mellan olika län och regioner

3. **Metodologi**:
   - Omfattande dataanalys från flera officiella källor
   - Transparent verifieringsprocess för datakvalitet
   - Standardisering av kommunnamn över olika databaser
   - Detaljerad kvalitetskontroll av all data

## Interaktiva Visualiseringar
- Utforska valresultat per kommun och län
- Analysera inkomstkorrelationer för alla partier
- Jämföra förändringar mellan valen 2018-2022
- Geografisk visualisering av politiska förändringar

## Teknisk Implementation
- Fullständig integration av data från fyra olika databaser
- Avancerad databehandling för att säkerställa konsistens
- Responsiv visualisering anpassad för olika skärmstorlekar
- Automatisk felhantering och datavalidering
`);

// Add current election statistics
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

  // Add note about data sources
  addMdToPage(`
## Mer Information
För detaljerad information om:
- Datakällor och deras tillförlitlighet
- Databasstruktur och integration
- Kvalitetssäkringsprocesser

Besök [Datakällor](javascript:loadPage('data-sources.js')).
  `);

} catch (error) {
  console.error('Error fetching election data:', error);
  addMdToPage(`
  ## Error
  Det gick inte att hämta valstatistiken. Kontrollera databasanslutningen.
  `);
} 