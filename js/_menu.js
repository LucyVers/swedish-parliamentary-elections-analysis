createMenu('Förändringens geografi: Sverige 2018-2022', [
  { name: 'Hem', script: 'home.js' },
  { name: 'Valresultat', sub: [
    { name: 'Resultat 2022', script: 'election-2022.js' },
    { name: 'Jämförelse 2018-2022', script: 'election-comparison.js' }
  ]},
  { name: 'Inkomstanalys', script: 'income-correlation.js' },
  { name: 'Databasinspektör', script: 'db-inspector' }
]);