# Project Tasks

## 🔄 Active Tasks

### 1. Template and Configuration Setup (PRIORITY)
1. [ ] Statistics Template Integration
   - [x] Place "Konfig-fil för Statistic-template V7.pages" in course_materials/templates/
   - [x] Download Version 8 of statistics template
   - [x] Move and rename configuration file to backend/config/database_connections.json
   - [ ] Verify template version and bug fixes
     - [ ] Check Neo4j query functionality
     - [ ] Test chart interactivity
   - [x] Review template structure and components
   - [x] Plan integration with current project structure
   - [x] Integrate template into project root
   - [x] Test template functionality (verified localhost:3005 working)

2. [ ] Exercise Setup
   - [x] Download and place OVNING-MULTIDB-START.ZIP in course_materials/resources/
   - [x] Review exercise requirements
   - [x] Set up initial database connections

### 2. Database Configuration
1. [ ] Required Database Setup
   - [x] Configure SQLite for länsinfo data
   - [ ] Set up MongoDB for SCB statistics
   - [x] Document connection procedures in project documentation

2. [ ] Database Tools (As Needed)
   - [ ] Install necessary database management tools
   - [ ] Test connections with provided credentials
   - [ ] Document tool usage procedures

### 3. Project Structure Verification
1. [ ] Directory Structure
   - [x] Maintain course_materials/
     - [x] templates/ (for configuration and template files)
     - [x] resources/ (for exercise materials)
     - [x] assignments/ (for project requirements)
   - [ ] Verify src/ structure after template integration
   - [ ] Organize data/ directory for different data sources
   - [ ] Update documentation in docs/

### 4. Database Connection Verification
1. [ ] Test Database Access
   - [ ] Verify SQLite database access (Länsinfo)
   - [ ] Test MongoDB connection (SCB statistics)
   - [ ] Confirm access to election data
   - [ ] Check geodata accessibility

2. [ ] Data Verification
   - [ ] Confirm all required tables/collections are accessible
   - [ ] Verify data completeness
   - [ ] Document any missing or incomplete data
   - [ ] Create test queries for each database

### 5. Project Direction and Planning
1. [ ] Define Project Direction
   - [ ] Choose main research focus
   - [ ] Develop narrative structure
   - [ ] Formulate initial hypotheses about potential correlations
   - [ ] Document chosen direction in project documentation

### 6. Technical Setup
1. [ ] Website Structure
   - [ ] Design logical menu system
   - [ ] Plan page organization
   - [ ] Create initial page templates
   - [ ] Implement navigation system

2. [ ] Documentation setup
   - [ ] Create documentation structure
   - [ ] Set up progress tracking system
   - [ ] Document initial project goals and requirements

3. [ ] Data Source Review
   - [ ] Review "Using Data from Multiple Data Sources" exercise
   - [ ] Identify required data sources for election analysis
   - [ ] Document data requirements

### 7. Data Management
1. [ ] Core Data Sources Setup
   - [ ] SQLite Database (Länsinfo)
     - [ ] Verify data completeness
     - [ ] Document database structure
     - [ ] Create backup procedures
   
   - [ ] MongoDB Integration (SCB Statistics)
     - [ ] Set up MongoDB connection
     - [ ] Document connection process
     - [ ] Create data validation procedures
   
   - [ ] Election Data (val.se)
     - [ ] Import 2018 election data
     - [ ] Import 2022 election data
     - [ ] Create data comparison structure
   
   - [ ] Geodata Integration
     - [ ] Import geographical data
     - [ ] Verify data accuracy
     - [ ] Create visualization mappings

2. [ ] Database Tools Setup
   - [ ] Set up Neo4j Desktop for remote connections
   - [ ] Configure MongoDB Compass
   - [ ] Install and configure DBeaver Community
   - [ ] Document connection procedures for each tool

3. [ ] Data Documentation
   - [ ] Create source documentation page
     - [ ] Wikipedia (Länsinfo)
     - [ ] SCB (Demographics and income)
     - [ ] val.se (Election results)
     - [ ] Lantmäteriet (Geodata)
   - [ ] Document data quality assessment
   - [ ] Create data dictionary
   - [ ] Document data update procedures

### 8. Analysis and Visualization
1. [ ] Data Integration
   - [ ] Develop code to combine data from different sources
   - [ ] Create reusable data processing functions
   - [ ] Implement data validation checks
   - [ ] Document data joining methodology

