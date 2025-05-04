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