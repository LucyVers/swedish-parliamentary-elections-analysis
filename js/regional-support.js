// Add title and description
addMdToPage(`
# Regional Party Support Analysis
Analyzing how political party support varies across different regions of Sweden.

## Data Sources
- Election results 2018 and 2022 (by municipality)
- County information (for regional grouping)
`);

// Get county information first
try {
  dbQuery.use('counties-sqlite');
  let counties = await dbQuery('SELECT * FROM countyInfo');
  console.log('County data:', counties);

  addMdToPage(`
  ## County Information
  `);
  tableFromData({ 
    data: counties,
    columnNames: ['County', 'Population', 'Area (km²)', 'Density (pop/km²)']
  });
} catch (error) {
  console.error('Error fetching county data:', error);
  addMdToPage(`
  ## Error
  Failed to fetch county data. Please check database connection.
  `);
}

// Get election results
try {
  dbQuery.use('riksdagsval-neo4j');
  let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n LIMIT 25');
  console.log('Election results:', electionResults);

  if (electionResults && electionResults.length > 0) {
    addMdToPage(`
    ## Election Results by Municipality
    Showing first 25 municipalities as example
    `);
    tableFromData({
      data: electionResults.map(({ ids, kommun, roster2018, roster2022, parti }) => 
        ({ Municipality: kommun, Party: parti, 'Votes 2018': roster2018, 'Votes 2022': roster2022 }))
    });
  } else {
    addMdToPage(`
    ## No Election Results
    No election results were found in the database.
    `);
  }
} catch (error) {
  console.error('Error fetching election results:', error);
  addMdToPage(`
  ## Error
  Failed to fetch election results. Please check database connection.
  Error: ${error.message}
  `);
} 