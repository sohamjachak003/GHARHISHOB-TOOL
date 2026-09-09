// Hindi & Indian numeral/word to number parser
export function parseHindiAndEnglishVoiceInput(transcript: string): {
  amount: number | null;
  title: string;
  category: string;
} {
  const text = transcript.trim();
  if (!text) return { amount: null, title: '', category: 'Materials' };

  let detectedAmount: number | null = null;
  let cleanTitle = text;

  // 1. Check for standard digits (e.g. "500", "50000", "12500")
  const digitMatches = text.match(/(?:rs\.?|inr|₹|रुपये|रुपए|rupees|rupee)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:rs\.?|inr|₹|रुपये|रुपए|rupees|rupee|hazar|lakh|crore|हजार|हज़ार|लाख)?/i);
  
  // Hindi number words map
  const hindiWordsToNum: Record<string, number> = {
    'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5, 'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
    'ग्यारह': 11, 'बारह': 12, 'तेरह': 13, 'चौदह': 14, 'पंद्रह': 15, 'सोलह': 16, 'सत्रह': 17, 'अठारह': 18, 'उन्नीस': 19, 'बीस': 20,
    'पच्चीस': 25, 'तीस': 30, 'पैंतीस': 35, 'चालीस': 40, 'पैंतालीस': 45, 'पचास': 50, 'पचपन': 55, 'साठ': 60, 'पैंसठ': 65, 'सत्तर': 70, 'अस्सी': 80, 'नब्बे': 90,
    'सौ': 100, 'हजार': 1000, 'हज़ार': 1000, 'लाख': 100000, 'करोड़': 10000000,
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000, 'lakh': 100000, 'crore': 10000000, 'k': 1000
  };

  // Extract digits first
  if (digitMatches && digitMatches[1]) {
    const rawNum = parseFloat(digitMatches[1].replace(/,/g, ''));
    if (!isNaN(rawNum) && rawNum > 0) {
      const fullMatch = digitMatches[0].toLowerCase();
      if (fullMatch.includes('lakh') || fullMatch.includes('लाख')) {
        detectedAmount = rawNum * 100000;
      } else if (fullMatch.includes('hazar') || fullMatch.includes('हजार') || fullMatch.includes('हज़ार') || fullMatch.includes('k')) {
        detectedAmount = rawNum * 1000;
      } else if (fullMatch.includes('crore') || fullMatch.includes('करोड़')) {
        detectedAmount = rawNum * 10000000;
      } else {
        detectedAmount = rawNum;
      }
      // Remove the matched amount from title
      cleanTitle = text.replace(digitMatches[0], '').replace(/\s+/g, ' ').trim();
    }
  }

  // If no direct digits, check for Hindi words like "पांच सौ", "दो हजार", "पचास हजार"
  if (detectedAmount === null) {
    const words = text.toLowerCase().split(/\s+/);
    let currentVal = 0;
    let multiplier = 1;

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (hindiWordsToNum[w] !== undefined) {
        const n = hindiWordsToNum[w];
        if (n === 100) {
          currentVal = (currentVal === 0 ? 1 : currentVal) * 100;
        } else if (n === 1000 || n === 100000 || n === 10000000) {
          currentVal = (currentVal === 0 ? 1 : currentVal) * n;
          multiplier = 1;
        } else {
          currentVal += n;
        }
      }
    }

    if (currentVal > 0) {
      detectedAmount = currentVal;
      // Clean Hindi number words from title
      cleanTitle = text
        .split(/\s+/)
        .filter((w) => hindiWordsToNum[w.toLowerCase()] === undefined && !['रुपये', 'रुपए', 'rupees', 'rupee', 'rs'].includes(w.toLowerCase()))
        .join(' ')
        .trim();
    }
  }

  // Remove common filler words
  cleanTitle = cleanTitle
    .replace(/(?:रुपये|रुपए|rupees|rupee|rs\.?|inr|का|के|की|खर्चा|खर्च|दिया|दिए|आया|लाया|paid|for|gave)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If title became empty, use original or a sensible default
  if (!cleanTitle) {
    cleanTitle = text;
  }

  // Auto categorize based on keywords
  const lower = text.toLowerCase();
  let category = 'Materials';

  if (
    lower.includes('mistri') ||
    lower.includes('मिस्त्री') ||
    lower.includes('labour') ||
    lower.includes('मजदूर') ||
    lower.includes('मजदूरी') ||
    lower.includes('हाजिरी') ||
    lower.includes('hajiri') ||
    lower.includes('helper') ||
    lower.includes('दिहाड़ी')
  ) {
    category = 'Labour';
  } else if (
    lower.includes('tractor') ||
    lower.includes('ट्रैक्टर') ||
    lower.includes('गाड़ी') ||
    lower.includes('भाड़ा') ||
    lower.includes('bhada') ||
    lower.includes('truck') ||
    lower.includes('auto') ||
    lower.includes('dumper') ||
    lower.includes('डंपर')
  ) {
    category = 'Transport';
  } else if (
    lower.includes('plumber') ||
    lower.includes('प्लंबर') ||
    lower.includes('पाइप') ||
    lower.includes('नल') ||
    lower.includes('pipe') ||
    lower.includes('fitting')
  ) {
    category = 'Plumbing';
  } else if (
    lower.includes('electric') ||
    lower.includes('बिजली') ||
    lower.includes('तार') ||
    lower.includes('वायरिंग') ||
    lower.includes('switch') ||
    lower.includes('light')
  ) {
    category = 'Electrical';
  } else if (
    lower.includes('tile') ||
    lower.includes('टाइल्स') ||
    lower.includes('marble') ||
    lower.includes('मार्बल') ||
    lower.includes('granite')
  ) {
    category = 'Tiles';
  } else if (
    lower.includes('carpenter') ||
    lower.includes('बढ़ई') ||
    lower.includes('लकड़ी') ||
    lower.includes('ply') ||
    lower.includes('shuttering') ||
    lower.includes('gate') ||
    lower.includes('door')
  ) {
    category = 'Wood & Carpentry';
  } else if (
    lower.includes('paint') ||
    lower.includes('पेंट') ||
    lower.includes('पुट्टी') ||
    lower.includes('putty') ||
    lower.includes('color')
  ) {
    category = 'Painting';
  } else if (
    lower.includes('tea') ||
    lower.includes('चाय') ||
    lower.includes('नाश्ता') ||
    lower.includes('पानी') ||
    lower.includes('biscuit') ||
    lower.includes('food')
  ) {
    category = 'Home/Misc';
  } else if (
    lower.includes('cement') ||
    lower.includes('सीमेंट') ||
    lower.includes('steel') ||
    lower.includes('सरिया') ||
    lower.includes('sariya') ||
    lower.includes('brick') ||
    lower.includes('ईंट') ||
    lower.includes('int') ||
    lower.includes('sand') ||
    lower.includes('रेती') ||
    lower.includes('balu') ||
    lower.includes('gitti') ||
    lower.includes('गिट्टी')
  ) {
    category = 'Materials';
  }

  return {
    amount: detectedAmount,
    title: cleanTitle,
    category
  };
}
