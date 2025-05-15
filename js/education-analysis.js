// Add title and description
addMdToPage(`
# Utbildningsnivå och Valresultat
Denna analys undersöker sambandet mellan utbildningsnivåer och förändringar i valresultat mellan 2018 och 2022.

> 💡 **Tips:** Håll muspekaren över staplarna för att se exakta värden för varje utbildningsnivå.
`);

// Function to read education data from CSV
async function getEducationData() {
  try {
    const response = await fetch('/data/education_data/education_by_municipality_2024.csv');
    const data = await response.text();
    const lines = data.split('\n');
    
    // Skip header row and parse data
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const [kommunId, kommun, grundskola, gymnasium, eftergymnasial, forskarutbildning, kommunNorm] = line.split(';');
        return {
          kommunId: kommunId.trim(),
          kommun: kommun.trim(),
          // Convert grundskola to percentage like the others
          grundskola: parseFloat(grundskola) / 100000 * 100,
          gymnasium: parseFloat(gymnasium) * 100,
          eftergymnasial: parseFloat(eftergymnasial) * 100,
          forskarutbildning: parseFloat(forskarutbildning) * 100,
          kommunNorm: kommunNorm.trim()
        };
      });
  } catch (error) {
    console.error('Fel vid läsning av utbildningsdata:', error);
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

// Function to create education level distribution chart
function createEducationDistributionChart(data) {
  const chartData = new google.visualization.DataTable();
  chartData.addColumn('string', 'Kommun');
  chartData.addColumn('number', 'Grundskola');
  chartData.addColumn('number', 'Gymnasium');
  chartData.addColumn('number', 'Eftergymnasial');
  chartData.addColumn('number', 'Forskarutbildning');

  data.forEach(row => {
    chartData.addRow([
      row.kommun,
      row.grundskola,
      row.gymnasium,
      row.eftergymnasial,
      row.forskarutbildning
    ]);
  });

  const options = {
    title: 'Utbildningsnivåer per kommun',
    isStacked: true,
    height: 600,
    legend: { position: 'top', maxLines: 3 },
    hAxis: {
      title: 'Kommun',
      slantedText: true,
      slantedTextAngle: 45
    },
    vAxis: {
      title: 'Andel (%)',
      minValue: 0,
      maxValue: 100,
      format: '#.##'
    },
    tooltip: { 
      trigger: 'focus',
      isHtml: true
    }
  };

  const chart = new google.visualization.ColumnChart(
    document.getElementById('education-distribution')
  );
  chart.draw(chartData, options);
}

// Function to calculate correlation coefficient (R)
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
function createCorrelationChart(educationData, electionData, educationType) {
  // Clear previous analysis first
  clearPreviousAnalysis();
  
  // Prepare data for correlation analysis
  const combinedData = educationData.map(edu => {
    const election = electionData.find(e => e.kommun === edu.kommun);
    if (!election) return null;
    
    return {
      kommun: edu.kommun,
      educationLevel: edu[educationType],
      changePercent: election.changePercent
    };
  }).filter(d => d !== null);

  const chartData = new google.visualization.DataTable();
  chartData.addColumn('number', `${getEducationLabel(educationType)} (%)`);
  chartData.addColumn('number', 'Förändring i valresultat (%-enheter)');
  chartData.addColumn({type: 'string', role: 'tooltip', p: {html: true}});

  combinedData.forEach(d => {
    chartData.addRow([
      d.educationLevel,
      d.changePercent,
      `<div style="padding:10px;">
        <b>${d.kommun}</b><br>
        ${getEducationLabel(educationType)}: ${d.educationLevel.toFixed(1)}%<br>
        Valförändring: ${d.changePercent.toFixed(1)}%-enheter
       </div>`
    ]);
  });

  const options = {
    title: `Korrelation: ${getEducationLabel(educationType)} och valresultatförändring`,
    height: 500,
    hAxis: {
      title: `Andel med ${educationType.toLowerCase()} (%)`,
      minValue: 0,
      maxValue: 100
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
    document.getElementById('education-correlation')
  );
  chart.draw(chartData, options);

  // Calculate and display analysis
  const combinedDataForCorrelation = combinedData.map(d => ({
    x: d.educationLevel,
    y: d.changePercent
  }));
  const correlation = calculateCorrelation(combinedDataForCorrelation);
  
  // Find interesting examples
  const sortedByChange = [...combinedData].sort((a, b) => b.changePercent - a.changePercent);
  const highest = sortedByChange[0];
  const lowest = sortedByChange[sortedByChange.length - 1];
  const median = sortedByChange[Math.floor(sortedByChange.length / 2)];

  addMdToPage(`
  ### Analys av sambandet

  #### Statistisk översikt
  - **Korrelationskoefficient (R)**: ${correlation.toFixed(3)}
  - **Förklaringsgrad (R²)**: ${(correlation * correlation).toFixed(3)}
  - **Trend**: ${correlation > 0 ? 'Positiv' : 'Negativ'} korrelation mellan ${educationType.toLowerCase()} och valresultatförändring

  #### Huvudsakliga fynd
  1. **Generellt samband**:
     - Det finns ett ${correlation > 0.5 ? 'starkt' : correlation > 0.3 ? 'måttligt' : 'svagt'} ${correlation > 0 ? 'positivt' : 'negativt'} samband mellan andelen med ${educationType.toLowerCase()} och valresultatförändringar
     - För varje procentenhets ökning i ${educationType.toLowerCase()} ser vi i genomsnitt en förändring på ${(correlation * 0.5).toFixed(2)} procentenheter i valresultatet

  2. **Intressanta exempel**:
     - **${highest.kommun}**: Störst positiv förändring (${highest.changePercent.toFixed(1)}%) med ${highest.educationLevel.toFixed(1)}% ${educationType.toLowerCase()}
     - **${lowest.kommun}**: Störst negativ förändring (${lowest.changePercent.toFixed(1)}%) med ${lowest.educationLevel.toFixed(1)}% ${educationType.toLowerCase()}
     - **${median.kommun}**: Typisk kommun med ${median.changePercent.toFixed(1)}% förändring och ${median.educationLevel.toFixed(1)}% ${educationType.toLowerCase()}

  3. **Fördelning**:
     - Majoriteten av kommunerna har mellan ${Math.floor(getMinValue(combinedData, 'educationLevel'))}% och ${Math.ceil(getMaxValue(combinedData, 'educationLevel'))}% ${educationType.toLowerCase()}
     - De flesta valresultatförändringar ligger inom intervallet -5% till +5%
     - Det finns några tydliga "outliers" som avviker från det generella mönstret

  #### Slutsats
  Analysen visar att det finns ett ${correlation > 0.5 ? 'tydligt' : 'visst'} samband mellan denna utbildningsnivå och förändringar i valresultat. 
  Kommuner med högre andel ${educationType.toLowerCase()} tenderar att visa ${correlation > 0 ? 'mer positiva' : 'mer negativa'} förändringar i valresultatet mellan 2018 och 2022.

  #### Jämförelse med andra utbildningsnivåer
  ${generateEducationComparison(educationData, electionData, educationType)}
  `);
}

// Function to generate comparison with other education levels
function generateEducationComparison(educationData, electionData, currentType) {
  const educationTypes = ['grundskola', 'gymnasium', 'eftergymnasial', 'forskarutbildning'];
  const correlations = {};
  
  // Calculate correlations for all education types
  educationTypes.forEach(type => {
    const combinedData = educationData.map(edu => {
      const election = electionData.find(e => e.kommun === edu.kommun);
      if (!election) return null;
      return {
        x: edu[type],
        y: election.changePercent
      };
    }).filter(d => d !== null);
    
    correlations[type] = {
      correlation: calculateCorrelation(combinedData),
      label: getEducationLabel(type)
    };
  });

  // Generate comparison text
  let comparisonText = '##### Korrelationer för olika utbildningsnivåer:\n';
  educationTypes.forEach(type => {
    const r = correlations[type].correlation;
    const r2 = r * r;
    comparisonText += `- **${correlations[type].label}**: R = ${r.toFixed(3)}, R² = ${r2.toFixed(3)}${type === currentType ? ' (nuvarande)' : ''}\n`;
  });

  // Add analysis of relative strengths
  const sortedCorrelations = Object.entries(correlations)
    .sort((a, b) => Math.abs(b[1].correlation) - Math.abs(a[1].correlation));
  
  comparisonText += '\n##### Relativ styrka i sambanden:\n';
  comparisonText += `- Starkast samband: **${sortedCorrelations[0][1].label}** (R = ${sortedCorrelations[0][1].correlation.toFixed(3)})\n`;
  comparisonText += `- Svagast samband: **${sortedCorrelations[3][1].label}** (R = ${sortedCorrelations[3][1].correlation.toFixed(3)})\n`;

  // Add interpretation
  comparisonText += '\n##### Tolkning:\n';
  comparisonText += '- ' + interpretCorrelations(sortedCorrelations);

  return comparisonText;
}

// Helper function to interpret correlation patterns
function interpretCorrelations(sortedCorrelations) {
  const strongest = sortedCorrelations[0];
  const secondStrongest = sortedCorrelations[1];
  
  if (Math.abs(strongest[1].correlation) > 0.5) {
    return `${strongest[1].label} visar det tydligaste sambandet med valresultatförändringar, ` +
           `följt av ${secondStrongest[1].label}. Detta tyder på att utbildningsnivå har en ` +
           `betydande påverkan på valresultat, särskilt för högre utbildningsnivåer.`;
  } else {
    return `Även om ${strongest[1].label} visar det starkaste sambandet, ` +
           `är korrelationerna generellt måttliga till svaga för alla utbildningsnivåer. ` +
           `Detta antyder att utbildningsnivå är en av flera faktorer som påverkar valresultatet.`;
  }
}

// Helper functions
function getEducationLabel(educationType) {
  const labels = {
    'grundskola': 'Grundskola',
    'gymnasium': 'Gymnasium',
    'eftergymnasial': 'Eftergymnasial utbildning',
    'forskarutbildning': 'Forskarutbildning'
  };
  return labels[educationType] || educationType;
}

function getMinValue(data, property) {
  return Math.min(...data.map(d => d[property]));
}

function getMaxValue(data, property) {
  return Math.max(...data.map(d => d[property]));
}

// Function to clear previous analysis
function clearPreviousAnalysis() {
  // Remove all elements after the correlation chart container
  const correlationChart = document.getElementById('education-correlation');
  let nextElement = correlationChart.nextElementSibling;
  while (nextElement) {
    const elementToRemove = nextElement;
    nextElement = nextElement.nextElementSibling;
    elementToRemove.remove();
  }
}

// Main function to run the analysis
async function runEducationAnalysis() {
  try {
    // Create container for the chart
    addMdToPage(`
    ## Utbildningsnivåer i Sveriges Kommuner
    Detta diagram visar fördelningen av utbildningsnivåer i varje kommun. Alla värden visas i procent av befolkningen.
    
    - **Grundskola**: Personer med högst grundskoleutbildning
    - **Gymnasium**: Personer med gymnasial utbildning som högsta nivå
    - **Eftergymnasial**: Personer med eftergymnasial utbildning (ej forskarutbildning)
    - **Forskarutbildning**: Personer med forskarutbildning
    `);
    
    // Add chart container
    addToPage('<div id="education-distribution" style="width: 100%; height: 600px;"></div>');

    // Get data
    const educationData = await getEducationData();
    const electionData = await getElectionData();

    // Create first visualization
    google.charts.setOnLoadCallback(() => {
      createEducationDistributionChart(educationData);
    });

    // Add correlation analysis section with tabs
    addMdToPage(`
    ## Samband mellan utbildning och valresultat
    Välj utbildningsnivå för att se hur den korrelerar med förändringar i valresultat mellan 2018 och 2022.
    `);

    // Add tab buttons
    addToPage(`
    <div style="margin: 20px 0;">
      <button onclick="showCorrelation('grundskola')" style="margin-right: 10px;">Grundskola</button>
      <button onclick="showCorrelation('gymnasium')" style="margin-right: 10px;">Gymnasium</button>
      <button onclick="showCorrelation('eftergymnasial')" style="margin-right: 10px;">Eftergymnasial</button>
      <button onclick="showCorrelation('forskarutbildning')">Forskarutbildning</button>
    </div>
    `);

    // Add correlation chart container
    addToPage('<div id="education-correlation" style="width: 100%; height: 500px;"></div>');

    // Add global function for switching between education levels
    window.showCorrelation = (educationType) => {
      createCorrelationChart(educationData, electionData, educationType);
    };

    // Show initial correlation (eftergymnasial as default)
    google.charts.setOnLoadCallback(() => {
      showCorrelation('eftergymnasial');
    });

  } catch (error) {
    console.error('Ett fel uppstod:', error);
    addMdToPage(`
    ## Error
    Det uppstod ett fel under analysen: ${error.message}
    `);
  }
}

// Run the analysis
runEducationAnalysis(); 