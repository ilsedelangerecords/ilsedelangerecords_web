# Script to move all migration-related files to the migration repository

$webRepo = "c:\Users\gedegraa\Documents\GitHub\ilsedelangerecords_web"
$migrationRepo = "c:\Users\gedegraa\Documents\GitHub\migration"

Write-Host "Moving migration files from web repository to migration repository..."

# Create directory structure in migration repo
Write-Host "Creating directory structure..."
New-Item -Path "$migrationRepo\migration_scripts" -ItemType Directory -Force
New-Item -Path "$migrationRepo\migration_data" -ItemType Directory -Force
New-Item -Path "$migrationRepo\prisma\migrations" -ItemType Directory -Force
New-Item -Path "$migrationRepo\docs" -ItemType Directory -Force

# Move migration_scripts directory
Write-Host "Moving migration_scripts..."
Copy-Item -Path "$webRepo\migration_scripts\*" -Destination "$migrationRepo\migration_scripts\" -Recurse -Force

# Move migration_data directory
Write-Host "Moving migration_data..."
Copy-Item -Path "$webRepo\migration_data\*" -Destination "$migrationRepo\migration_data\" -Recurse -Force

# Move prisma migrations
Write-Host "Moving prisma migrations..."
Copy-Item -Path "$webRepo\prisma\migrations\*" -Destination "$migrationRepo\prisma\migrations\" -Recurse -Force

# Move migration documentation
Write-Host "Moving migration documentation..."
Copy-Item -Path "$webRepo\MIGRATION.md" -Destination "$migrationRepo\MIGRATION.md" -Force
Copy-Item -Path "$webRepo\MIGRATION_COMPLETE.md" -Destination "$migrationRepo\MIGRATION_COMPLETE.md" -Force

# Create a README for the migration repository
Write-Host "Creating README for migration repository..."
@"
# IlseDeLangeRecords Migration Repository

This repository contains all migration scripts and documentation used to migrate the IlseDeLangeRecords website from the old format to the new modern web application.

## Contents

- **migration_scripts/**: Python scripts used for data extraction, conversion, and migration
- **migration_data/**: Extracted content, reports, and validation data from the migration process
- **prisma/migrations/**: Database migration files for the Prisma ORM
- **docs/**: Additional migration documentation

## Migration Documentation

- [MIGRATION.md](MIGRATION.md): Main migration documentation and process overview
- [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md): Completion report and final status

## Scripts Overview

### Core Migration Scripts
- **complete_repository_migrator.py**: Main migration orchestrator
- **content_converter.py**: Converts old content format to new structure
- **content_parser.py**: Parses and extracts content from old website
- **github_migrator.py**: Handles GitHub repository migration
- **advanced_migrator.py**: Advanced migration features and optimizations

### Utility Scripts
- **cleanup_albums.py**: Cleans up album data inconsistencies
- **clone_and_extract.py**: Clones and extracts content from old repository
- **migration_tester.py**: Tests migration process and validates results
- **migration_validator.py**: Validates migrated content integrity

## Migration Data

The migration_data directory contains:
- **extracted_content/**: Raw extracted content (albums, lyrics, images)
- **reports/**: Migration reports and validation results
- **structure/**: Repository structure analysis and mapping

## Database Migrations

Prisma migration files for setting up the normalized database schema used by the new website.

## Usage

This repository is primarily for historical reference and documentation. The migration process has been completed and the website is now running on the new architecture.

For the live website, see: [ilsedelangerecords_web](https://github.com/ilsedelangerecords/ilsedelangerecords_web)
"@ | Out-File -FilePath "$migrationRepo\README.md" -Encoding UTF8

Write-Host "Migration files copied successfully!"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Navigate to the migration repository: cd $migrationRepo"
Write-Host "2. Add and commit the files: git add . && git commit -m 'Add migration scripts and documentation'"
Write-Host "3. Push to GitHub: git push"
Write-Host "4. Return to web repository and remove migration files"
