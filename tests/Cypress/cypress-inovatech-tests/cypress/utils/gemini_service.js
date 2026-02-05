import {GoogleGenAI} from '@google/genai';

export async function getSelectorFromGemini(
  geminiApiKey,
  pageHtml,
  elementDescription
) {
  const GEMINI_API_KEY = geminiApiKey;

  const genAI = new GoogleGenAI({apiKey: GEMINI_API_KEY});
  if (!GEMINI_API_KEY) {
    console.error("Erro: A chave de API do Gemini não foi encontrada.");
    return null;
  }

  const prompt = `
    Analise este HTML e encontre um seletor CSS ou XPath robusto para o elemento.
    O elemento é ${elementDescription}.
    Retorne SOMENTE o seletor. Ex: #login-btn ou //button[text()='Entrar'].
    
    HTML:
    ${pageHtml}
  `;

  try {
    const result = await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
    const element = result.candidates[0].content.parts[0];
    const elementLocator = element.text;
    return elementLocator.trim();
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    return null;
  }
}
