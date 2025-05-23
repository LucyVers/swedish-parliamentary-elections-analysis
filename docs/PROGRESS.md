# Project Progress Log

## Table of Contents
- [Project Overview](#project-overview)
- [Development Timeline](#development-timeline)
- [Technical Implementation](#technical-implementation)
- [Data Analysis Progress](#data-analysis-progress)
- [Challenges and Solutions](#challenges-and-solutions)
- [Documentation History](#documentation-history)

## Project Overview
### Project Identity
- **Author**: Lucy Sonberg
- **Base Template**: Statistics Template JS (STJS) v8 by NodeHill
- **Project Theme**: "Förändringens geografi: En analys av det politiska skiftet i Sverige 2018-2022"

### Project Structure
- Main components in dedicated directories:
  - `data/`: Election data and datasets
     - `docs/`: Project documentation
  - `notebooks/`: Analysis notebooks
     - `src/`: Source code
  - `tasks/`: Task management
  - `backend/`: Server and database configurations

### Project Goals
1. **Basic Analysis (G-krav)**:
   - Present clear visualization of 2022 election results
   - Show basic comparison with 2018 results
   - Investigate correlation between average income and voting patterns
   - Present findings in a clear, linear narrative

2. **Extended Analysis (VG-krav)**:
   - Investigate multiple demographic factors
   - Analyze complex relationships between variables
   - Study geographical patterns in political changes
   - Develop interactive visualizations

### Research Hypotheses
1. **Basic Hypothesis (G-krav)**:
   - "There is a correlation between average income and political change in municipalities"

2. **Extended Hypotheses (VG-krav)**:
   - "Municipalities with similar demographic profiles show similar voting pattern changes"
   - "Age structure influences political change"
   - "Geographically close municipalities tend to show similar changes"

## Development Timeline

### Phase 1: Setup and Planning (April 2025)
1. **Initial Setup** (2025-04-15)
   - Created project directory structure
   - Initialized documentation
   - Created task tracking system
   - Set up Git repository

2. **Component Integration** (2025-04-17)
   - Moved database configuration from template
   - Successfully tested server (localhost:3005)
   - Integrated Statistics Template JS v8

### Phase 2: Database Implementation (April 2025)
1. **Database Connections** (2025-04-20)
   - SQLite: County information verified
   - Neo4j: Election results 2018/2022 connected
   - MySQL: Geographic data integrated
   - MongoDB: SCB statistics linked

2. **Data Source Integration** (2025-04-22)
   - Election data from Valmyndigheten
   - Income statistics from SCB
   - Geographic data from Lantmäteriet
   - County information from verified sources
   - Education statistics from SCB (added 2025-05-10)

### Phase 3: Analysis Development (April-May 2025)
1. **Visualization Development** (2025-04-29)
   - Implemented county selection system
   - Created party distribution visualizations
   - Added responsive design features
   - Integrated interactive elements

2. **Data Analysis Implementation** (2025-05-03)
   - Income correlation analysis
   - Geographic pattern recognition
   - Municipality comparison tools
   - Trend analysis implementation

3. **Education Data Integration** (2025-05-04)
   - Added SCB education statistics for municipalities
   - Created education data converter (Excel to CSV)
   - Implemented municipality name normalization
   - Integrated with existing data sources

## Technical Implementation

### Database Architecture
1. **Multi-Database Integration**
   - SQLite (counties-sqlite):
     * County information from Wikipedia
     * Population, area, density data
     * Basic geographic information

   - Neo4j (riksdagsval-neo4j):
     * Election results 2018 and 2022
     * Party results by municipality
     * Vote counts and percentages

   - MySQL (geo-mysql):
     * Geographic data from Lantmäteriet
     * Municipality coordinates
     * Regional boundaries

   - MongoDB (kommun-info-mongodb):
     * SCB statistics collections:
       - incomeByKommun: 2018-2022 statistics
       - ageByKommun: Demographic data
     * Gender-specific information

### Visualization Components
1. **Chart Implementation**
   - Optimized dimensions and margins
   - Centered zero-point for comparisons
   - Party-specific color coding
   - Scale from -10 to +10 percentage points

2. **Interactive Features**
   - County selection dropdown
   - Municipality-level detailed views
   - Party distribution charts
   - Responsive design elements

### System Architecture
1. **Template Integration**
   - Database inspector implementation
   - Connection status monitoring
   - Data preview functionality
   - Error handling system

2. **Education Data Processing**
   - Implemented robust Excel to CSV converter
   - Enhanced municipality name normalization:
     * Consistent handling of special characters
     * Proper formatting of percentage values
     * Verified data integrity for all 290 municipalities
   - Data validation features:
     * Column count verification
     * Percentage sum validation (98-102% tolerance)
     * Unique municipality ID verification
     * Numeric format validation
   - Improved error handling and data cleaning:
     * UTF-8 encoding support
     * Special character removal
     * Consistent decimal formatting
     * Proper line ending handling

## Data Analysis Progress

### Electoral Changes Analysis
1. **Party Performance Trends**
   - Sverigedemokraterna: +4.4% average increase
   - Centerpartiet: -2.8% average decline
   - Moderaterna: ±0.0% stable results
   - Socialdemokraterna: +0.8% slight increase

2. **Geographic Patterns**
   - Municipality-level analysis
   - Regional trend identification
   - Urban vs. rural comparisons
   - County-specific patterns

### Income Correlation Findings
1. **Statistical Results**
   - Socialdemokraterna: +0.606 (strong positive)
   - Vänsterpartiet: +0.244 (moderate positive)
   - Sverigedemokraterna: -0.239 (negative)
   - Other parties: Varying correlations

2. **Analysis Components**
   - Scatter plots for income vs. vote change
   - Municipality data tables
   - Correlation coefficient displays
   - Statistical interpretation guides

### Education Level Analysis (2025-05-15)
1. **Correlation Analysis Implementation**
   - Interactive visualization system:
     * Stacked bar chart showing education distribution
     * Scatter plots for each education level
     * Dynamic correlation analysis
     * Responsive design with tabs

2. **Statistical Findings**
   - Eftergymnasial utbildning: R = 0.566 (strongest positive)
   - Gymnasium: R = 0.449 (moderate positive)
   - Forskarutbildning: R = -0.340 (moderate negative)
   - Grundskola: R = 0.072 (negligible correlation)

3. **Key Implementation Features**
   - Dynamic analysis updates:
     * Real-time correlation calculations
     * Automatic text generation
     * Municipality-specific examples
     * Comparative analysis between levels

4. **Technical Improvements**
   - Enhanced user interface:
     * Clear tab navigation
     * Intuitive data presentation
     * Efficient data clearing between views
     * Comprehensive statistical overview

5. **Notable Findings**
   - Strong correlation with higher education
   - Inverse relationship with research education
   - Minimal impact of primary education
   - Clear geographic patterns in education distribution

### Unemployment Analysis (2025-05-16)
1. **Data Processing Implementation**
   - Successfully processed unemployment data for all 290 municipalities:
     * Converted data from Excel to CSV format
     * Implemented unemployment rate calculator
     * Validated calculations and data integrity
     * Integrated with population data

2. **Statistical Findings**
   - Average unemployment rates:
     * 2018: 3.12% national average
     * 2022: 2.76% national average
     * Overall trend: 0.36 percentage point decrease

3. **Key Observations**
   - Geographic patterns:
     * Lower rates in Stockholm suburbs (Danderyd, Täby)
     * Lower rates in wealthy coastal areas (Tjörn, Kungsbacka)
     * Higher rates in some industrial municipalities
   
   - Notable changes 2018-2022:
     * Largest improvements:
       - Lessebo: -2.28 percentage points (7.22% to 4.94%)
       - Ronneby: -1.10 percentage points (5.92% to 4.82%)
     * Notable increases:
       - Upplands-Bro: +0.96 percentage points
       - Borlänge: +0.41 percentage points

   - Major cities trends:
     * Stockholm: 3.11% to 3.37% (increase)
     * Göteborg: 3.63% to 3.70% (slight increase)
     * Malmö: 6.54% to 5.76% (significant decrease)
     * Uppsala: 2.72% to 3.13% (increase)

4. **Data Quality Assurance**
   - Verified complete dataset for all 290 municipalities
   - Validated calculation methodology
   - Confirmed reasonable value ranges (1.16% to 7.22%)
   - Cross-referenced with official statistics

5. **Statistical Testing and Distribution Analysis** (Added 2025-05-16)
   - Normality Analysis:
     * 2018 data: Right-skewed distribution (skewness: 0.646)
     * 2022 data: Right-skewed distribution (skewness: 0.717)
     * Visual confirmation through histograms
   - T-test Findings:
     * Data does not follow normal distribution
     * Traditional t-test may not be optimal
   - Recommendations:
     * Consider Wilcoxon signed-rank test for future analysis
     * Data transformation could be explored if normal distribution is required
     * Document all statistical assumptions and limitations

## Challenges and Solutions

### Database Integration Issues
1. **County Name Standardization**
   - Problem: Different naming conventions across databases
   - Solution: 
     * Implemented string manipulation for consistency
     * Removed "län" suffix and trailing "s"
     * Created standardized naming system

2. **Missing Municipality Data**
   - Problem: Incomplete Stockholm County data (21/26 municipalities)
   - Solution:
     * Created comprehensive municipality list
     * Implemented special handling for Stockholm
     * Enhanced error handling system

3. **Municipality Name Standardization** (2025-05-12)
   - Problem: Mismatches between education data (CSV) and election data (Neo4j) for three municipalities:
     * Lilla Edet
     * Upplands Väsby
     * Östra Göinge
   - Solution:
     * Enhanced name normalization function to handle spaces consistently
     * Standardized special characters (å, ä, ö) across both data sources
     * Implemented pre-normalized names from CSV file as reference
     * Verified perfect match for all 290 municipalities
   - Validation:
     * Both data sources now show exactly 290 municipalities
     * Web interface confirms: "✅ Alla kommunnamn matchar perfekt mellan datakällorna!"
     * No remaining mismatches or spelling differences

### Visualization Challenges
1. **Chart Rendering Issues**
   - Problem: Display inconsistencies and conflicts
   - Solution:
     * Removed conflicting settings
     * Optimized chart dimensions
     * Improved data presentation
     * Enhanced error handling

2. **Data Matching Problems**
   - Problem: Income data-election results mismatch
   - Solution:
     * Updated field name references
     * Enhanced data filtering
     * Improved error reporting
     * Added comprehensive logging

## Documentation History
- April 2025: Initial setup and structure
- April 2025: Database integration documentation
- May 2025: Analysis implementation details
- May 2025: Final conclusions and findings

## Key Decisions
- Project Language: English for international accessibility
- Documentation: Markdown format for version control
- Database Config: Centralized in backend/config
- Error Handling: Comprehensive logging system

### Development Tools and Quality Control

To ensure data quality and facilitate development, I created two essential tools:

#### 1. Municipality Name Analyzer
This tool is critical for data quality and matching:
- **Purpose**: Ensures consistency of municipality names between education and election data
- **Features**:
  * Compares municipality names across data sources
  * Identifies spelling differences
  * Verifies presence of all 290 municipalities in both sources
- **Usage**:
  * Quality control during data import
  * Name matching troubleshooting
  * Verification after data updates

- **Reference Files**:
  * `education_kommun_names.txt` and `education_municipalities.txt`:
    - Serve as master reference files for municipality names
    - Contain both original and normalized versions of names
    - Used to verify correct name standardization
    - Critical for maintaining data integrity across different data sources
    - Essential for validating the 290 municipalities requirement
    - Help identify and resolve naming discrepancies

#### 2. Database Inspector
A tool for inspecting all data sources:
- **Purpose**: Provides overview of available data across all databases
- **Features**:
  * Displays SQLite data (county information)
  * Displays MySQL data (geographic information)
  * Displays MongoDB data (municipality and income data)
  * Displays Neo4j data (election results)
- **Usage**:
  * Quick overview of available data
  * Data structure verification
  * Database connection troubleshooting

These tools are essential for:
1. Data quality assurance
2. Development troubleshooting
3. Documentation for future developers
4. Verification during data updates

# Project Progress and Problem Resolution Log

## Population Data Processing (2024-03-XX)

### Data Source
- Downloaded "Folkmängden i Sveriges kommuner 1950–2024" from SCB
- File contains historical population data for all Swedish municipalities

### Implementation Steps
1. Created `population_data_converter.js` script to process the Excel file
2. Initial challenges:
   - Excel file structure had header information in first rows
   - Some rows contained comments rather than municipality data
   - Needed to ensure proper municipality name normalization

### Problems and Solutions

#### 1. Data Structure Issues
**Problem**: Excel file contained metadata and comments mixed with actual data
**Solution**: 
- Added logic to find the actual header row with "Kommun"
- Implemented filtering to skip comment rows
- Added validation to ensure only valid municipality data is processed

#### 2. Data Validation
**Problem**: Need to ensure data quality and completeness
**Solution**:
- Added population value validation (must be positive numbers)
- Added tracking of skipped/invalid rows
- Verified final count matches expected 290 municipalities
- Added statistical checks (average population calculations)

#### 3. Municipality Name Normalization
**Problem**: Needed consistent naming across datasets
**Solution**:
- Implemented normalizeKommunName function
- Handles special characters (å,ä,ö)
- Maintains both original and normalized names in output
- Consistent with existing name normalization approach

### Results
- Successfully processed population data for 2018 and 2022
- Output format: kommun,kommun_normalized,population_2018,population_2022
- Verified data quality:
  - Exactly 290 municipalities processed
  - Average population 2018: ~35,277
  - Average population 2022: ~36,281
  - All values are valid positive integers 