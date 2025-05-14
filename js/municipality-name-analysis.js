// Lägg till titel och beskrivning
addMdToPage(`
# Kommunnamnsanalys
Denna sida analyserar matchningen av kommunnamn mellan utbildningsdata och valdata.
`);

// Funktion för att läsa utbildningsdata från CSV
async function getEducationMunicipalities() {
  try {
    const response = await fetch('/data/education_data/education_by_municipality_2024.csv');
    const data = await response.text();
    const lines = data.split('\n');
    // Skippa header-raden och ta bara kommun och normaliserat namn
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const [kommunId, kommun, ...rest] = line.split(';');
        const kommunNormalized = rest[rest.length - 1];
        return {
          original: kommun.trim(),
          normalized: kommunNormalized.trim()
        };
      });
  } catch (error) {
    console.error('Fel vid läsning av CSV:', error);
    return [];
  }
}

// Funktion för att hämta kommuner från Neo4j
async function getElectionMunicipalities() {
  try {
    dbQuery.use('riksdagsval-neo4j');
    const query = `
      MATCH (n:Partiresultat)
      WITH DISTINCT n.kommun as kommun
      ORDER BY kommun
      RETURN kommun
    `;
    const result = await dbQuery(query);
    return result.map(r => ({
      original: r.kommun,
      normalized: r.kommun.toLowerCase()
        .replace(/å/g, 'a')
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z\s]/g, '')
        .trim()
    }));
  } catch (error) {
    console.error('Fel vid hämtning från Neo4j:', error);
    return [];
  }
}

// Hjälpfunktion för att normalisera kommunnamn
function normalizeKommunName(name) {
  return name.toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z]/g, '');
}

// Huvudfunktion för att analysera och jämföra kommunnamn
async function analyzeMunicipalityNames() {
  const electionMunicipalities = await getElectionMunicipalities();
  const educationMunicipalities = await getEducationMunicipalities();

  // Skapa uppslagstabeller för snabbare sökning
  const electionMap = new Map(
    electionMunicipalities.map(m => [m.normalized, m.original])
  );
  const educationMap = new Map(
    educationMunicipalities.map(m => [m.normalized, m.original])
  );

  // Hitta kommuner som bara finns i en av källorna
  const onlyInEducation = educationMunicipalities
    .filter(m => !electionMap.has(m.normalized))
    .map(m => m.original)
    .sort();

  const onlyInElection = electionMunicipalities
    .filter(m => !educationMap.has(m.normalized))
    .map(m => m.original)
    .sort();

  // Hitta kommuner med olika stavning
  const differentSpelling = [];
  for (const [normalized, electionName] of electionMap) {
    const educationName = educationMap.get(normalized);
    if (educationName && electionName !== educationName) {
      differentSpelling.push({
        election: electionName,
        education: educationName,
        normalized
      });
    }
  }

  return {
    educationCount: educationMunicipalities.length,
    electionCount: electionMunicipalities.length,
    onlyInEducation,
    onlyInElection,
    differentSpelling
  };
}

// Funktion för att generera en läsbar rapport
async function generateReport(analysis) {
  if (!analysis) {
    analysis = await analyzeMunicipalityNames();
  }

  const { educationCount, electionCount, onlyInEducation, onlyInElection, differentSpelling } = analysis;

  return `
### Sammanfattning
- Antal kommuner i utbildningsdata: ${educationCount}
- Antal kommuner i valdata: ${electionCount}

${onlyInEducation.length > 0 ? `
### Kommuner som endast finns i utbildningsdata:
${onlyInEducation.map(name => `- ${name}`).join('\n')}
` : ''}

${onlyInElection.length > 0 ? `
### Kommuner som endast finns i valdata:
${onlyInElection.map(name => `- ${name}`).join('\n')}
` : ''}

${differentSpelling.length > 0 ? `
### Kommuner med olika stavning:
${differentSpelling.map(({ election, education }) => `- ${election} (val) vs ${education} (utbildning)`).join('\n')}
` : ''}

### Slutsats
${onlyInEducation.length === 0 && onlyInElection.length === 0 && differentSpelling.length === 0
  ? '✅ Alla kommunnamn matchar perfekt mellan datakällorna!'
  : '⚠️ Det finns skillnader i kommunnamn mellan datakällorna som behöver åtgärdas.'}
`;
}

// Kör analysen
try {
  // Test 1: Läs utbildningsdata
  addMdToPage(`
  ## Test 1: Utbildningsdata
  `);
  const educationData = await getEducationMunicipalities();
  addMdToPage(`
  Hittade ${educationData.length} kommuner i utbildningsdata.
  
  ### Exempel på första 3 kommuner:
  `);
  tableFromData({
    data: educationData.slice(0, 3),
    columnNames: ['Originalnamn', 'Normaliserat namn']
  });

  // Test 2: Läs valdata
  addMdToPage(`
  ## Test 2: Valdata
  `);
  const electionData = await getElectionMunicipalities();
  addMdToPage(`
  Hittade ${electionData.length} kommuner i valdata.
  
  ### Exempel på första 3 kommuner:
  `);
  tableFromData({
    data: electionData.slice(0, 3),
    columnNames: ['Originalnamn', 'Normaliserat namn']
  });

  // Test 3: Kör fullständig analys
  addMdToPage(`
  ## Test 3: Fullständig analys
  `);
  const analysis = await analyzeMunicipalityNames();
  
  // Test 4: Generera rapport
  addMdToPage(`
  ## Test 4: Analysrapport
  `);
  const report = await generateReport(analysis);
  addMdToPage(report);

} catch (error) {
  console.error('Ett fel uppstod:', error);
  addMdToPage(`
  ## Error
  Det uppstod ett fel under analysen:
  \`\`\`
  ${error.message}
  \`\`\`
  `);
} 