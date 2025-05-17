// Add title and description
addMdToPage(`
# Inkomstkorrelation med valresultat
Analys av sambandet mellan medelinkomst och förändringar i partistöd mellan 2018 och 2022.
`);

// Funktion för att hämta grunddata
async function fetchInitialData() {
  try {
    addMdToPage(`## Test av databasanslutningar`);
    
    // 1. Hämta inkomstdata
  dbQuery.use('kommun-info-mongodb');
    let incomeData = await dbQuery.collection('incomeByKommun').find({}).limit(5);
    console.log('Test av inkomstdata (första 5 kommuner):', incomeData);
    
    addMdToPage(`
    ### Inkomstdata (exempel)
    Visar de första 5 kommunerna från inkomstdatabasen:
    `);
    tableFromData({ 
      data: incomeData,
      fixedHeader: true
    });
  
    // 2. Hämta exempel på valdata
    dbQuery.use('riksdagsval-neo4j');
    let electionQuery = `
      MATCH (n:Partiresultat)
      WITH n LIMIT 5
      RETURN n.kommun as kommun, 
             n.parti as parti, 
             toInteger(n.roster2018) as roster2018,
             toInteger(n.roster2022) as roster2022
    `;
    let electionData = await dbQuery(electionQuery);
    console.log('Test av valdata (första 5 rader):', electionData);

    addMdToPage(`
    ### Valdata (exempel)
    Visar de första 5 raderna från valdatabasen:
    `);
    tableFromData({ 
      data: electionData,
      fixedHeader: true
    });

    addMdToPage(`
    ### Status för databasanslutningar
    - ✅ MongoDB (inkomstdata): Anslutning OK
    - ✅ Neo4j (valdata): Anslutning OK
    `);

    return { incomeData, electionData };
  } catch (error) {
    console.error('Fel vid datahämtning:', error);
    addMdToPage(`
    ## Error
    Det uppstod ett fel vid hämtning av grunddata:
    \`\`\`
    ${error.message}
    \`\`\`
    `);
    return null;
  }
}

// Funktion för att hämta partilista
async function fetchPartyList() {
  try {
  dbQuery.use('riksdagsval-neo4j');
    let partyQuery = `
    MATCH (n:Partiresultat)
      RETURN DISTINCT n.parti as parti
      ORDER BY parti
    `;
    let parties = await dbQuery(partyQuery);
    
    if (!Array.isArray(parties)) {
      throw new Error('Kunde inte hämta partilista - ogiltig datastruktur');
    }

    return parties.map(p => p.parti);
  } catch (error) {
    console.error('Fel vid hämtning av partilista:', error);
    return [];
  }
}

// Funktion för att normalisera kommunnamn
function normalizeKommunName(name) {
  if (!name) return '';
  
  // Logga originalnamnet för debugging
  console.log('Normaliserar kommunnamn:', name);
  
  let normalized = name.trim()
    .toLowerCase()
    // Hantera svenska tecken
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    // Ta bort "kommun" om det finns i namnet
    .replace(/\skommun$/g, '')
    // Ta bort "stad" om det finns i namnet
    .replace(/\sstad$/g, '')
    // Ta bort specialtecken och dubbla mellanslag
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Logga det normaliserade namnet
  console.log('Normaliserat namn:', normalized);
  
  return normalized;
}

// Funktion för att extrahera medelinkomst från kommundata
function extractMeanIncome(kommunIncome) {
  // Logga hela objektet för debugging
  console.log('Kommun income data structure:', JSON.stringify(kommunIncome, null, 2));
  
  // Utökad lista med möjliga fältnamn
  const possibleFields = [
    'medelInkomst2022',
    'medelInkomst2021',
    'medelInkomst2020',
    'medelInkomst2019',
    'medelInkomst2018',
    'meanIncome2022', 
    'meanIncome2021',
    'meanIncome2020',
    'meanIncome2019',
    'meanIncome2018',
    'medelinkomst',
    'inkomst',
    'income',
    'medelinkomst_2022',
    'medelinkomst_2021',
    'medel_inkomst',
    'snittinkomst'
  ];
  
  // Logga vilka fält som finns i objektet
  console.log('Tillgängliga fält i inkomstdata:', Object.keys(kommunIncome));
  
  for (const field of possibleFields) {
    if (kommunIncome[field] !== undefined && kommunIncome[field] !== null) {
      const value = parseInt(kommunIncome[field]);
      if (!isNaN(value)) {
        console.log(`Hittade inkomstdata i fält '${field}': ${value}`);
        return value;
      }
    }
  }
  
  console.log('Kunde inte hitta giltigt inkomstfält för kommun:', kommunIncome.kommun);
  return null;
}

// Funktion för att beräkna procentuell förändring
function calculatePercentageChange(value2018, value2022) {
  if (!value2018 || !value2022 || value2018 === 0) return null;
  return ((value2022 - value2018) / value2018 * 100);
}

