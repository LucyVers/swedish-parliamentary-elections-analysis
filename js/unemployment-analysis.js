// Add title and description
addMdToPage(`
# Arbetslöshet och Valresultat
Denna analys undersöker sambandet mellan arbetslöshetsnivåer och förändringar i valresultat mellan 2018 och 2022.

## Översikt
Under perioden 2018-2022 såg vi betydande förändringar i arbetslösheten i Sveriges kommuner, med stora variationer mellan olika delar av landet. Den genomsnittliga arbetslösheten minskade från 3.12% till 2.76%, men denna förändring var inte jämnt fördelad.

### Nyckelobservationer:
- **Generell trend**: En övergripande minskning av arbetslösheten i de flesta kommuner
- **Geografiska skillnader**: Tydliga mönster mellan storstäder och mindre kommuner
- **Storstädernas utveckling**:
  * Stockholm: Ökning från 3.11% till 3.37%
  * Göteborg: Marginell ökning från 3.63% till 3.70%
  * Malmö: Betydande minskning från 6.54% till 5.76%

<div id="unemployment-comparison" style="width: 100%; min-height: 600px;"></div>

## Geografiska Mönster
Vi ser tydliga geografiska mönster i arbetslöshetens utveckling:

### Lägst arbetslöshet:
- **Stockholms välbärgade förorter** (Danderyd, Täby)
- **Västkustkommuner** (Tjörn, Kungsbacka)
- Dessa områden har generellt arbetslöshetsnivåer under 2%

### Högst arbetslöshet:
- **Vissa industrikommuner**
- **Kommuner med demografiska utmaningar**
- Flera av dessa kommuner har dock sett betydande förbättringar

<div id="unemployment-correlation" style="width: 100%; min-height: 500px;"></div>

## Samband med Valresultat
Korrelationsanalysen visar ett intressant mönster:

### Huvudsakliga Observationer:
1. **Moderat positiv korrelation** (R: 0.313) mellan förändring i arbetslöshet och valresultat
2. **Geografiska Skillnader**:
   - Storstadsregioner visar ett annat mönster än landsbygdskommuner
   - Industrikommuner uppvisar särskilt intressanta trender

### Anmärkningsvärda Exempel:
- **Upplands-Bro**: Största ökningen i arbetslöshet (+0.96%-enheter)
  * Visar hur en kommun i Stockholmsregionen kan avvika från det regionala mönstret
- **Lessebo**: Största minskningen (-2.28%-enheter)
  * Ett exempel på framgångsrik omställning i en mindre kommun

## Slutsatser
1. Det finns ett svagt men tydligt samband mellan arbetslöshetsförändringar och valresultat
2. Lokala faktorer spelar en betydande roll utöver arbetslöshetsstatistiken
3. Storstädernas utveckling skiljer sig markant från det nationella mönstret
`);

// Function to read unemployment data from CSV
async function getUnemploymentData() {
  try {
    const response = await fetch('/data/unemployment_data/unemployment_rates.csv');
    const data = await response.text();
    const lines = data.split('\n');
    
    // Skip header row and parse data
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const [kommun, kommunNorm, unemployed2018, unemployed2022, 
               population2018, population2022, rate2018, rate2022] = line.split(',');
        return {
          kommun: kommun.trim(),
          kommunNorm: kommunNorm.trim(),
          unemployed2018: parseInt(unemployed2018),
          unemployed2022: parseInt(unemployed2022),
          population2018: parseInt(population2018),
          population2022: parseInt(population2022),
          rate2018: parseFloat(rate2018),
          rate2022: parseFloat(rate2022),
          rateChange: parseFloat((parseFloat(rate2022) - parseFloat(rate2018)).toFixed(2))
        };
      });
  } catch (error) {
    console.error('Fel vid läsning av arbetslöshetsdata:', error);
    return [];
  }
}

// Function to get election data from Neo4j
async function getElectionData() {
  try {
    dbQuery.use('riksdagsval-neo4j');
    const query = `
      MATCH (n:Partiresultat)
      WITH n.kommun as kommun, 
           sum(n.roster2022) as total2022,
           sum(n.roster2018) as total2018
      RETURN kommun, total2022, total2018,
             (toFloat(total2022) - toFloat(total2018)) / toFloat(total2018) * 100 as changePercent
      ORDER BY kommun
    `;
    return await dbQuery(query);
  } catch (error) {
    console.error('Fel vid hämtning av valdata:', error);
    return [];
  }
}

