// Add title and description
addMdToPage(`
# Riksdagsvalet 2018-2022: Resultat och Analys

Denna sida presenterar en detaljerad analys av valresultaten från riksdagsvalen 2018 och 2022, med fokus på geografiska mönster och partiernas stöd i olika kommuner.

## Förklaring av visualiseringen
Diagrammet nedan visar hur rösterna fördelades mellan partierna i varje kommun. Varje rad representerar en kommun, och de färgade segmenten visar partiernas procentuella andel av rösterna i den kommunen.

Använd "Välj län" menyn för att fokusera på specifika regioner och undersöka lokala variationer i valresultaten.
`);

// Define party order and colors with exact names from database
const partyConfig = new Map([
  ['Arbetarepartiet-Socialdemokraterna', '#E8112d'],
  ['Moderaterna', '#52BDEC'],
  ['Sverigedemokraterna', '#DDDD00'],
  ['Centerpartiet', '#009933'],
  ['Vänsterpartiet', '#DA291C'],
  ['Kristdemokraterna', '#000077'],
  ['Miljöpartiet de gröna', '#83CF39'],
  ['Liberalerna ', '#006AB3'],  // Note: includes trailing space to match database
  ['Övriga anmälda partier', '#999999']  // Added with grey color
]);

// Add dropdown for county selection
addMdToPage(`
### Geografiskt filter
`);

