import TextRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';

export async function recognizeJapaneseText(imageUri: string): Promise<string> {
  const result = await TextRecognition.recognize(imageUri, TextRecognitionScript.JAPANESE);
  return result.text.trim();
}
