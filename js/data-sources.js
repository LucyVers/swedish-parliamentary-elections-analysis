// Add title and data sources documentation
addMdToPage(`
# Datakällor och Datakvalitet

## Översikt
Detta projekt använder data från flera officiella svenska källor. Här beskriver vi varje datakälla, 
dess trovärdighet och kvalitet.

## Valmyndigheten - Valresultat 2018 och 2022
**Källa**: [val.se](https://www.val.se/valresultat/riksdag-region-och-kommun/2022/valresultat.html)

**Trovärdighet**: MYCKET HÖG
- Officiell statlig myndighet ansvarig för val
- Direkta primärdata från valprocessen
- Rigorös kvalitetskontroll och verifieringsprocess
- Transparent redovisning av alla resultat

**Datakvalitet**:
- Komplett dataset för alla 290 kommuner
- Exakta röstantal utan uppskattningar
- Konsistent format mellan valen
- Regelbunden uppdatering och verifiering

## Statistiska Centralbyrån (SCB) - Inkomststatistik
**Källa**: [SCB](https://www.scb.se/hitta-statistik/sverige-i-siffror/djupdykning-i-statistik-om-sveriges-kommuner)

**Trovärdighet**: MYCKET HÖG
- Officiell statlig statistikmyndighet
- Standardiserad datainsamlingsprocess
- Omfattande kvalitetskontroller
- Transparent metodologi

**Datakvalitet**:
- Årlig inkomstdata för alla kommuner
- Standardiserade mätmetoder
- Tydlig definition av inkomstmått
- Konsistent över tid

## Lantmäteriet - Geografisk Data
**Källa**: [Lantmäteriet](https://www.lantmateriet.se/sv/geodata/Geodataportalen)

**Trovärdighet**: HÖG
- Statlig myndighet för geografisk information
- Standardiserade kartläggningsmetoder
- Regelbunden uppdatering av data

**Datakvalitet**:
- Detaljerad geografisk information
- Uppdateras kontinuerligt
- Standardiserat koordinatsystem
- Omfattande metadata

## Databasstruktur och Integration

### Neo4j (riksdagsval-neo4j)
Innehåller valresultat med följande struktur:
`);

try {
  // Visa exempel på valdata
  dbQuery.use('riksdagsval-neo4j');
  let electionSample = await dbQuery('MATCH (n:Partiresultat) RETURN n.kommun as kommun, n.parti as parti, n.roster2018 as roster2018, n.roster2022 as roster2022 LIMIT 3');
  
  addMdToPage(`
#### Exempel på valdata:
  `);
  tableFromData({ 
    data: electionSample,
    fixedHeader: true
  });

  // Visa inkomstdata
  dbQuery.use('kommun-info-mongodb');
  let incomeSample = await dbQuery.collection('incomeByKommun').find({}).limit(3);
  
  addMdToPage(`
### MongoDB (kommun-info-mongodb)
Innehåller inkomststatistik med följande struktur:

#### Exempel på inkomstdata:
  `);
  tableFromData({ 
    data: incomeSample,
    fixedHeader: true
  });

  // Visa geografisk data
  dbQuery.use('geo-mysql');
  let geoSample = await dbQuery('SELECT municipality, county, latitude, longitude FROM geoData LIMIT 3');
  
  addMdToPage(`
### MySQL (geo-mysql)
Innehåller geografisk information med följande struktur:

#### Exempel på geografisk data:
  `);
  tableFromData({ 
    data: geoSample,
    fixedHeader: true
  });

} catch (error) {
  console.error('Error:', error);
  addMdToPage(`
  ## Error
  Det gick inte att hämta exempeldata: ${error.message}
  `);
}

addMdToPage(`
## Datakvalitetssäkring

### Verifieringsprocess
1. Kontroll av datakonsistens mellan källor
2. Validering av kommunnamn och matchning
3. Verifiering av numeriska värden
4. Hantering av saknade värden

### Kända Begränsningar
- Vissa mindre variationer i kommunnamn mellan källor
- Geografisk data kan ha mindre uppdateringsfrekvens
- Inkomstdata representerar årliga medelvärden

### Databehandling
- Standardisering av kommunnamn mellan källor
- Konsistent hantering av specialtecken
- Automatisk verifiering av dataintegritet
- Loggning av databearbetning
`); 