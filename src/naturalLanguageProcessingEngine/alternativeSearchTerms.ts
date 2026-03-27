/**
 * Indian food spelling variant mappings for online search.
 * Maps Maharashtrian/Indian food names to alternative English spellings
 * so external APIs (USDA, CalorieNinjas) can find them.
 */

// Indian food specific search terms mapping
// This helps when searching for Maharashtrian foods with different spellings
export const getAlternativeSearchTerms = (query: string): string[] => {
  const mappings: { [key: string]: string[] } = {
    'bhakri': ['bhakri', 'bhakari', 'indian flatbread', 'jowar roti', 'bajra roti'],
    'chapati': ['chapati', 'roti', 'indian flatbread', 'wheat roti'],
    'pohe': ['poha', 'pohe', 'flattened rice', 'beaten rice'],
    'vada pav': ['vada pav', 'batata vada', 'potato fritter'],
    'misal': ['misal', 'misal pav', 'sprouted lentils curry'],
    'thalipeeth': ['thalipeeth', 'multigrain pancake'],
    'puran poli': ['puran poli', 'stuffed sweet bread', 'dal poli'],
    'shrikhand': ['shrikhand', 'sweet yogurt', 'hung curd dessert'],
    'modak': ['modak', 'sweet dumpling', 'coconut dumpling'],
    'sabudana': ['sabudana', 'sago', 'tapioca'],
    'usal': ['usal', 'sprouted beans curry', 'misal'],
    'amti': ['amti', 'dal curry', 'maharashtrian dal'],
    'bharli vangi': ['bharli vangi', 'stuffed eggplant', 'stuffed brinjal'],
    'zunka': ['zunka', 'gram flour curry', 'besan curry'],
    'pitla': ['pitla', 'gram flour gravy'],
    'kadhi': ['kadhi', 'yogurt curry', 'buttermilk curry'],
    'sol kadhi': ['sol kadhi', 'kokum curry', 'coconut kokum drink'],
    'bhaji': ['bhaji', 'sabzi', 'vegetable curry', 'indian vegetable'],
    'dal': ['dal', 'daal', 'lentils', 'pulses'],
    // Additional Indian foods
    'paratha': ['paratha', 'stuffed flatbread', 'indian bread'],
    'idli': ['idli', 'rice cake', 'steamed rice cake'],
    'dosa': ['dosa', 'indian crepe', 'rice crepe'],
    'upma': ['upma', 'semolina porridge', 'rava upma'],
    'puri': ['puri', 'poori', 'fried bread'],
    'khichdi': ['khichdi', 'kitchari', 'rice lentils'],
    'sambar': ['sambar', 'sambhar', 'lentil soup'],
    'rasam': ['rasam', 'indian soup'],
    'biryani': ['biryani', 'biriyani', 'indian rice'],
    'paneer': ['paneer', 'indian cheese', 'cottage cheese'],
    'raita': ['raita', 'yogurt salad'],
    'lassi': ['lassi', 'yogurt drink'],
    'gulab jamun': ['gulab jamun', 'indian sweet'],
    'jalebi': ['jalebi', 'indian sweet'],
    'halwa': ['halwa', 'halva', 'indian dessert'],
    'ladoo': ['ladoo', 'laddu', 'indian sweet ball'],
    'kheer': ['kheer', 'rice pudding', 'indian pudding'],
    'chutney': ['chutney', 'indian condiment'],
    'pickle': ['indian pickle', 'achar'],
    'papad': ['papad', 'papadum', 'indian cracker'],
  };

  const lowerQuery = query.toLowerCase();
  
  for (const [key, alternatives] of Object.entries(mappings)) {
    if (lowerQuery.includes(key)) {
      return alternatives;
    }
  }

  return [query];
};