// Huvudfunktion
async function main() {
  try {
    // Hämta grunddata
    const initialData = await fetchInitialData();
    if (!initialData) return;

    // Hämta partilista och skapa dropdown
    const parties = await fetchPartyList();
    if (parties.length === 0) {
      throw new Error('Kunde inte hämta partilista');
    }

    const selectedParty = addDropdown('Välj parti för analys:', parties);

    // Om ett parti är valt, gör analys
    if (selectedParty) {
      console.log('Analyserar parti:', selectedParty);

      // Hämta all inkomstdata för analys
      dbQuery.use('kommun-info-mongodb');
      let fullIncomeData = await dbQuery.collection('incomeByKommun').find({});
      console.log('Antal inkomstposter:', fullIncomeData.length);
      console.log('Exempel på inkomstdata struktur:', fullIncomeData[0]);
      
      // Hämta valresultat för valt parti
      dbQuery.use('riksdagsval-neo4j');
      let partyResults = await dbQuery(`
        MATCH (n:Partiresultat)
        WHERE n.parti = '${selectedParty}'
        RETURN n.kommun as kommun, 
               toInteger(n.roster2018) as roster2018,
               toInteger(n.roster2022) as roster2022
      `);
      console.log('Antal valresultat:', partyResults.length);
      console.log('Exempel på valresultat struktur:', partyResults[0]);

      if (!Array.isArray(partyResults) || partyResults.length === 0) {
        throw new Error('Inga valresultat hittades för det valda partiet');
      }

      // Skapa lookup för inkomstdata och logga innehållet
      const incomeLookup = new Map(
        fullIncomeData.map(data => {
          const normalizedName = normalizeKommunName(data.kommun);
          console.log(`Lägger till i lookup: ${data.kommun} -> ${normalizedName}`);
          return [normalizedName, data];
        })
      );
      console.log('Antal kommuner i lookup:', incomeLookup.size);

      // Kombinera och bearbeta data
      let analysisData = partyResults
        .map(result => {
          const normalizedKommun = normalizeKommunName(result.kommun);
          console.log(`Bearbetar kommun: ${result.kommun} (normaliserat: ${normalizedKommun})`);
          
          const kommunIncome = incomeLookup.get(normalizedKommun);
          
          if (!kommunIncome) {
            console.log(`FILTER 1: Ingen inkomstdata hittad för kommun: ${result.kommun} (${normalizedKommun})`);
            return null;
          }

          const total2018 = parseInt(result.roster2018) || 0;
          const total2022 = parseInt(result.roster2022) || 0;
          
          if (total2018 === 0 || total2022 === 0) {
            console.log(`FILTER 2: Ogiltiga röstantal för kommun: ${result.kommun}, 2018: ${total2018}, 2022: ${total2022}`);
            return null;
          }
          
          const change = calculatePercentageChange(total2018, total2022);
          if (change === null) {
            console.log(`FILTER 3: Kunde inte beräkna förändring för kommun: ${result.kommun}, 2018: ${total2018}, 2022: ${total2022}`);
            return null;
          }

          const meanIncome = extractMeanIncome(kommunIncome);
          if (meanIncome === null) {
            console.log(`FILTER 4: Ogiltig inkomstdata för kommun: ${result.kommun}, Data:`, kommunIncome);
            return null;
          }
          
          console.log(`GODKÄND: ${result.kommun} - Inkomst: ${meanIncome}, Förändring: ${change}%`);
    
    return {
      Kommun: result.kommun,
            'Medelinkomst (tkr)': meanIncome,
            'Förändring i röster (%)': parseFloat(change.toFixed(1)),
      'Röster 2018': total2018,
      'Röster 2022': total2022
    };
        })
        .filter(d => d !== null);

      console.log('Bearbetad analysdata:', analysisData);

  if (analysisData.length === 0) {
        throw new Error('Ingen data tillgänglig för analys efter filtrering');
  }

      // Beräkna korrelation
  let incomeValues = analysisData.map(d => d['Medelinkomst (tkr)']);
      let changeValues = analysisData.map(d => d['Förändring i röster (%)']);
      
      // Kontrollera att vi har giltiga värden för korrelation
      if (incomeValues.some(isNaN) || changeValues.some(isNaN)) {
        throw new Error('Ogiltiga värden för korrelationsberäkning');
      }
      
  let correlation = s.sampleCorrelation(incomeValues, changeValues);

      // Visa resultat
  addMdToPage(`
  ## Korrelationsanalys för ${selectedParty}
  Korrelationskoefficient mellan medelinkomst och röstförändring: **${correlation.toFixed(3)}**
  
  * En koefficient nära +1 indikerar stark positiv korrelation
  * En koefficient nära -1 indikerar stark negativ korrelation
  * En koefficient nära 0 indikerar svag eller ingen korrelation
  `);

      // Skapa scatter plot
  drawGoogleChart({
    type: 'ScatterChart',
        data: [
          ['Medelinkomst (tkr)', 'Förändring i röster (%)'],
          ...analysisData.map(d => [
            parseFloat(d['Medelinkomst (tkr)']),
            parseFloat(d['Förändring i röster (%)'])
          ])
        ],
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

      // Lägg till detaljerad datatabell
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
    }
} catch (error) {
    console.error('Fel vid analys:', error);
  addMdToPage(`
  ## Error
    Det uppstod ett fel vid analysen:
    \`\`\`
    ${error.message}
    \`\`\`
  `);
  }
}

// Kör huvudfunktionen
main(); 