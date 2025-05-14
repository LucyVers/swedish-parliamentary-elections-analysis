// Verktyg för att analysera och jämföra kommunnamn mellan olika datakällor
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sökvägar till data
const educationDataPath = path.join(__dirname, '../../data/education_data/education_by_municipality_2024.csv');

// Funktion för att läsa utbildningsdata från CSV
export async function getEducationMunicipalities() {
  try {
    const data = fs.readFileSync(educationDataPath, 'utf8');
    const lines = data.split('\\n');
    // Skippa header-raden och ta bara kommun och normaliserat namn
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const [_, kommun, __, ___, ____, _____, ______, _______, ________, _________, __________, kommunNormalized] = line.split(',');
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
export async function getElectionMunicipalities() {
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
      normalized: normalizeKommunName(r.kommun)
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
export async function analyzeMunicipalityNames() {
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
export async function generateReport(analysis) {
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
${onlyInEducation.map(name => `- ${name}`).join('\\n')}
` : ''}

${onlyInElection.length > 0 ? `
### Kommuner som endast finns i valdata:
${onlyInElection.map(name => `- ${name}`).join('\\n')}
` : ''}

${differentSpelling.length > 0 ? `
### Kommuner med olika stavning:
${differentSpelling.map(({ election, education }) => `- ${election} (val) vs ${education} (utbildning)`).join('\\n')}
` : ''}

### Slutsats
${onlyInEducation.length === 0 && onlyInElection.length === 0 && differentSpelling.length === 0
  ? '✅ Alla kommunnamn matchar perfekt mellan datakällorna!'
  : '⚠️ Det finns skillnader i kommunnamn mellan datakällorna som behöver åtgärdas.'}
`; 