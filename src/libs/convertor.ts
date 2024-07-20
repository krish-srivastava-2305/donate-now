import { createWorker } from "tesseract.js";

interface OCRResult {
  verified?: boolean;
  income?: number | null;
  certificateId?: string | null;
}

const convertor = async (imageUrl: string): Promise<OCRResult> => {
  const worker = await createWorker();
  const { data: { text } } = await worker.recognize(imageUrl);
  await worker.terminate();
  const words = text.split(/\s+/);
  let income: number | null = null;

  for (let i = 0; i < words.length; i++) {
    if (words[i].toLowerCase().includes('rs') || words[i].toLowerCase().includes('rupees')) {
      for (let j = i + 1; j < words.length; j++) {
        const num = words[j].replace(/,/g, '');
        if (!isNaN(Number(num))) {
          income = parseInt(num);
          break;
        }
      }
      break;
    }
  }
  

  return { verified: income !== null && income < 250000, income };
};

export default convertor;
