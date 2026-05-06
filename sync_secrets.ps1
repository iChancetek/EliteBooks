# EliteBooks — Secret Manager Sync Script
# Run this script in your local terminal with gcloud authenticated.
# It reads keys from your local .env.local file.

if (-not (Test-Path ".env.local")) {
    Write-Error ".env.local not found in the current directory."
    exit 1
}

$envContent = Get-Content ".env.local"
$secrets = @{}

foreach ($line in $envContent) {
    if ($line -match "^([^#\s][^=]*)=(.*)$") {
        $key = $matches[1].Trim()
        $val = $matches[2].Trim()
        
        if ($val -match "^['""].*['""]$") {
            $val = $val.Substring(1, $val.Length - 2)
        }
        
        if ($key -match "PRIVATE_KEY") {
            $val = $val.Replace("\n", "`n")
        }
        
        $secrets[$key] = $val
    }
}

foreach ($name in $secrets.Keys) {
    $val = $secrets[$name]
    if (-not $val) { continue }

    Write-Host "Syncing secret: $name"
    
    $exists = gcloud secrets list --filter="name ~ $name" --format="value(name)"
    
    if (-not $exists) {
        Write-Host "Creating secret..."
        gcloud secrets create $name --replication-policy="automatic"
    }
    
    Write-Host "Adding version..."
    echo "$val" | gcloud secrets versions add $name --data-file=-
}

Write-Host "Sync complete!"
