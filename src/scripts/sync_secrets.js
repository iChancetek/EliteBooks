const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs');
const path = require('path');

/**
 * EliteBooks — Secret Sync Utility
 * 
 * To run this:
 * 1. Ensure you have GOOGLE_APPLICATION_CREDENTIALS set or are logged in via gcloud.
 * 2. node src/scripts/sync_secrets.js
 */

const client = new SecretManagerServiceClient();

async function createAndAddSecret(projectId, secretId, payload) {
  const parent = `projects/${projectId}`;

  try {
    const [secret] = await client.getSecret({ name: `${parent}/secrets/${secretId}` }).catch(() => [null]);

    if (!secret) {
      console.log(`Creating secret: ${secretId}`);
      await client.createSecret({
        parent,
        secretId,
        secret: {
          replication: {
            automatic: {},
          },
        },
      });
    }

    console.log(`Adding version to: ${secretId}`);
    await client.addSecretVersion({
      parent: `${parent}/secrets/${secretId}`,
      payload: {
        data: Buffer.from(payload, 'utf8'),
      },
    });
    console.log(`Successfully added ${secretId}`);
  } catch (error) {
    console.error(`Error with ${secretId}:`, error.message);
  }
}

async function main() {
  const envPath = path.join(__dirname, '../../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found');
    return;
  }

  const [projectId] = await client.getProjectId().then(id => [id]).catch(() => ["elitebooks"]);

  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');

  for (const line of lines) {
    if (!line || line.trim().startsWith('#')) continue;
    const [key, ...valueParts] = line.split('=');
    let value = valueParts.join('=').trim();
    
    if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.substring(1, value.length - 1);
    if (key === 'FIREBASE_PRIVATE_KEY') value = value.replace(/\\n/g, '\n');

    if (key && value) {
      await createAndAddSecret(projectId, key, value);
    }
  }
}

main();
