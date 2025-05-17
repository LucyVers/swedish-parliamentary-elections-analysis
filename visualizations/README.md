# Visualizations for Swedish Parliamentary Elections Analysis

## Author and Copyright
This analysis and implementation is the individual work of Lucy Sonberg. The project is built upon and developed from version 8 of Statistics Template JS (STJS) by NodeHill. While the foundation comes from this template, all analyses, conclusions, and enhanced implementations represent my personal work and findings.

**Copyright Notices**: 
- This work and its unique implementations, analyses, and conclusions are protected by copyright. No part of this project may be used, reproduced, or distributed without explicit permission from Lucy Sonberg.
- The underlying Statistics Template JS (STJS) has its own copyright © ironboy/NodeHill. Please refer to the template's copyright notice in the original repository for usage terms and conditions of the base template.

This directory contains all visualizations for the Swedish Parliamentary Elections Analysis project.

## Directory Structure

```
visualizations/
├── county_analysis/        # County-level electoral analysis
│   └── county_detailed_*.png
├── education_analysis/     # Education level analysis
│   └── education_*.png
├── income_analysis/        # Income correlation analysis
│   └── income_correlation_*.png
├── screenshots/            # Application interface captures
│   └── screenshot_*.png
├── ui_elements/           # UI component images
│   └── ui_*_[YYMMDD].png
└── unemployment_analysis/ # Unemployment analysis
    └── unemployment_*.png
```

## File Naming Conventions

Each directory follows specific naming conventions:

1. County Analysis Files:
- Format: `county_[analysis_type]_[county_name]_[year].png`
- Example: `county_detailed_dalarna_2022.png`

2. Education Analysis Files:
- Format: `education_[type]_[detail].png`
- Example: `education_levels_overview.png`

3. Income Analysis Files:
- Format: `income_correlation_[party]_[year].png`
- Example: `income_correlation_social_democrats_2025.png`

4. Screenshot Files:
- Format: `screenshot_[content]_[detail].png`
- Example: `screenshot_analysis_overview.png`

5. UI Element Files:
- Format: `ui_[component]_[detail]_[YYMMDD].png`
- Example: `ui_navigation_menu_250415.png`

6. Unemployment Analysis Files:
- Format: `unemployment_[type]_[detail]_[year].png`
- Example: `unemployment_municipality_comparison_2018_2022.png`

## Image Format Guidelines

- Use PNG format for all visualizations
- Maintain reasonable file sizes through optimization
- Include date in filename for time-sensitive visualizations (YYMMDD format)
- Ensure consistent dimensions within each visualization type
- Follow color scheme defined in docs/party_colors.md

## Directory-Specific Documentation

Each subdirectory contains its own README.md with:
- Detailed description of visualizations
- Specific naming conventions
- Key findings and observations
- Statistical information where applicable

For detailed information about each analysis type, refer to the README.md files in the respective directories.

# Visualizations for Swedish Parliamentary Elections 2018-2022

This folder contains visualizations and images related to our analysis of the Swedish parliamentary elections 2018-2022.

## Folder Structure

- `screenshots/` - Screenshots of the interactive visualization
- `graphs/` - Static graphs and diagrams
  - `income-correlation/` - Visualizations of income correlation with voting changes
- `comparisons/` - Comparative images between election years 2018 and 2022
- `ui/` - User interface documentation

## Usage

To add new visualizations:
1. Choose appropriate subfolder based on content type
2. Use descriptive filenames (e.g., `blekinge-county-2022.png`)
3. Include date in filename if relevant (YYMMDD)

## Image Format

- Use PNG for screenshots and diagrams
- Use JPEG for photos
- Maintain reasonable file size (optimize large images)

## Naming Convention

Format: `[party/county]-[type]-[year].[format]`
Examples: 
- `stockholm-party-distribution-2022-230415.png`
- `left-party-income-correlation-2025.png`

## Income Correlation Visualizations

Visualizations showing the relationship between average income and voting changes:
- `vansterpartiet-income-correlation-2025.png` - Correlation: +0.244
- `miljopartiet-income-correlation-2025.png` - Correlation: -0.100
- `socialdemokraterna-income-correlation-2025.png` - Correlation: +0.606

These visualizations are located in `graphs/income-correlation/` and show:
- Scatter plots with average income on x-axis
- Vote change percentage on y-axis
- Trend line showing correlation
- Detailed data per municipality in table format 