// Function to create unemployment rate comparison chart
function createUnemploymentComparisonChart(data) {
  const chartData = new google.visualization.DataTable();
  chartData.addColumn('string', 'Kommun');
  chartData.addColumn('number', '2018');
  chartData.addColumn('number', '2022');
  chartData.addColumn({type: 'string', role: 'tooltip', p: {html: true}});

  data.forEach(row => {
    chartData.addRow([
      row.kommun,
      row.rate2018,
      row.rate2022,
      `<div style="padding:10px;">
        <b>${row.kommun}</b><br>
        2018: ${row.rate2018.toFixed(2)}%<br>
        2022: ${row.rate2022.toFixed(2)}%<br>
        Förändring: ${row.rateChange.toFixed(2)}%-enheter
       </div>`
    ]);
  });

  const options = {
    title: 'Arbetslöshet per kommun 2018-2022',
    height: 600,
    legend: { position: 'top' },
    hAxis: {
      title: 'Kommun',
      slantedText: true,
      slantedTextAngle: 45
    },
    vAxis: {
      title: 'Arbetslöshet (%)',
      minValue: 0,
      format: '#.##'
    },
    tooltip: { isHtml: true }
  };

  const chart = new google.visualization.ColumnChart(
    document.getElementById('unemployment-comparison')
  );
  chart.draw(chartData, options);
}

// Function to calculate correlation coefficient
function calculateCorrelation(data) {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  
  data.forEach(d => {
    sumX += d.x;
    sumY += d.y;
    sumXY += d.x * d.y;
    sumX2 += d.x * d.x;
    sumY2 += d.y * d.y;
  });
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return numerator / denominator;
}

// Function to create correlation scatter plot
function createCorrelationChart(unemploymentData, electionData) {
  const combinedData = unemploymentData.map(unemp => {
    const election = electionData.find(e => e.kommun === unemp.kommun);
    if (!election) return null;
    
    return {
      kommun: unemp.kommun,
      unemploymentChange: unemp.rateChange,
      electionChange: election.changePercent
    };
  }).filter(d => d !== null);

  const chartData = new google.visualization.DataTable();
  chartData.addColumn('number', 'Förändring i arbetslöshet (%-enheter)');
  chartData.addColumn('number', 'Förändring i valresultat (%-enheter)');
  chartData.addColumn({type: 'string', role: 'tooltip', p: {html: true}});

  combinedData.forEach(d => {
    chartData.addRow([
      d.unemploymentChange,
      d.electionChange,
      `<div style="padding:10px;">
        <b>${d.kommun}</b><br>
        Arbetslöshetsförändring: ${d.unemploymentChange.toFixed(2)}%-enheter<br>
        Valförändring: ${d.electionChange.toFixed(1)}%-enheter
       </div>`
    ]);
  });

  const options = {
    title: 'Korrelation: Förändring i arbetslöshet och valresultat',
    height: 500,
    hAxis: {
      title: 'Förändring i arbetslöshet 2018-2022 (%-enheter)',
      format: '#.##'
    },
    vAxis: {
      title: 'Förändring i valresultat 2018-2022 (%-enheter)',
      format: '#.##'
    },
    legend: 'none',
    tooltip: { isHtml: true },
    trendlines: { 
      0: {
        type: 'linear',
        color: 'red',
        lineWidth: 2,
        opacity: 0.3,
        showR2: true,
        visibleInLegend: true
      }
    }
  };

  const chart = new google.visualization.ScatterChart(
    document.getElementById('unemployment-correlation')
  );
  chart.draw(chartData, options);

  // Calculate and display correlation analysis
  const correlationData = combinedData.map(d => ({
    x: d.unemploymentChange,
    y: d.electionChange
  }));
  const correlation = calculateCorrelation(correlationData);
  
  // Add correlation analysis to the page
  addMdToPage(`
  ## Korrelationsanalys
  
  Korrelationskoefficient (R): ${correlation.toFixed(3)}
  
  ### Intressanta exempel:
  ${generateExampleAnalysis(combinedData)}
  `);
}

// Helper function to generate example analysis
function generateExampleAnalysis(data) {
  const sortedByUnemployment = [...data].sort((a, b) => b.unemploymentChange - a.unemploymentChange);
  const highest = sortedByUnemployment[0];
  const lowest = sortedByUnemployment[sortedByUnemployment.length - 1];
  
  return `
  * Största ökning i arbetslöshet: **${highest.kommun}** (${highest.unemploymentChange.toFixed(2)}%-enheter)
  * Största minskning i arbetslöshet: **${lowest.kommun}** (${lowest.unemploymentChange.toFixed(2)}%-enheter)
  `;
}