2. [ ] Visualization Development
   - [ ] Set up Google Charts integration
   - [ ] Create initial chart templates
   - [ ] Develop narrative text to accompany visualizations
   - [ ] Implement responsive design for charts

3. [ ] Statistical Analysis
   - [ ] Define methodology for finding correlations
   - [ ] Implement trend analysis
   - [ ] Document all statistical methods used
   - [ ] Create process for validating findings

### 9. Technical Requirements
1. [ ] Security and Configuration
   - [ ] Ensure no database credentials are in repository
   - [ ] Set up proper environment variable handling
   - [ ] Document local setup requirements

2. [ ] Application Setup
   - [ ] Verify npm install process
   - [ ] Test npm start functionality
   - [ ] Document any additional setup steps
   - [ ] Create troubleshooting guide

## ✅ Completed Tasks
1. [x] Initial project setup
   - [x] Create Git repository
   - [x] Set up basic project structure
   - [x] Create project documentation structure
   - [x] Initialize README.md with project overview
   - [x] Set up .gitignore file
   - [x] Create organized folder structure for course materials
   - [x] Place configuration file in correct location

2. [x] Configuration Management
   - [x] Move database configuration to proper location
   - [x] Rename configuration file for clarity
   - [x] Document configuration changes in English
   - [x] Verify configuration file contents after move

3. [x] Exercise Materials Setup
   - [x] Download exercise files
   - [x] Place in correct directory (course_materials/resources/)
   - [x] Maintain separation between course materials and project code

## ⚠️ Blocked/Issues
- [ ] Need to analyze Version 7 template structure before integration
- [ ] Database connections pending template integration

## 📋 Backlog
1. [ ] Data Collection
   - [ ] Gather data from Swedish election 1
   - [ ] Gather data from Swedish election 2
   - [ ] Verify data quality and completeness

2. [ ] Analysis Planning
   - [ ] Define key metrics for analysis
   - [ ] Plan visualization approaches
   - [ ] Create analysis methodology

3. [ ] Implementation
   - [ ] Set up analysis environment
   - [ ] Create initial data processing scripts
   - [ ] Develop visualization templates

## 🌟 VG Requirements (Stretch Goals)
*These requirements will be addressed after completing core (G) requirements*

### 1. Enhanced Data Interaction
1. [ ] Interactive Data Filtering
   - [ ] Design user-friendly dropdown interfaces
   - [ ] Implement data filtering functionality
   - [ ] Create sorting mechanisms
   - [ ] Add real-time data updates

### 2. Extended Data Sources
1. [ ] Additional Data Integration
   - [ ] Research and identify second additional data source
   - [ ] Document selection criteria and relevance
   - [ ] Implement data import and processing
   - [ ] Integrate with existing data structure

### 3. Advanced Analysis
1. [ ] Causality Analysis
   - [ ] Identify potential causal relationships
   - [ ] Document analysis methodology
   - [ ] Implement statistical tests
   - [ ] Create visualization of causal relationships

2. [ ] Hypothesis Testing
   - [ ] Perform normality tests on data samples
   - [ ] Document any data adjustments (removal of outliers)
   - [ ] Implement two-point T-tests
   - [ ] Create clear visualization of test results
   - [ ] Write comprehensive analysis of findings

### 4. Narrative Quality
1. [ ] Enhanced Storytelling
   - [ ] Develop clear narrative thread throughout analysis
   - [ ] Create compelling data-driven story
   - [ ] Ensure logical flow between different sections
   - [ ] Add professional-quality explanatory text

2. [ ] Documentation Quality
   - [ ] Create detailed methodology documentation
   - [ ] Write comprehensive analysis explanations
   - [ ] Add executive summary
   - [ ] Include future research suggestions

## 📝 Notes
- Template Version 8 (April 24, 2025) is the latest version with important bug fixes
- Template V8 is functionally identical to V7 but includes fixes for:
  - Neo4j query functionality
  - Chart interactivity when adding content
- Keep configuration files separate from active development code
- Maintain clear separation between course materials and project code
- Document all integration steps for future reference

## 📅 Next Steps
1. Download and analyze Statistics Template V7
2. Plan template integration strategy
3. Begin step-by-step integration process
4. Set up database connections according to template requirements 