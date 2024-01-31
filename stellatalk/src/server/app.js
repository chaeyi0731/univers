const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000; // 포트 변경 가능
const { TranslationServiceClient } = require('@google-cloud/translate').v3;
const translationClient = new TranslationServiceClient();

async function translateText(text, targetLanguage) {
  const projectId = await translationClient.getProjectId(); // 프로젝트 ID를 자동으로 가져옵니다.

  const request = {
    parent: `projects/${projectId}/locations/global`,
    contents: [text],
    mimeType: 'text/plain',
    sourceLanguageCode: 'en',
    targetLanguageCode: targetLanguage,
  };

  try {
    const [response] = await translationClient.translateText(request);
    return response.translations[0].translatedText;
  } catch (error) {
    console.error(`Failed to translate text: ${error}`);
    return null;
  }
}

app.get('/universe', async (req, res) => {
  // 여기서는 예시로 고정된 텍스트를 번역하도록 설정했습니다.
  // 실제로는 NASA API로부터 데이터를 가져오는 로직이 필요합니다.
  const textToTranslate = 'This is an example text to translate.';
  const targetLanguage = 'ko'; // 한국어로 번역

  try {
    const translatedText = await translateText(textToTranslate, targetLanguage);
    res.send({ translatedText });
  } catch (error) {
    res.status(500).send(`Error during translation: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
