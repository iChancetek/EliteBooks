#!/bin/bash
# EliteBooks — Secret Manager Sync Script (Bash)
# Run this in your terminal with gcloud authenticated.
# Reads from your local .env.local file.

if [ ! -f .env.local ]; then
    echo ".env.local not found."
    exit 1
fi

while IFS='=' read -r key value || [ -n "$key" ]; do
    if [[ $key =~ ^#.* ]] || [ -z "$key" ]; then
        continue
    fi
    
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
    
    if [[ $key == *"PRIVATE_KEY"* ]]; then
        value=$(echo -e "$value")
    fi

    echo "Syncing secret: $key"
    
    gcloud secrets describe "$key" > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "Creating secret..."
        gcloud secrets create "$key" --replication-policy="automatic"
    fi
    
    echo "Adding version..."
    echo -n "$value" | gcloud secrets versions add "$key" --data-file=-

done < .env.local

echo "Sync complete!"
