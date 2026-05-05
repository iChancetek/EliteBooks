/**
 * Debug RAG API
 */
async function testRAG() {
  const url = 'http://localhost:3000/api/chat/rag';
  const payload = {
    messages: [{ role: 'user', content: 'What is EliteBooks?' }]
  };

  try {
    console.log('Testing RAG API...');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Status: ${response.status}`);
      console.error(`Error: ${errorText}`);
    } else {
      const data = await response.json();
      console.log('Success:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

testRAG();