// Function to check normality of data
function checkNormality(data) {
  // Beräkna skewness (snedhet) för att se om datan är normalfördelad
  const n = data.length;
  const mean = data.reduce((a, b) => a + b) / n;
  
  // Beräkna tredje momentet (för skewness)
  const m3 = data.reduce((acc, x) => acc + Math.pow(x - mean, 3), 0) / n;
  const variance = data.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  const skewness = m3 / Math.pow(stdDev, 3);
  
  // En normalfördelad datamängd har skewness nära 0
  // Vi använder ±0.5 som gränsvärden för "acceptabel" normalfördelning
  return {
    isNormal: Math.abs(skewness) < 0.5,
    skewness: skewness,
    mean: mean,
    stdDev: stdDev
  };
}

// Function to create normality visualization
function createNormalityPlot(data, year) {
  // Skapa histogram för att visualisera fördelningen
  const chartData = new google.visualization.DataTable();
  chartData.addColumn('number', 'Arbetslöshet (%)');
  chartData.addColumn('number', 'Antal kommuner');
  
  // Skapa bins (grupper) för histogrammet
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binSize = (max - min) / 20; // 20 bins
  
  // Räkna frekvensen för varje bin
  const bins = new Array(20).fill(0);
  data.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), 19);
    bins[binIndex]++;
  });
  
  // Lägg till data i chartet
  for (let i = 0; i < 20; i++) {
    const binStart = min + (i * binSize);
    chartData.addRow([binStart, bins[i]]);
  }
  
  const options = {
    title: `Fördelning av arbetslöshet ${year}`,
    legend: { position: 'none' },
    histogram: { bucketSize: binSize },
    hAxis: { title: 'Arbetslöshet (%)' },
    vAxis: { title: 'Antal kommuner' }
  };
  
  const chart = new google.visualization.ColumnChart(
    document.getElementById(`normality-plot-${year}`)
  );
  chart.draw(chartData, options);
}

// Main function to run the analysis
async function runUnemploymentAnalysis() {
  try {
    // Load data
    const [unemploymentData, electionData] = await Promise.all([
      getUnemploymentData(),
      getElectionData()
    ]);

    // Initialize Google Charts with Swedish language
    google.charts.load('current', {
      'packages': ['corechart'],
      'language': 'sv'
    });

    // Wait for Google Charts to load before drawing
    google.charts.setOnLoadCallback(() => {
      // Skapa arrays med arbetslöshetsdata för varje år
      const rates2018 = unemploymentData.map(d => d.rate2018);
      const rates2022 = unemploymentData.map(d => d.rate2022);
      
      // Kontrollera normalfördelning
      const normality2018 = checkNormality(rates2018);
      const normality2022 = checkNormality(rates2022);
      
      // Skapa de ursprungliga visualiseringarna
      createUnemploymentComparisonChart(unemploymentData);
      createCorrelationChart(unemploymentData, electionData);

      // Lägg till normalfördelningsanalys i dokumentet
      addMdToPage(`
## Statistisk Analys av Fördelning

### Arbetslöshet 2018
- Medelvärde: ${normality2018.mean.toFixed(2)}%
- Standardavvikelse: ${normality2018.stdDev.toFixed(2)}
- Skewness: ${normality2018.skewness.toFixed(3)}
- Normalfördelad: ${normality2018.isNormal ? 'Ja' : 'Nej'}

<div id="normality-plot-2018" style="width: 100%; min-height: 400px;"></div>

### Arbetslöshet 2022
- Medelvärde: ${normality2022.mean.toFixed(2)}%
- Standardavvikelse: ${normality2022.stdDev.toFixed(2)}
- Skewness: ${normality2022.skewness.toFixed(3)}
- Normalfördelad: ${normality2022.isNormal ? 'Ja' : 'Nej'}

<div id="normality-plot-2022" style="width: 100%; min-height: 400px;"></div>
      `);
      
      // Skapa histogram efter att div-elementen har lagts till i DOM
      setTimeout(() => {
        createNormalityPlot(rates2018, '2018');
        createNormalityPlot(rates2022, '2022');
      }, 100);
    });

  } catch (error) {
    console.error('Fel vid analys av arbetslöshetsdata:', error);
    addMdToPage('⚠️ Ett fel uppstod vid analysen av arbetslöshetsdata.');
  }
}

// Run the analysis when the page loads
runUnemploymentAnalysis(); 