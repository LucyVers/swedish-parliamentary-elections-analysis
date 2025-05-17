createMenu('Förändringens geografi: Sverige 2018-2022', [
  { name: 'Hem', script: 'home.js' },
  { name: 'Valresultat', sub: [
    { name: 'Resultat 2022', script: 'election-2022.js' },
    { name: 'Jämförelse 2018-2022', script: 'election-comparison.js' }
  ]},
  { name: 'Inkomstanalys', script: 'income-correlation.js' },
  { name: 'Utbildningsanalys', script: 'education-analysis.js' },
  { name: 'Arbetslöshetsanalys', script: 'unemployment-analysis.js' },
  { name: 'Datakällor', script: 'data-sources.js' },
  { name: 'Databasinspektör', script: 'database-inspector.js' },
  { name: 'Kommunnamnsanalys', script: 'municipality-name-analysis.js' }
]);