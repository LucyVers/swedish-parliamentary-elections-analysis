// Add title and description
addMdToPage(`
# Valförändringar 2018-2022

Denna sida analyserar förändringarna i valresultaten mellan riksdagsvalen 2018 och 2022. Vi undersöker hur stödet för olika partier har förändrats i Sveriges kommuner.
`);

// Define party configuration with correct order
const partyConfig = [
  ['Arbetarepartiet-Socialdemokraterna', '#E8112d'],
  ['Moderaterna', '#52BDEC'],
  ['Sverigedemokraterna', '#DDDD00'],
  ['Centerpartiet', '#009933'],
  ['Vänsterpartiet', '#DA291C'],
  ['Kristdemokraterna', '#000077'],
  ['Miljöpartiet de gröna', '#83CF39'],
  ['Liberalerna ', '#006AB3'],  // Note: includes trailing space to match database
  ['Övriga anmälda partier', '#999999']
].reduce((map, [key, value]) => map.set(key, value), new Map());

// Get county list for dropdown filter
dbQuery.use('counties-sqlite');
let countiesResult = await dbQuery('SELECT lan FROM countyInfo ORDER BY lan');
let counties = Array.isArray(countiesResult) ? countiesResult : [countiesResult];
let selectedCounty = addDropdown('Välj län:', 
  ['Alla län', ...counties.map(c => c.lan)], 
  'Alla län'
);

