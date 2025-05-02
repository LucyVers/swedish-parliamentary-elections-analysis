# Swedish Parliamentary Elections Analysis

## Project Structure

```
.
├── course_materials/     # Material from the course
│   ├── assignments/      # Assignment descriptions
│   ├── templates/        # Course templates
│   └── resources/        # Other course resources
├── data/                 # Data files
├── docs/                 # Project documentation
├── notebooks/           # Jupyter notebooks
├── src/                 # Source code
└── tasks/               # Project tasks and TODOs
```

## Organization Principles

1. **Separation of Concerns**
   - Course materials are kept separate from project work
   - Clear distinction between external resources and our analysis

2. **Documentation First**
   - All work is documented as we go
   - Daily progress tracked in docs/PROGRESS.md
   - Tasks managed in tasks/TODO.md

3. **Methodical Approach**
   - Step-by-step implementation
   - Review existing structure before creating new content
   - Regular progress updates

## Getting Started

1. Review assignment in `course_materials/assignments/`
2. Check current tasks in `tasks/TODO.md`
3. Track progress in `docs/PROGRESS.md`

## Daily Workflow

1. Check PROGRESS.md for previous day's work
2. Review and update TODO.md
3. Document any new decisions or progress
4. Commit changes with descriptive messages

## Notes

- All documentation is in English
- Follow systematic and methodical approach
- Document all processes and decisions

## Project Overview
This repository contains statistical analysis and data visualization of Swedish electoral data, based on the template provided by our instructor (Version 7 of the statistics template).

## Getting Started
1. Clone this repository
2. Download Version 7 of the statistics template
3. Follow the task list in `tasks/TODO.md`

## Documentation
- All project documentation can be found in the `docs/` directory
- Progress tracking and task management in `tasks/TODO.md`
- Analysis methodology and findings will be documented in respective notebooks

## Project Status
Project is in initial setup phase. Currently working on:
- Setting up project structure
- Creating task documentation
- Downloading required templates and materials

## Language Note
All project documentation and code comments are maintained in English to ensure international accessibility.

## Project Changes and Configuration

### Database Connections (2024-03-XX)
- File rename and move:
  - Original file: `course_materials/templates/Konfig_fil_för_Statistic_template_V7.txt`
  - New name and location: `backend/config/database_connections.json`
  - Reason for rename: More descriptive name and correct file extension for JSON content
- The file contains connection information for:
  - SQLite (counties database)
  - MySQL (geographical data)
  - MongoDB (municipality information)
  - Neo4j (parliamentary election data)

### Template References
- Project is built on Statistics Template V8
- Original template documentation is in `README.md` in project root
- I maintain my project-specific documentation separately for clarity 