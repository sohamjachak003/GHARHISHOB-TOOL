import React, { useState, useEffect } from 'react';
import { Expense } from '../types';
import { parseRupeesToPaisa, getTodayDate, formatRupeesInWords } from '../utils/format';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { parseHindiAndEnglishVoiceInput } from '../utils/voiceParser';
import { Mic, MicOff, Plus, Check, Sparkles, AlertCircle } from 'lucide-react';

interface QuickAddInHandBarProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  lang: 'hi' | 'en';
}

const CATEGORY_PRESETS = [
  { name: 'Materials', labelHi: '🧱 सामान/सीमेंट', icon: '🧱' },
  { name: 'Labour', labelHi: '👷 मजदूर/मिस्त्री', icon: '👷' },
  { name: 'Transport', labelHi: '🚚 भाड़ा/ट्रैक्टर', icon: '🚚' },
  { name: 'Home/Misc', labelHi: '☕ चाय/नाश्ता', icon: '☕' },
  { name: 'Plumbing', labelHi: '🚰 प्लंबिंग', icon: '🚰' },
  { name: 'Electrical', labelHi: '⚡ बिजली/तार', icon: '⚡' },
];

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000, 50000];

export const QuickAddInHandBar: React.FC<QuickAddInHandBarProps> = ({
  onAddExpense,
  lang = 'hi',
}) => {
  const [amountRupees, setAmountRupees] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Materials');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer'>('Cash');
  const [date, setDate] = useState(getTodayDate());
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const { isListening, transcript, isSupported, error, startListening, stopListening, setTranscript } =
    useVoiceRecognition(lang);

  // When voice recognition produces transcript, parse it!
  useEffect(() => {
    if (transcript) {
      const parsed = parseHindiAndEnglishVoiceInput(transcript);
      if (parsed.amount && parsed.amount > 0) {
        setAmountRupees(parsed.amount.toString());
      }
      if (parsed.title) {
        setTitle(parsed.title);
      }
      if (parsed.category) {
        setCategory(parsed.category);
      }
      setVoiceNotice(
        lang === 'hi'
          ? `🎙️ सुना: "${transcript}"`
          : `🎙️ Heard: "${transcript}"`
      );
    }
  }, [transcript, lang]);

  const numericAmount = parseFloat(amountRupees.replace(/,/g, '')) || 0;

  const handleQuickAmount = (val: number) => {
    const curr = parseFloat(amountRupees.replace(/,/g, '')) || 0;
    setAmountRupees((curr + val).toString());
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || numericAmount <= 0) return;

    const paisa = parseRupeesToPaisa(numericAmount);

    onAddExpense({
      title: title.trim(),
      category,
      expense_type: 'construction',
      amount: paisa,
      date,
      payment_mode: paymentMode,
      notes: 'Direct In-Hand Quick Entry',
    });

    // Reset fields with pleasant flash
    setSuccessAnimation(true);
    setTimeout(() => setSuccessAnimation(false), 2000);
    setAmountRupees('');
    setTitle('');
    setVoiceNotice(null);
    setTranscript('');
  };

  return (
    <div className="bg-[#1e293b] border-2 border-emerald-500/60 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 relative overflow-hidden transition-all">
      {/* Top Banner with Quick Heading & Voice Button */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl animate-pulse">⚡</span>
          <div>
            <h3 className="font-extrabold text-white text-base sm:text-lg tracking-tight flex items-center gap-2">
              <span>{lang === 'hi' ? 'सीधा यहाँ नया खर्चा लिखें' : 'Quick 3-Second Entry'}</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full uppercase font-bold">
                {lang === 'hi' ? 'आसान व तेज़' : 'Fast'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-300">
              {lang === 'hi'
                ? 'रुपये लिखें या माइक दबाकर बोलें (जैसे: "5000 सीमेंट" या "2000 रमेश मिस्त्री")'
                : 'Type or speak into the mic (e.g., "5000 Cement" or "2000 Mistri")'}
            </p>
          </div>
        </div>

        {/* Big Voice Mic Button */}
        {isSupported ? (
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-bounce ring-4 ring-rose-500/40'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-2 border-emerald-500/40'
            }`}
            title="बोलकर लिखें (Voice Input)"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 animate-spin" />
                <span>{lang === 'hi' ? 'सुन रहा हूँ...' : 'Listening...'}</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'hi' ? 'बोलकर लिखें 🎙️' : 'Voice 🎙️'}</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      {/* Voice feedback banner */}
      {voiceNotice && (
        <div className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-between">
          <span className="truncate">{voiceNotice}</span>
          <button
            type="button"
            onClick={() => setVoiceNotice(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="px-3 py-1.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-medium flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
          {/* Amount Field (4 cols) */}
          <div className="sm:col-span-4 relative">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-400">
                ₹
              </span>
              <input
                type="number"
                step="any"
                required
                value={amountRupees}
                onChange={(e) => setAmountRupees(e.target.value)}
                placeholder="0"
                className="w-full pl-9 pr-3 py-3 bg-slate-950 border-2 border-slate-700 focus:border-emerald-400 rounded-2xl text-2xl font-black text-white focus:outline-none placeholder-slate-600 shadow-inner"
              />
            </div>
            {numericAmount > 0 && (
              <p className="text-[11px] font-bold text-emerald-300 mt-1 truncate px-1">
                {formatRupeesInWords(numericAmount, lang)}
              </p>
            )}
          </div>

          {/* Description Field (5 cols) */}
          <div className="sm:col-span-5">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'सामान या काम (उदा. 50 सीमेंट, मिस्त्री, रेत)'
                  : 'What was it? (e.g. 50 Cement, Mistri)'
              }
              className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700 focus:border-emerald-400 rounded-2xl text-base font-bold text-white focus:outline-none placeholder-slate-500 shadow-inner"
            />
          </div>

          {/* Big Add Button (3 cols) */}
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={!title.trim() || numericAmount <= 0}
              className={`w-full h-full min-h-[50px] py-2.5 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 cursor-pointer ${
                !title.trim() || numericAmount <= 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {successAnimation ? (
                <>
                  <Check className="w-5 h-5 stroke-[3] text-emerald-950" />
                  <span className="text-slate-950 font-black">
                    {lang === 'hi' ? 'सेव हो गया!' : 'Saved!'}
                  </span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 stroke-[3]" />
                  <span>{lang === 'hi' ? 'खर्चा जोड़ें' : 'Add Expense'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Amount Add Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-slate-400 font-bold mr-1">
            {lang === 'hi' ? '+ रुपये जोड़ें:' : '+ Add ₹:'}
          </span>
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleQuickAmount(amt)}
              className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-emerald-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              +₹{amt >= 1000 ? `${amt / 1000}k` : amt}
            </button>
          ))}
          {amountRupees && (
            <button
              type="button"
              onClick={() => setAmountRupees('')}
              className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900 text-rose-300 text-[11px] font-bold rounded-xl border border-rose-800 transition-colors ml-auto"
            >
              {lang === 'hi' ? 'साफ करें' : 'Clear'}
            </button>
          )}
        </div>

        {/* Category & Payment Mode Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_PRESETS.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-xs'
                      : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {lang === 'hi' ? cat.labelHi : cat.name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold">
              {lang === 'hi' ? 'माध्यम:' : 'Mode:'}
            </span>
            {(['Cash', 'UPI', 'Bank Transfer'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPaymentMode(mode)}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] border transition-colors ${
                  paymentMode === mode
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {mode === 'Cash'
                  ? lang === 'hi'
                    ? '💵 कैश'
                    : '💵 Cash'
                  : mode === 'UPI'
                  ? '📱 UPI'
                  : '🏦 बैंक'}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
