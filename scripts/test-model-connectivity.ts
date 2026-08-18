import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

// Read .env.local manually
let apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  try {
    const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
    const match = envContent.match(/OPENAI_API_KEY=([^\r\n]+)/);
    if (match) {
      apiKey = match[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch (e) {
    console.error('Could not read .env.local:', e);
  }
}

console.log('OpenAI API Key present:', !!apiKey, apiKey ? `(${apiKey.substring(0, 10)}...)` : '');

const openai = new OpenAI({ apiKey: apiKey || 'sk-placeholder' });

async function testModel(modelName: string) {
  try {
    console.log(`\nTesting connection with model: ${modelName}...`);
    const res = await openai.chat.completions.create({
      model: modelName,
      messages: [{ role: 'user', content: 'Respond with OK if connected.' }],
      max_completion_tokens: 15,
    });
    console.log(`>>> SUCCESS [${modelName}]: ${res.choices[0]?.message?.content}`);
    return true;
  } catch (err: any) {
    console.log(`>>> FAILED [${modelName}]: status=${err.status} message=${err.message}`);
    return false;
  }
}

async function main() {
  await testModel('gpt-5.6-terra');
  await testModel('gpt-4o');
  await testModel('gpt-4o-mini');
}

main();
