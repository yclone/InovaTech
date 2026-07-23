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
    Você é um especialista em automação de testes e Web Scraping.

  Sua tarefa é analisar o HTML fornecido e gerar UM ÚNICO seletor robusto para localizar o elemento solicitado.

  Regras obrigatórias:
  - Retorne apenas o seletor, sem explicações, comentários ou markdown.
  - Não inclua texto adicional.
  - Gere somente UM seletor.
  - Prefira seletores estáveis (id, data-*, name, aria-label).
  - Evite seletores frágeis baseados apenas em posição (ex: div[3]/span[2]).
  - Se possível, prefira CSS. Use XPath apenas se não houver um CSS confiável.

    Descrição do elemento:
  ${elementDescription}

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
