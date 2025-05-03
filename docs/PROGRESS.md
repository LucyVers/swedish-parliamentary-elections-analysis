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

### 2025-03-21
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

### 2024-05-01
1. Visualization Improvements and Debugging
   
   a) Database Connection Issues (counties-sqlite):
   - Problem: Unable to fetch counties from database
   - Root Cause: Incorrect column name in SQL query ('name' instead of 'lan')
   - Solution: 
     * Verified database structure using `.schema countyInfo`
     * Updated SQL query to `SELECT lan as name FROM countyInfo ORDER BY lan`
     * Added improved error handling and logging
   - Result: Successfully retrieved all 21 counties

   b) Party Name Management:
   - Problem: Party names in database didn't match configuration
   - Solution:
     * Updated partyConfig with exact names from database
     * Added handling for special cases (e.g., trailing space in "Liberalerna ")
     * Included "Övriga anmälda partier" with grey color
   - Result: Correct matching between database and configuration

   c) Visualization Components:
   - Implemented county selection dropdown
   - Created bar chart for party distribution per municipality
   - Color-coded parties according to standard colors
   - Added responsive design for different screen sizes

2. Technical Improvements
   - Switched from object to Map for party configuration
   - Enhanced error handling in database queries
   - Implemented backup county list for database failures
   - Added detailed logging for debugging purposes

3. Next Steps
   - Consider adding comparison with 2018 election data
   - Possible implementation of interactive elements
   - Plan integration with income data from MongoDB 

### 2024-05-01
1. MySQL Database Structure Investigation
   
   a) Column Name Issue Resolution:
   - Problem: Error "Unknown column 'tatort' in 'field list'"
   - Investigation:
     * Direct database structure inspection revealed correct column names
     * Found that 'locality' is the correct column name, not 'tatort'
   - Database Structure Clarification:
     * id: Numeric identifier
     * county: County name
     * municipality: Municipality name
     * locality: Town/city name (previously incorrectly referenced as 'tatort')
     * latitude: Geographic latitude
     * longitude: Geographic longitude
     * position: Object containing x/y coordinates
   - Solution Options:
     * Option 1: Update queries to use 'locality' instead of 'tatort'
     * Option 2: Use SQL alias: SELECT locality AS tatort
   - Learning: Importance of verifying actual database structure before debugging application code

2. Next Steps
   - Update all existing queries using 'tatort' to use correct column name
   - Consider adding database structure documentation to prevent similar issues
   - Review other database queries for potential similar issues 

### 2024-05-03 (Update 2)
1. Database Integration Challenges Resolution

   a) MySQL and Neo4j Integration Issues:
   - Initial Problem: Unable to match counties between SQLite and MySQL databases
   - Root Cause Analysis:
     * Different naming conventions in databases:
       - SQLite format: "Stockholms län", "Västerbottens län"
       - MySQL format: "Stockholm", "Västerbotten"
     * Neo4j parameter passing issues with array parameters
   
   b) Solution Implementation:
   - County Name Standardization:
     * Added string manipulation to remove "län" suffix
     * Added logic to remove trailing "s" from county names
     * Example transformations:
       - "Stockholms län" -> "Stockholm"
       - "Västerbottens län" -> "Västerbotten"
       - "Dalarnas län" -> "Dalarna"

   c) Neo4j Query Optimization:
   - Original approach: Using parameterized query with $kommuner parameter
   - Problem: Parameter binding issues with Neo4j driver
   - Solution:
     * Switched to direct string interpolation in Cypher query
     * Built comma-separated list of quoted municipality names
     * Example:
       ```cypher
       MATCH (n:Partiresultat) 
       WHERE n.kommun IN ["Karlskrona", "Karlshamn", "Ronneby"] 
       RETURN n.kommun as kommun, n.parti as parti, n.roster2022 as roster2022
       ```

   d) Results and Verification:
   - Successfully retrieving municipality data for all counties
   - Correct mapping between MySQL geographic data and Neo4j election results
   - Example success case:
     * Blekinge län: Found 52 municipalities in MySQL
     * Successfully matched with Neo4j election data
     * Complete visualization of party distribution achieved

2. Learning Points
   - Importance of standardizing data formats across different databases
   - Need to handle database-specific query parameter requirements
   - Value of detailed logging for debugging database interactions
   - Benefits of step-by-step problem isolation and resolution

