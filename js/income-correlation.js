// Add title and description
addMdToPage(`
# Inkomstkorrelation med valresultat
Analys av sambandet mellan medelinkomst och förändringar i partistöd mellan 2018 och 2022.
`);

// Get party list for dropdown
dbQuery.use('riksdagsval-neo4j');
let partyQuery = 'MATCH (n:Partiresultat) RETURN DISTINCT n.parti as parti ORDER BY parti';
let parties = await dbQuery(partyQuery);
let selectedParty = addDropdown('Välj parti för analys:', 
  parties.map(p => p.parti)
);

try {
  // Fetch income data
  dbQuery.use('kommun-info-mongodb');
  let incomeData = await dbQuery.collection('incomeByKommun').find({});
  
  // Fetch election results
  dbQuery.use('riksdagsval-neo4j');
  let electionResults = await dbQuery(`
    MATCH (n:Partiresultat)
    WHERE n.parti = $party
    RETURN n.kommun as kommun, n.roster2018 as roster2018, n.roster2022 as roster2022
  `, { party: selectedParty });

  if (!Array.isArray(electionResults)) {
    console.error('Unexpected format for election results:', electionResults);
    throw new Error('Ogiltig datastruktur från databasen');
  }

  if (!Array.isArray(incomeData)) {
    console.error('Unexpected format for income data:', incomeData);
    throw new Error('Ogiltig datastruktur från inkomstdatabasen');
  }

  // Combine and process data
  let analysisData = electionResults.map(result => {
    let kommunIncome = incomeData.find(i => i.kommun === result.kommun);
    if (!kommunIncome) return null;

    let total2018 = result.roster2018 || 0;
    let total2022 = result.roster2022 || 0;
    
    // Skip if we don't have valid vote counts
    if (total2018 === 0 || total2022 === 0) return null;
    
    let change = ((total2022 - total2018) / total2018 * 100);
    
    return {
      Kommun: result.kommun,
      'Medelinkomst (tkr)': Math.round(kommunIncome.meanIncome),
      'Förändring i röster (%)': change.toFixed(2),
      'Röster 2018': total2018,
      'Röster 2022': total2022
    };
  }).filter(d => d !== null);

  if (analysisData.length === 0) {
    throw new Error('Ingen data tillgänglig för analys');
  }

  // Calculate correlation
  let incomeValues = analysisData.map(d => d['Medelinkomst (tkr)']);
  let changeValues = analysisData.map(d => parseFloat(d['Förändring i röster (%)']));
  let correlation = s.sampleCorrelation(incomeValues, changeValues);

  addMdToPage(`
  ## Korrelationsanalys för ${selectedParty}
  Korrelationskoefficient mellan medelinkomst och röstförändring: **${correlation.toFixed(3)}**
  
  * En koefficient nära +1 indikerar stark positiv korrelation
  * En koefficient nära -1 indikerar stark negativ korrelation
  * En koefficient nära 0 indikerar svag eller ingen korrelation
  `);

  // Create scatter plot
  drawGoogleChart({
    type: 'ScatterChart',
    data: makeChartFriendly(
      analysisData,
      'Medelinkomst (tkr)',
      'Förändring i röster (%)'
    ),
    options: {
      title: `Medelinkomst vs. Röstförändring för ${selectedParty}`,
      hAxis: { title: 'Medelinkomst (tkr)' },
      vAxis: { title: 'Förändring i röster (%)', format: '+#.#;-#.#' },
      trendlines: { 0: {} },
      height: 500,
      pointSize: 5,
      chartArea: { left: 60, top: 50, width: '80%', height: '80%' }
    }
  });

  // Add detailed data table
  addMdToPage(`
  ## Detaljerad data per kommun
  `);
  
  tableFromData({
    data: analysisData,
    fixedHeader: true,
    numberFormatOptions: {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      signDisplay: 'always'
    }
  });

} catch (error) {
  console.error('Error in analysis:', error);
  addMdToPage(`
  ## Error
  Det gick inte att genomföra analysen. Kontrollera databasanslutningarna.
  Error: ${error.message}
  `);
} 