# Swedish Parliamentary Elections Analysis 2018-2022

## Project Overview
This project analyzes and visualizes data from the Swedish parliamentary elections (2018 and 2022), focusing on voting behavior patterns and socio-economic correlations across Sweden's municipalities. The project is developed by Lucy Sonberg, building upon Statistics Template JS (STJS) v8 by NodeHill.

## Installation and Setup
To run the project:

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd swedish-parliamentary-elections-analysis
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. Open in your browser:
   ```
   http://localhost:3005
   ```

### Documentation Structure
- [CONCLUSIONS.md](./CONCLUSIONS.md): Final analysis and findings
- [PROGRESS.md](./PROGRESS.md): Development log and technical details
- [party_colors.md](./party_colors.md): Visualization standards
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md): Project structure documentation

## Key Findings
1. **Party Performance Changes**
   - Sverigedemokraterna: +4.4% average increase
   - Centerpartiet: -2.8% average decline
   - Moderaterna: ±0.0% stable results
   - Socialdemokraterna: +0.8% slight increase

2. **Income-Voting Correlations**
   - Socialdemokraterna: +0.606 (strong positive)
   - Vänsterpartiet: +0.244 (moderate positive)
   - Sverigedemokraterna: -0.239 (negative)

3. **Geographic Patterns**
   - Clear urban vs. rural voting differences
   - Distinct regional voting patterns
   - Significant municipality-level variations

## Technical Implementation

### Data Sources
Successfully integrated four databases:
- Neo4j: Election results
- MongoDB: Income statistics
- MySQL: Geographic data
- SQLite: County information

### Template Version (STJS v8)
This project uses Version 8 of Statistics Template JS, released April 24, 2025, which includes:
- Enhanced database connectivity
- Improved chart interactivity
- Robust error handling
- Full compatibility with Version 7 documentation

### Key Components
1. **Analysis Platform**
   - Interactive web interface
   - Multi-database integration
   - Visualization tools
   - Data validation system

2. **Visualization Features**
   - Standardized party color scheme
   - Interactive charts and maps
   - Municipality-level detailed views
   - Comparative analysis tools

## Project Status
✅ **Completed Successfully**
- All core objectives achieved
- Analysis findings documented
- Technical implementation stable
- Documentation comprehensive

## Copyright and Usage
This analysis and implementation is the individual work of Lucy Sonberg. While built upon Statistics Template JS (STJS) v8 by NodeHill, all analyses, conclusions, and enhanced implementations represent personal work and findings.

**Copyright Notice**: 
- This work is protected by copyright. No part of this project may be used, reproduced, or distributed without explicit permission from Lucy Sonberg.
- The underlying Statistics Template JS (STJS) has its own copyright © ironboy/NodeHill.

For detailed implementation progress, see [PROGRESS.md](./PROGRESS.md).
For complete analysis results, see [CONCLUSIONS.md](./CONCLUSIONS.md).

## Security Measures
To ensure database credentials are kept secure:

1. Database connection details are stored in `backend/config/database_connections.json`
2. This file is git-ignored to prevent sensitive data from being uploaded to GitHub
3. For new installations:
   - Copy `backend/config/database_connections.example.json` to `backend/config/database_connections.json`
   - Contact the project maintainer for actual database credentials
   - Replace the placeholder values in your local copy with the real credentials
4. Never commit database credentials or connection strings to version control

### Security Updates
- 2025-04-20: Removed sensitive database credentials from version control
- Created example configuration file with structure but no sensitive data
- Verified all database connections remain functional
- Created backup system for configuration files 