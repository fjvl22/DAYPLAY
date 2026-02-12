import Tesseract from 'tesseract.js';

export const extractCardData = async (frontBuffer, backBuffer) => {
  const resultFront = await Tesseract.recognize(frontBuffer, 'eng', { logger: m => console.log(m) });
  const resultBack = await Tesseract.recognize(backBuffer, 'eng', { logger: m => console.log(m) });

  const frontText = resultFront.data.text.replace(/\s+/g, '');
  const backText = resultBack.data.text.replace(/\s+/g, '');

  const cardNumberMatch = frontText.match(/\d{12,16}/);
  const expiryMatch = frontText.match(/(\d{2})\/(\d{2,4})/);

  return {
    last4: cardNumberMatch ? cardNumberMatch[0].slice(-4) : '0000',
    bin: cardNumberMatch ? cardNumberMatch[0].slice(0, 8) : '00000000',
    brand: frontText.includes('VISA') ? 'VISA' : frontText.includes('MASTERCARD') ? 'MASTERCARD' : 'UNKNOWN',
    expiryMonth: expiryMatch ? parseInt(expiryMatch[1]) : 1,
    expiryYear: expiryMatch ? parseInt(expiryMatch[2]) : 2030,
  };
};
