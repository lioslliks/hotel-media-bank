// lib/ai.ts
export async function analyzeImage(url: string, threshold: number = 0.25) {
  try {
    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, threshold }),
    });

    if (!response.ok) {
      throw new Error(`Error en análisis: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error al analizar imagen:', error);
    throw error;
  }
}