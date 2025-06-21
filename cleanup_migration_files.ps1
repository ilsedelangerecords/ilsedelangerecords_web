# Script to clean up migration files from the web repository

$webRepo = "c:\Users\gedegraa\Documents\GitHub\ilsedelangerecords_web"

Write-Host "Removing migration files from web repository..."

# Remove migration_scripts directory
if (Test-Path "$webRepo\migration_scripts") {
    Write-Host "Removing migration_scripts directory..."
    Remove-Item -Path "$webRepo\migration_scripts" -Recurse -Force
}

# Remove migration_data directory
if (Test-Path "$webRepo\migration_data") {
    Write-Host "Removing migration_data directory..."
    Remove-Item -Path "$webRepo\migration_data" -Recurse -Force
}

# Remove prisma migrations (but keep the schema file)
if (Test-Path "$webRepo\prisma\migrations") {
    Write-Host "Removing prisma migrations directory..."
    Remove-Item -Path "$webRepo\prisma\migrations" -Recurse -Force
}

# Remove migration documentation
if (Test-Path "$webRepo\MIGRATION.md") {
    Write-Host "Removing MIGRATION.md..."
    Remove-Item -Path "$webRepo\MIGRATION.md" -Force
}

if (Test-Path "$webRepo\MIGRATION_COMPLETE.md") {
    Write-Host "Removing MIGRATION_COMPLETE.md..."
    Remove-Item -Path "$webRepo\MIGRATION_COMPLETE.md" -Force
}

# Remove the migration scripts
if (Test-Path "$webRepo\move_migration_files.ps1") {
    Write-Host "Removing move_migration_files.ps1..."
    Remove-Item -Path "$webRepo\move_migration_files.ps1" -Force
}

Write-Host ""
Write-Host "Migration cleanup completed!"
Write-Host "All migration files have been moved to the separate migration repository:"
Write-Host "https://github.com/ilsedelangerecords/migration"
Write-Host ""
Write-Host "This repository is now website-only and contains:"
Write-Host "- React/Vite frontend application"
Write-Host "- Static site generation scripts"
Write-Host "- Content files (albums, lyrics, artists)"
Write-Host "- Deployment workflows"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Review the changes"
Write-Host "2. Commit the cleanup: git add . && git commit -m 'Remove migration files - moved to separate repo'"
Write-Host "3. Push changes: git push"