3. Next Steps
   - Consider creating a county name mapping table for future reference
   - Add data validation to ensure consistency across databases
   - Document database schemas and naming conventions
   - Consider implementing caching for frequently accessed data 

### 2024-05-01
1. Database Synchronization Issues and Resolution

   a) Problem: Missing Municipalities in Stockholm County
   - Initial implementation fetched municipalities from MySQL database
   - Only 21 out of 26 municipalities in Stockholm County were displayed
   - Missing municipalities: Salem, Solna, Sundbyberg, Järfälla, Tyresö
   - Root cause: MySQL database (geo-mysql) contained incomplete municipality data

   b) Database Analysis:
   - Neo4j database: Contained complete election data for all 290 municipalities
   - MySQL database: Missing several municipalities in geographic data
   - SQLite database: Correct county data for all 21 counties

   c) Solution Implementation:
   - Created special handling for Stockholm County
   - Hardcoded list of all 26 municipalities:
     ```javascript
     const stockholmKommuner = [
       'Botkyrka', 'Danderyd', 'Ekerö', 'Haninge', 'Huddinge',
       'Järfälla', 'Lidingö', 'Nacka', 'Norrtälje', 'Nykvarn',
       'Nynäshamn', 'Salem', 'Sigtuna', 'Sollentuna', 'Solna',
       'Stockholm', 'Sundbyberg', 'Södertälje', 'Tyresö', 'Täby',
       'Upplands Väsby', 'Upplands-Bro', 'Vallentuna', 'Vaxholm',
       'Värmdö', 'Österåker'
     ];
     ```
   - Maintained original MySQL-based logic for other counties
   - Enhanced error handling and logging

   d) Results:
   - Complete visualization of all 26 municipalities in Stockholm County
   - Accurate party distribution for each municipality
   - Improved code structure with clear separation between special cases and standard logic

   e) Key Learnings:
   - Importance of validating data sources against each other
   - Benefits of having redundant data across different databases
   - Need to document known data discrepancies
   - Value of detailed logging for debugging

2. Next Steps:
   - Implement comparison with 2018 election data
   - Add demographic information from MongoDB
   - Enhance visualization with interactive elements
   - Consider updating MySQL database with missing municipalities 

### 2024-05-04
1. Visualization Development Breakthrough

   a) Chart Rendering Issues Resolution:
   - Initial Problem: Charts not displaying despite correct data processing
   - Root Cause Analysis:
     * Conflicting configuration settings in Google Charts
     * Animation settings interfering with rendering
     * Dimension and margin issues
   
   b) Solution Implementation:
   - Removed conflicting orientation settings:
     * Eliminated conflict between 'bars: horizontal' and 'orientation: vertical'
     * Simplified chart configuration
   - Optimized chart dimensions:
     * Added explicit margins (right: 50, bottom: 50)
     * Improved spacing for municipality names
     * Adjusted bar width to 85% for better readability
   - Enhanced data visualization:
     * Centered zero-point for intuitive comparison
     * Consistent party color coding
     * Clear scale from -10 to +10 percentage points

   c) Visualization Benefits:
   1. Readability Improvements:
      * Clear municipality name display
      * Easy left-to-right value comparison
      * No text overlap issues
      * Accommodates all municipalities effectively

   2. Data Interpretation:
      * Intuitive positive/negative changes
      * Clear party performance comparison
      * Easy identification of trends
      * Effective color coding following party standards

   3. Analysis Capabilities:
      * Quick trend identification
      * Easy municipality comparison
      * Clear outlier detection
      * Geographical pattern analysis

   d) Key Findings Display:
   - Party Performance Trends:
     * Sverigedemokraterna: Generally positive changes (+4.4% avg)
     * Centerpartiet: Overall decline (-2.8% avg)
     * Moderaterna: Stable performance (-0.0%)
     * Socialdemokraterna: Slight increase (+0.8%)

   e) Technical Implementation:
   ```javascript
   drawGoogleChart({
     type: 'BarChart',
     options: {
       chartArea: { 
         left: 200, 
         top: 120,
         right: 50,
         bottom: 50,
         width: '70%', 
         height: '85%' 
       },
       bars: 'horizontal',
       isStacked: false
     }
   });
   ```

2. Next Steps:
   - Consider adding interactive features
   - Implement additional data filters
   - Add trend analysis tools
   - Enhance geographic visualization 