// Fetch election results
try {
  dbQuery.use('riksdagsval-neo4j');
  let query, params;
  
  if (selectedCounty === 'Alla län') {
    query = `
      MATCH (n:Partiresultat)
      RETURN n.kommun as kommun, 
             n.parti as parti, 
             toInteger(n.roster2018) as roster2018, 
             toInteger(n.roster2022) as roster2022
      ORDER BY n.kommun, n.parti
    `;
    params = {};
  } else {
    // Hämta kommuner direkt från Neo4j baserat på län
    dbQuery.use('geo-mysql');
    let countyName = selectedCounty.replace(' län', '');
    if (countyName.endsWith('s')) {
      countyName = countyName.slice(0, -1);
    }
    console.log('Processing county:', selectedCounty);
    console.log('County name after standardization:', countyName);

    // Hämta kommuner från Neo4j istället för MySQL
    dbQuery.use('riksdagsval-neo4j');
    
    // Först hämta alla kommuner för länet
    const kommunQuery = `
      MATCH (n:Partiresultat)
      WITH DISTINCT n.kommun as kommun
      ORDER BY kommun
      RETURN collect(kommun) as kommuner
    `;
    
    console.log('Fetching municipalities from Neo4j');
    const kommunResult = await dbQuery(kommunQuery);
    const allKommuner = kommunResult[0].kommuner;
    console.log('All municipalities from Neo4j:', allKommuner);
    
    // Hämta län-kommun-mappning från MySQL för att filtrera kommuner
    dbQuery.use('geo-mysql');
    const mysqlQuery = `SELECT DISTINCT municipality FROM geoData WHERE county = '${countyName}' ORDER BY municipality`;
    console.log('MySQL query for verification:', mysqlQuery);
    const mysqlKommuner = await dbQuery(mysqlQuery);
    console.log('MySQL municipalities:', mysqlKommuner);
    
    // Använd Neo4j för att hämta valdata för alla kommuner i länet
    dbQuery.use('riksdagsval-neo4j');
    const kommunList = mysqlKommuner.map(k => `"${k.municipality}"`).join(', ');
    query = `
      MATCH (n:Partiresultat)
      WHERE n.kommun IN [${kommunList}]
      RETURN n.kommun as kommun, 
             n.parti as parti, 
             toInteger(n.roster2018) as roster2018, 
             toInteger(n.roster2022) as roster2022
      ORDER BY n.kommun, n.parti
    `;
    params = {};
    
    console.log('Neo4j query:', query);
  }

  let results = await dbQuery(query, params);
  console.log('Query results:', results);

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error(`Inga valresultat hittades för ${selectedCounty}`);
  }

  // Process data for visualization
  let municipalities = [...new Set(results.map(r => r.kommun))].sort();
  let parties = Array.from(partyConfig.keys()); // Use ordered party list

  // Verify parties match configuration
  console.log('Partier från databasen:', parties);
  console.log('Konfigurerade partier:', Array.from(partyConfig.keys()));

  // Calculate changes for each municipality and party
  let changeData = municipalities.map(municipality => {
    let municipalityResults = results.filter(r => r.kommun === municipality);
    
    // Calculate total votes for percentage calculation
    let total2018 = municipalityResults.reduce((sum, r) => sum + (r.roster2018 || 0), 0);
    let total2022 = municipalityResults.reduce((sum, r) => sum + (r.roster2022 || 0), 0);
    
    // Validate vote totals
    if (total2018 === 0 || total2022 === 0) {
      console.log(`Varning: Saknade röster för ${municipality}`, { total2018, total2022 });
      return null;
    }

    // Validate that totals are reasonable (not too small)
    if (total2018 < 100 || total2022 < 100) {
      console.log(`Varning: Misstänkt lågt antal röster för ${municipality}`, { total2018, total2022 });
      return null;
    }
    
    let partyChanges = Object.fromEntries(parties.map(party => {
      let partyResult = municipalityResults.find(r => r.parti === party);
      if (!partyResult) {
        console.log(`Varning: Inga resultat för ${party} i ${municipality}`);
        return [party, 0];
      }
      
      // Validate individual party results
      if (partyResult.roster2018 < 0 || partyResult.roster2022 < 0) {
        console.log(`Varning: Negativa röster för ${party} i ${municipality}`, partyResult);
        return [party, 0];
      }
      
      let percent2018 = (partyResult.roster2018 / total2018) * 100;
      let percent2022 = (partyResult.roster2022 / total2022) * 100;
      
      // Validate percentages
      if (percent2018 > 100 || percent2022 > 100) {
        console.log(`Varning: Procenttal över 100% för ${party} i ${municipality}`, { percent2018, percent2022 });
        return [party, 0];
      }
      
      // Calculate change with proper rounding
      let change = Math.round((percent2022 - percent2018) * 100) / 100;
      
      return [party, change];
    }));

    // Validate total changes sum to approximately zero
    let totalChange = Object.values(partyChanges).reduce((sum, change) => sum + change, 0);
    if (Math.abs(totalChange) > 0.1) {
      console.log(`Varning: Total förändring är inte noll i ${municipality}`, { totalChange });
    }

    return {
      Municipality: municipality,
      ...partyChanges
    };
  }).filter(data => data !== null);

  if (changeData.length === 0) {
    throw new Error(`Ingen data tillgänglig för ${selectedCounty}`);
  }

  console.log('Processed change data:', changeData);

  // Add data verification table
  addMdToPage(`
  ## Data Verifiering
  Nedan visas den obearbetade datan innan den går in i diagrammet:
  `);
  
  // Add custom styling for the table
  addToPage(`
    <style>
      table td {
        text-align: right !important;
        padding: 6px 10px !important;
      }
      table td:first-child {
        text-align: left !important;
        font-weight: bold;
      }
      .positive {
        color: #2E8B57 !important;
      }
      .negative {
        color: #CD5C5C !important;
      }
      .zero {
        color: #808080 !important;
      }
      table th {
        background-color: #f8f9fa !important;
        padding: 8px 10px !important;
      }
    </style>
  `);
  
  // Format the data for display
  const formattedData = changeData.map(row => {
    const newRow = {};
    // Format municipality name
    newRow.Municipality = row.Municipality;
    
    // Format party values
    parties.forEach(party => {
      const value = row[party];
      // Handle special case for very small numbers
      if (Math.abs(value) < 0.05) {
        newRow[party] = '<span class="zero">0,0</span>';
      } else {
        const formattedValue = (value >= 0 ? '+' : '') + value.toFixed(1).replace('.', ',');
        const colorClass = value > 0 ? 'positive' : value < 0 ? 'negative' : 'zero';
        newRow[party] = `<span class="${colorClass}">${formattedValue}</span>`;
      }
    });
    return newRow;
  });

  // Create the table
  tableFromData({
    data: formattedData,
    fixedHeader: true,
    columnNames: [
      'Kommun',
      'S',
      'M',
      'SD',
      'C',
      'V',
      'KD',
      'MP',
      'L',
      'Övriga'
    ]
  });

  // Create chart data with correct party order
  let chartData = makeChartFriendly(
    changeData,
    'Kommun',
    ...parties.map(party => `${party} (%)`)
  );
  
  // Log the transformed data
  console.log('Data innan makeChartFriendly:', changeData);
  console.log('Data efter makeChartFriendly transformation:', chartData);
  console.log('Partier som används:', parties);
  
  // Add legend labels with party names and changes
  let legendLabels = parties.map(party => {
    let totalChange = changeData.reduce((sum, d) => sum + d[party], 0) / changeData.length;
    return `${party} (${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(1)}%)`;
  });

  // Draw change chart
  drawGoogleChart({
    type: 'BarChart',
    data: chartData,
    options: {
      title: `Förändring i partistöd 2018-2022 i ${selectedCounty} (procentenheter)`,
      height: Math.max(600, municipalities.length * 25),
      legend: { 
        position: 'top',
        maxLines: 3,
        alignment: 'center',
        textStyle: { fontSize: 11 }
      },
      hAxis: { 
        format: '+#.#;-#.#',
        title: 'Förändring i procentenheter',
        gridlines: { count: 10 },
        minValue: -10,
        maxValue: 10
      },
      chartArea: { 
        left: 200, 
        top: 120,
        right: 50,
        bottom: 50,
        width: '70%', 
        height: '85%' 
      },
      colors: parties.map(party => partyConfig.get(party)),
      bar: { groupWidth: '85%' },
      fontSize: 11,
      series: parties.reduce((obj, party, i) => {
        obj[i] = { labelInLegend: legendLabels[i] };
        return obj;
      }, {}),
      bars: 'horizontal',
      isStacked: false
    }
  });

  // Lägg till debug-information för diagramdata
  console.log('Diagram dimensioner:', {
    height: Math.max(600, municipalities.length * 25),
    chartArea: { 
      left: 200, 
      top: 120,
      width: '70%', 
      height: '85%' 
    }
  });
  console.log('Första raden i chartData:', chartData[0]);
  console.log('Andra raden i chartData:', chartData[1]);

  // Add table with changes
  addMdToPage(`
  ## Detaljerad förändring per kommun
  Positiva värden indikerar ökat stöd, negativa värden minskat stöd (i procentenheter)
  
  Genomsnittlig förändring per parti:
  ${legendLabels.map(label => `- ${label}`).join('\n')}
  `);

  tableFromData({
    data: changeData,
    fixedHeader: true,
    numberFormatOptions: {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      signDisplay: 'always'
    }
  });

} catch (error) {
  console.error('Error fetching election data:', error);
  addMdToPage(`
  ## Error
  Det gick inte att hämta valdata. Kontrollera databasanslutningen.
  Error: ${error.message}
  `);
}