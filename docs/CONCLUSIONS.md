# Project Conclusions: Swedish Parliamentary Elections 2018-2022

## Author and Copyright
This analysis and implementation is the individual work of Lucy Sonberg. The project is built upon and developed from version 8 of Statistics Template JS (STJS) by NodeHill. While the foundation comes from this template, all analyses, conclusions, and enhanced implementations represent my personal work and findings.

**Copyright Notices**: 
- This work and its unique implementations, analyses, and conclusions are protected by copyright. No part of this project may be used, reproduced, or distributed without explicit permission from Lucy Sonberg.
- The underlying Statistics Template JS (STJS) has its own copyright © ironboy/NodeHill. Please refer to the template's copyright notice in the original repository for usage terms and conditions of the base template.

## Executive Summary
This analysis explores the political changes in Sweden between the 2018 and 2022 parliamentary elections, focusing on correlations between economic factors and voting patterns across municipalities.

## Key Findings

### 1. Electoral Changes 2018-2022
- **Major Shifts** ([detailed analysis](PROGRESS.md#2025-05-04)):
  * Sverige­demokraterna: Significant increase (+4.4% average)
  * Centerpartiet: Notable decline (-2.8% average)
  * Moderaterna: Stable results (±0.0%)
  * Social­demokraterna: Slight increase (+0.8%)

### 2. Income-Voting Correlations
- **Statistical Analysis** ([correlation details](PROGRESS.md#income-correlation-analysis-implementation)):
  * Strong positive correlation with Social­demokraterna (+0.606)
  * Moderate positive correlation with Vänster­partiet (+0.244)
  * Negative correlation with Sverige­demokraterna (-0.239)
  * Varying correlations across other parties

### 3. Geographic Patterns
- **Regional Variations** ([Stockholm analysis](PROGRESS.md#database-synchronization-issues-and-resolution)):
  * Distinct urban vs. rural voting patterns
  * Special analysis of Stockholm County (26 municipalities)
  * Complete coverage of all 290 Swedish municipalities
  * Regional clustering of political preferences

## Technical Achievements

### 1. Data Integration
- Successfully integrated four different databases:
  * Neo4j: Election results
  * MongoDB: Income statistics
  * MySQL: Geographic data
  * SQLite: County information
- Standardized naming conventions across databases
- Implemented robust error handling
- Created comprehensive data validation system

### 2. Visualization Development
- **Interactive Features** ([visualization details](PROGRESS.md#visualization-development-breakthrough)):
  * Responsive charts with optimal dimensions
  * Intuitive color coding for parties
  * Clear presentation of changes (-10 to +10 percentage points)
  * Municipality-level detailed views

### 3. Quality Assurance
- Comprehensive data validation
- Cross-database consistency checks
- Standardized municipality naming
- Detailed error logging and monitoring

## Methodology
- **Data Collection**:
  * Official election data from Valmyndigheten
  * Income statistics from SCB
  * Geographic data from Lantmäteriet
  * County information from verified sources

- **Analysis Approach**:
  * Statistical correlation analysis
  * Geographic pattern recognition
  * Time-series comparison (2018-2022)
  * Municipality-level detailed study

## Future Research Opportunities
1. **Extended Analysis**:
   - Age demographics correlation
   - Education level impact
   - Historical voting pattern analysis
   - Socioeconomic factor integration

2. **Technical Enhancements**:
   - Advanced visualization features
   - Real-time data updates
   - Additional demographic variables
   - Enhanced geographic analysis tools

## Data Quality Notes
- Complete dataset for all 290 municipalities
- Verified data consistency across sources
- Standardized data processing methodology
- Documented data limitations and assumptions

## References
- [Project Progress Log](PROGRESS.md)
- [Data Sources Documentation](../js/data-sources.js)
- [Visualization Guidelines](PROGRESS.md#visualization-development-breakthrough)
- [Database Integration Details](PROGRESS.md#database-integration-challenges-resolution) 