try {
  // Get counties from SQLite database
  console.log('Ansluter till SQLite-databasen...');
  dbQuery.use('counties-sqlite');
  
  let countiesQuery;
  try {
    countiesQuery = await dbQuery('SELECT lan FROM countyInfo ORDER BY lan');
    console.log('Raw counties query result:', JSON.stringify(countiesQuery, null, 2));
    
    if (!Array.isArray(countiesQuery) || countiesQuery.length === 0) {
      throw new Error('Inga län hittades i databasen');
    }
    
    if (countiesQuery.length !== 21) {
      console.warn(`Varning: Hittade ${countiesQuery.length} län istället för förväntade 21`);
    }
    
  } catch (dbError) {
    console.error('Databasfel:', dbError);
    throw new Error(`Kunde inte hämta län från databasen: ${dbError.message}`);
  }
  
  let counties = ['Alla län'].concat(countiesQuery.map(county => county.lan));
  console.log('Tillgängliga län:', counties);
  
  let selectedCounty = addDropdown('Välj län för att se detaljerad statistik:', counties, 'Alla län');

  // Fetch election results from Neo4j
  console.log('Ansluter till Neo4j-databasen...');
  dbQuery.use('riksdagsval-neo4j');
  
  // First, let's inspect the database structure in detail
  try {
    console.log('Inspekterar databasstruktur...');
    
    // Get all properties from a node
    const propertiesQuery = `
      MATCH (n:Partiresultat) 
      WITH n LIMIT 1
      RETURN keys(n) as properties
    `;
    const properties = await dbQuery(propertiesQuery);
    console.log('Tillgängliga properties:', JSON.stringify(properties, null, 2));
    
    // Get unique kommuner and their vote counts
    const kommunQuery = `
      MATCH (n:Partiresultat)
      RETURN DISTINCT n.kommun as kommun, sum(n.roster2022) as total
      ORDER BY kommun
    `;
    const kommuner = await dbQuery(kommunQuery);
    console.log('Antal kommuner:', kommuner.length);
    
    // Get results based on selected county
    let query, params;
    if (selectedCounty === 'Alla län') {
      query = 'MATCH (n:Partiresultat) RETURN n.kommun as kommun, n.parti as parti, n.roster2022 as roster2022 ORDER BY n.kommun, n.parti';
      params = {};
    } else {
      // Hämta kommuner från Neo4j först för det valda länet
      dbQuery.use('riksdagsval-neo4j');
      
      // Specialhantering för Stockholms län för att inkludera alla 26 kommuner
      if (selectedCounty === 'Stockholms län') {
        const stockholmKommuner = [
          'Botkyrka', 'Danderyd', 'Ekerö', 'Haninge', 'Huddinge',
          'Järfälla', 'Lidingö', 'Nacka', 'Norrtälje', 'Nykvarn',
          'Nynäshamn', 'Salem', 'Sigtuna', 'Sollentuna', 'Solna',
          'Stockholm', 'Sundbyberg', 'Södertälje', 'Tyresö', 'Täby',
          'Upplands Väsby', 'Upplands-Bro', 'Vallentuna', 'Vaxholm',
          'Värmdö', 'Österåker'
        ];
        
        const kommunList = stockholmKommuner.map(k => `"${k}"`).join(', ');
        query = `MATCH (n:Partiresultat) WHERE n.kommun IN [${kommunList}] 
                RETURN n.kommun as kommun, n.parti as parti, n.roster2022 as roster2022 
                ORDER BY n.kommun, n.parti`;
      } else {
        // För övriga län, använd MySQL för att hämta kommuner
        dbQuery.use('geo-mysql');
        let countyName = selectedCounty.replace(' län', '');
        if (countyName.endsWith('s')) {
          countyName = countyName.slice(0, -1);
        }
        const kommunerILan = await dbQuery(`SELECT DISTINCT municipality as kommun FROM geoData WHERE county = '${countyName}' ORDER BY municipality`);
        console.log('Hittade kommuner i MySQL för', countyName + ':', kommunerILan);
        
        if (!kommunerILan || !Array.isArray(kommunerILan) || kommunerILan.length === 0) {
          console.error(`Inga kommuner hittades för ${selectedCounty} i MySQL-databasen`);
          throw new Error(`Kunde inte hitta kommuner för ${selectedCounty}`);
        }
        
        const kommunNames = kommunerILan.map(k => k.kommun);
        console.log('Antal kommuner att söka efter:', kommunNames.length);
        console.log('Kommuner att söka efter:', kommunNames.join(', '));
        
        // Hämta valresultat för dessa kommuner från Neo4j
        dbQuery.use('riksdagsval-neo4j');
        const kommunList = kommunNames.map(k => `"${k}"`).join(', ');
        query = `MATCH (n:Partiresultat) WHERE n.kommun IN [${kommunList}] 
                RETURN n.kommun as kommun, n.parti as parti, n.roster2022 as roster2022 
                ORDER BY n.kommun, n.parti`;
      }
      params = {};
    }
    
    console.log('Kör Neo4j-fråga:', query);
    console.log('Med parametrar:', params);
    
    let results = await dbQuery(query, params);
    console.log('Neo4j-svar:', results);
    
    if (!Array.isArray(results)) {
      console.error('Oväntat svarsformat från Neo4j:', results);
      throw new Error('Ogiltig datastruktur från databasen');
    }
    
    // Process data for visualization
    let municipalities = [...new Set(results.map(r => r.kommun))].sort();
    let parties = [...new Set(results.map(r => r.parti))].sort();

    // Verify all parties are present
    console.log('Partier från databasen:', parties);
    console.log('Konfigurerade partier:', Array.from(partyConfig.keys()));

    // Create data for chart
    let chartData = municipalities.map(municipality => {
      let municipalityResults = results.filter(r => r.kommun === municipality);
      let total = municipalityResults.reduce((sum, r) => sum + (r.roster2022 || 0), 0);
      
      if (total === 0) return null;

      let partyData = {};
      for (let party of parties) {
        let result = municipalityResults.find(r => r.parti === party);
        partyData[party] = result ? parseFloat((result.roster2022 / total * 100).toFixed(2)) : 0;
      }

      return {
        Municipality: municipality,
        ...partyData
      };
    }).filter(data => data !== null);

    if (chartData.length === 0) {
      throw new Error('Ingen data tillgänglig för det valda länet');
    }

    // Draw chart
    drawGoogleChart({
      type: 'BarChart',
      data: makeChartFriendly(
        chartData,
        'Kommun',
        ...parties.map(party => `${party} (%)`)
      ),
      options: {
        title: `Partifördelning per kommun i ${selectedCounty} (%)`,
        isStacked: true,
        height: Math.max(600, municipalities.length * 25),
        legend: { 
          position: 'top',
          maxLines: 3,
          alignment: 'center',
          textStyle: { fontSize: 11 }
        },
        hAxis: { 
          format: '#.#\'%\'',
          minValue: 0,
          maxValue: 100,
          gridlines: { count: 10 }
        },
        chartArea: { 
          left: 200, 
          top: 120,
          width: '70%', 
          height: '85%' 
        },
        colors: parties.map(party => partyConfig.get(party) || '#999999'),
        bar: { groupWidth: '90%' },
        fontSize: 11,
        pageSize: 50
      }
    });

    // Add table view
    addMdToPage(`
    ## Detaljerad data
    Nedan visas den exakta procentuella fördelningen för varje kommun.
    `);
    
    tableFromData({
      data: chartData,
      fixedHeader: true,
      numberFormatOptions: {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error(`Kunde inte hämta data för ${selectedCounty}: ${error.message}`);
  }

} catch (error) {
  console.error('Error fetching data:', error);
  addMdToPage(`
  ## Error
  Det gick inte att hämta data. Kontrollera databasanslutningen.
  Error: ${error.message}
  `);
} 