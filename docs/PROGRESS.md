# Project Progress Log

## Setup Phase

### 2024-03-20
1. Initial Project Setup
   - Created project directory structure
   - Initialized documentation
   - Created TODO list and task tracking system
   - Set up project organization structure

2. Project Structure
   - Created the following directories:
     - `data/`: For storing election data and other datasets
     - `docs/`: Project documentation
     - `notebooks/`: Jupyter notebooks for analysis
     - `src/`: Source code
     - `tasks/`: Task management and TODO lists

3. Next Steps
   - Awaiting download of Version 7 statistics template
   - Need to review "Using Data from Multiple Data Sources" exercise
   - Will initialize Git repository after template review

### 2024-03-XX
1. Project Components Integration
   - Moved and renamed database configuration file:
     - From: `course_materials/templates/Konfig_fil_för_Statistic_template_V7.txt`
     - To: `backend/config/database_connections.json`
   - Successfully tested server (localhost:3005)

2. Project Structure Understanding
   The project consists of three main components that work together:

   a) Main Assignment (in `assignments/`)
   - Project goal: Create narrative about 2018/2022 parliamentary elections
   - Requirements: Use Statistics Template V8 and multiple data sources

   b) Exercise Materials (in `resources/`)
   - Contains "Using Data from Multiple Data Sources" exercise
   - Provides example code for database connections and queries
   - Serves as learning tool and template for our project

   c) Database Configuration
   - Linus's file provides access to all required databases:
     - SQLite: County information (Wikipedia)
     - MongoDB: SCB statistics (demographics/income)
     - MySQL: Geographic data (Lantmäteriet)
     - Neo4j: Election data (val.se)

### 2024-03-21
1. Database Connections Testing
   Successfully tested and verified access to all databases:

   a) SQLite Database (counties-sqlite):
   - Contains information about Swedish counties
   - Successfully queried county information
   - Data includes population, area, density, etc.

   b) Neo4j Database (riksdagsval-neo4j):
   - Contains election results for 2018 and 2022
   - Successfully queried party results by municipality
   - Data includes votes per party for each election year

   c) MySQL Database (geo-mysql):
   - Contains geographic data for Swedish localities
   - Successfully queried location data
   - Includes coordinates, municipality, and county information

   d) MongoDB Database (kommun-info-mongodb):
   - Contains SCB statistics
   - Successfully connected to both collections:
     * `incomeByKommun`: Income statistics 2018-2022 (mean and median)
     * `ageByKommun`: Age demographics 2018-2022
   - Data available per municipality and gender

2. Documentation Updates
   - Updated PROGRESS.md with database testing results
   - All database connections are now working
   - Ready to begin data analysis phase

3. Next Steps
   - Update TODO list with new tasks
   - Plan data analysis approach
   - Begin implementing analysis functions

## Decision Log
- Project language: English (for international accessibility)
- Documentation structure: Markdown files for easy version control
- Task management: Using categorized TODO list with status tracking
- Database configuration: Centralized in backend/config for better organization
- Project documentation: Maintaining clear connection between components 

## Project Direction and Research Focus

### Main Theme
"Förändringens geografi: En analys av det politiska skiftet i Sverige 2018-2022"

### Research Focus (G-krav)
1. Basic Analysis Goals:
   - Present clear visualization of 2022 election results
   - Show basic comparison with 2018 results
   - Investigate correlation between average income and voting patterns
   - Present findings in a clear, linear narrative

2. Data Sources for Basic Analysis:
   - Neo4j: Election results 2018/2022
   - MongoDB: Income data per municipality
   - MySQL: Basic geographic data for visualization

### Extended Analysis (VG-krav)
1. Advanced Analysis Goals:
   - Investigate multiple demographic factors
   - Analyze complex relationships between variables
   - Study geographical patterns in political changes
   - Develop interactive visualizations

2. Additional Data Integration:
   - Age demographics from MongoDB
   - Detailed geographic analysis
   - Multiple variable correlation studies

### Hypotheses
1. Basic Hypothesis (G-krav):
   - "There is a correlation between average income and political change in municipalities"

2. Extended Hypotheses (VG-krav):
   - "Municipalities with similar demographic profiles show similar voting pattern changes"
   - "Age structure influences political change"
   - "Geographically close municipalities tend to show similar changes"

### Presentation Plans
1. Basic Presentation (G-krav):
   - Simple, clear visualizations
   - Linear narrative structure
   - Basic statistical analysis
   - Clear conclusions

2. Advanced Presentation (VG-krav):
   - Interactive elements
   - Multiple perspective analysis
   - Advanced statistical methods
   - User-driven data exploration

This direction allows us to fulfill the basic requirements while providing clear paths for extension into VG-level analysis if time and resources permit. 