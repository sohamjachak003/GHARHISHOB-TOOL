/**
 * Formats a paisa integer into Indian Rupee formatted string
 * e.g., 84562000 paisa -> "Rs 8,45,620"
 */
export function formatCurrency(paisa: number, symbol: 'Rs' | '₹' = '₹'): string {
  if (paisa === undefined || paisa === null || isNaN(paisa)) {
    return `${symbol} 0`;
  }
  const isNegative = paisa < 0;
  const absPaisa = Math.abs(paisa);
  const rupees = Math.floor(absPaisa / 100);
  
  // Format into Indian Number System (e.g. 12,34,567)
  const rupeesStr = rupees.toString();
  let lastThree = rupeesStr.substring(rupeesStr.length - 3);
  const otherNumbers = rupeesStr.substring(0, rupeesStr.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  
  return `${isNegative ? '-' : ''}${symbol} ${formatted || '0'}`;
}

/**
 * Converts a rupee amount to simple Indian verbal representation (e.g., 1,50,000 -> 1.5 Lakh)
 */
export function formatRupeesInWords(rupees: number, lang: string = 'hi'): string {
  if (!rupees || isNaN(rupees) || rupees <= 0) return '';
  
  const isHi = lang === 'hi';
  if (rupees >= 10000000) {
    const cr = (rupees / 10000000).toFixed(2).replace(/\.00$/, '');
    return isHi ? `${cr} करोड़ रुपये` : `${cr} Crore Rupees`;
  }
  if (rupees >= 100000) {
    const lakh = (rupees / 100000).toFixed(2).replace(/\.00$/, '');
    return isHi ? `${lakh} लाख रुपये` : `${lakh} Lakh Rupees`;
  }
  if (rupees >= 1000) {
    const k = (rupees / 1000).toFixed(1).replace(/\.0$/, '');
    return isHi ? `${k} हज़ार रुपये` : `${k} Thousand Rupees`;
  }
  return isHi ? `${rupees} रुपये` : `${rupees} Rupees`;
}

export function parseRupeesToPaisa(rupees: number | string): number {
  if (typeof rupees === 'string') {
    rupees = parseFloat(rupees.replace(/,/g, '')) || 0;
  }
  return Math.round(rupees * 100);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getTodayDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCategoryBadge(category: string): { bg: string; text: string; icon: string } {
  const cat = (category || '').toLowerCase();
  if (cat.includes('material') || cat.includes('cement') || cat.includes('steel') || cat.includes('brick')) {
    return { bg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', text: 'text-blue-400', icon: '🧱' };
  }
  if (cat.includes('labour') || cat.includes('wage') || cat.includes('worker') || cat.includes('mason')) {
    return { bg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', text: 'text-purple-400', icon: '👷' };
  }
  if (cat.includes('transport') || cat.includes('freight') || cat.includes('truck') || cat.includes('unloading')) {
    return { bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', text: 'text-amber-400', icon: '🚚' };
  }
  if (cat.includes('tool') || cat.includes('equipment') || cat.includes('machine')) {
    return { bg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', text: 'text-rose-400', icon: '🔧' };
  }
  if (cat.includes('plumb') || cat.includes('sanit') || cat.includes('pipe')) {
    return { bg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20', text: 'text-cyan-400', icon: '🚰' };
  }
  if (cat.includes('elect') || cat.includes('wire') || cat.includes('light')) {
    return { bg: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20', text: 'text-yellow-400', icon: '⚡' };
  }
  if (cat.includes('tile') || cat.includes('floor') || cat.includes('granite')) {
    return { bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', text: 'text-emerald-400', icon: '◻️' };
  }
  if (cat.includes('wood') || cat.includes('carpenter') || cat.includes('door')) {
    return { bg: 'bg-orange-500/10 text-orange-400 border border-orange-500/20', text: 'text-orange-400', icon: '🚪' };
  }
  return { bg: 'bg-slate-500/10 text-slate-300 border border-slate-600/30', text: 'text-slate-300', icon: '📋' };
}
