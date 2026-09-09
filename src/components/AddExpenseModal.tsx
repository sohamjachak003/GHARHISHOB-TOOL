import React, { useState, useEffect } from 'react';
import { Expense, ExpenseType } from '../types';
import { parseRupeesToPaisa, getTodayDate, formatRupeesInWords } from '../utils/format';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { parseHindiAndEnglishVoiceInput } from '../utils/voiceParser';
import {
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Sparkles,
  Receipt,
  User,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id'> | Expense) => void;
  expenseToEdit?: Expense | null;
  lang?: 'hi' | 'en';
}

const COMMON_CATEGORIES = [
  { name: 'Materials', labelHi: 'सामान (Cement/Steel)', icon: '🧱' },
  { name: 'Labour', labelHi: 'मजदूरी (Mistri/Labour)', icon: '👷' },
  { name: 'Transport', labelHi: 'गाड़ी भाड़ा (Tractor/Truck)', icon: '🚚' },
  { name: 'Plumbing', labelHi: 'प्लंबिंग (Pipes/Taps)', icon: '🚰' },
  { name: 'Electrical', labelHi: 'बिजली (Wiring/Switches)', icon: '⚡' },
  { name: 'Tiles', labelHi: 'टाइल्स / मार्बल', icon: '◻️' },
  { name: 'Painting', labelHi: 'पुट्टी / पेंटिंग', icon: '🎨' },
  { name: 'Wood & Carpentry', labelHi: 'लकड़ी / बढ़ई', icon: '🚪' },
  { name: 'Home/Misc', labelHi: 'चाय-नाश्ता / अन्य', icon: '☕' },
];

const SUGGESTIONS = [
  { text: '50 Bori Cement', textHi: '50 बोरी सीमेंट' },
  { text: 'Mistri Hajiri', textHi: 'मिस्त्री दिहाड़ी' },
  { text: 'Reti / Sand Dumper', textHi: 'रेती / बालू' },
  { text: 'Sariya 12mm', textHi: 'सरिया / स्टील' },
  { text: '1000 Bricks', textHi: '1000 ईंटें' },
  { text: 'Tractor Bhada', textHi: 'ट्रैक्टर भाड़ा' },
  { text: 'Labour Tea', textHi: 'चाय-नाश्ता' },
];

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 25000, 50000];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  expenseToEdit,
  lang = 'hi',
}) => {
  // Primary simple inputs
  const [amountRupees, setAmountRupees] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Materials');
  const [notes, setNotes] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque'>('Cash');
  const [date, setDate] = useState(getTodayDate());

  // Advanced secondary inputs (hidden by default)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expenseType, setExpenseType] = useState<ExpenseType>('construction');
  const [paidTo, setPaidTo] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Voice recognition integration
  const { isListening, transcript, isSupported, error, startListening, stopListening, setTranscript } =
    useVoiceRecognition(lang);

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setCategory(expenseToEdit.category);
      setExpenseType(expenseToEdit.expense_type || 'construction');
      setAmountRupees((expenseToEdit.amount / 100).toString());
      setDate(expenseToEdit.date);
      setPaymentMode(expenseToEdit.payment_mode || 'Cash');
      setPaidTo(expenseToEdit.paid_to || '');
      setBillNumber(expenseToEdit.bill_number || '');
      setNotes(expenseToEdit.notes || '');

      // Automatically show advanced section if existing record contains advanced data
      if (
        expenseToEdit.paid_to ||
        expenseToEdit.bill_number ||
        (expenseToEdit.expense_type && expenseToEdit.expense_type !== 'construction')
      ) {
        setShowAdvanced(true);
      } else {
        setShowAdvanced(false);
      }
    } else {
      setTitle('');
      setCategory('Materials');
      setExpenseType('construction');
      setAmountRupees('');
      setDate(getTodayDate());
      setPaymentMode('Cash');
      setPaidTo('');
      setBillNumber('');
      setNotes('');
      setShowAdvanced(false);
    }
    setVoiceNotice(null);
  }, [expenseToEdit, isOpen]);

  // Voice transcript listener
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
        lang === 'hi' ? `🎙️ सुना: "${transcript}"` : `🎙️ Heard: "${transcript}"`
      );
    }
  }, [transcript, lang]);

  if (!isOpen) return null;

  const currentNumericAmount = parseFloat(amountRupees.replace(/,/g, '')) || 0;

  const handleAddQuickAmount = (val: number) => {
    const current = parseFloat(amountRupees.replace(/,/g, '')) || 0;
    setAmountRupees((current + val).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || currentNumericAmount <= 0) return;

    const paisa = parseRupeesToPaisa(currentNumericAmount);
    if (paisa <= 0) return;

    const expensePayload = {
      title: title.trim(),
      category,
      expense_type: expenseType,
      amount: paisa,
      date,
      payment_mode: paymentMode,
      paid_to: paidTo.trim() || undefined,
      bill_number: billNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (expenseToEdit) {
      onSave({
        ...expenseToEdit,
        ...expensePayload,
      });
    } else {
      onSave(expensePayload);
    }

    setTranscript('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#1e293b] border-2 border-emerald-500/60 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700/90 flex justify-between items-center bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-xl text-slate-950 font-black shadow-md">
              💰
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg sm:text-xl tracking-tight">
                {expenseToEdit
                  ? lang === 'hi'
                    ? 'खर्चा बदलें (Edit Expense)'
                    : 'Edit Expense'
                  : lang === 'hi'
                  ? 'नया खर्चा लिखें (Add Expense)'
                  : 'Add New Expense'}
              </h3>
              <p className="text-xs text-emerald-300 font-medium">
                {lang === 'hi'
                  ? 'रुपये, सामान और कैटेगरी चुनकर दर्ज करें'
                  : 'Fast & simple 3-step entry for your house ledger'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Input Button */}
            {isSupported && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse border-rose-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-slate-700'
                }`}
                title={lang === 'hi' ? 'बोलकर लिखें (Voice Input)' : 'Speak to fill'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Voice Feedback Notice */}
        {voiceNotice && (
          <div className="mx-4 mt-3 px-3 py-1.5 bg-emerald-950/90 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-between">
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
          <div className="mx-4 mt-3 px-3 py-1.5 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-medium">
            {error}
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* 1. BIG HIGH-CONTRAST AMOUNT INPUT */}
          <div className="bg-slate-900/95 p-4 rounded-2xl border-2 border-emerald-500/60 shadow-inner space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {lang === 'hi' ? '१. कितने रुपये खर्च हुए? (Amount) *' : '1. Amount in Rupees *'}
              </label>
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                {lang === 'hi' ? 'ज़रूरी' : 'Required'}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-400">
                ₹
              </span>
              <input
                type="number"
                step="any"
                required
                autoFocus
                placeholder="0"
                value={amountRupees}
                onChange={(e) => setAmountRupees(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border-2 border-slate-700 rounded-xl text-2xl sm:text-3xl font-black text-white focus:outline-none focus:border-emerald-400 placeholder-slate-600"
              />
            </div>

            {/* Indian Words breakdown */}
            {currentNumericAmount > 0 && (
              <div className="text-xs font-bold text-emerald-300 bg-emerald-950/70 px-3 py-1.5 rounded-xl border border-emerald-500/40 flex items-center justify-between">
                <span>{formatRupeesInWords(currentNumericAmount, 'hi')}</span>
                <span className="text-slate-400 text-[11px]">
                  ({formatRupeesInWords(currentNumericAmount, 'en')})
                </span>
              </div>
            )}

            {/* Quick Amount Add Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-semibold mr-1">
                {lang === 'hi' ? '+ जोड़ें:' : '+ Add ₹:'}
              </span>
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAddQuickAmount(amt)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-emerald-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                >
                  +₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
              {amountRupees && (
                <button
                  type="button"
                  onClick={() => setAmountRupees('')}
                  className="px-2 py-1 bg-rose-950/50 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-lg border border-rose-800 transition-colors ml-auto"
                >
                  {lang === 'hi' ? 'साफ करें' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          {/* 2. DESCRIPTION / WHAT WAS IT */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase">
              {lang === 'hi' ? '२. सामान या काम का नाम (Description) *' : '2. What was it? (Description) *'}
            </label>
            <input
              type="text"
              required
              placeholder={
                lang === 'hi'
                  ? 'जैसे: 50 बोरी सीमेंट, रमेश मिस्त्री दिहाड़ी, 1 ट्रॉली रेत...'
                  : 'e.g., 50 Bags Cement, Mason Daily Wage, Sand...'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-base font-semibold text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />

            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
              {SUGGESTIONS.map((sug) => {
                const label = lang === 'hi' ? sug.textHi : sug.text;
                return (
                  <button
                    key={sug.text}
                    type="button"
                    onClick={() => setTitle(label)}
                    className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 text-xs font-medium rounded-lg border border-slate-700 shrink-0 transition-colors"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. CATEGORY SELECTION (LARGE TOUCH CARDS) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase">
              {lang === 'hi' ? '३. कैटेगरी चुनें (Category)' : '3. Select Category'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COMMON_CATEGORIES.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/25 border-emerald-500 text-emerald-300 font-black shadow-md ring-1 ring-emerald-500/50'
                        : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl mb-1">{cat.icon}</span>
                    <p className="text-xs font-bold leading-tight">{cat.name}</p>
                    <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                      {cat.labelHi.split('(')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. SIMPLE DATE & PAYMENT MODE (1-TAP TOGGLE BUTTONS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Payment Mode Pills */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase">
                {lang === 'hi' ? 'पैसा कैसे दिया? (Payment Mode)' : 'Payment Mode'}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'Cash', label: lang === 'hi' ? '💵 कैश' : '💵 Cash' },
                    { id: 'UPI', label: '📱 UPI' },
                    { id: 'Bank Transfer', label: lang === 'hi' ? '🏦 बैंक' : '🏦 Bank' },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMode(mode.id)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                      paymentMode === mode.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-sm'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase">
                {lang === 'hi' ? 'तारीख (Date)' : 'Date'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 5. NOTES (DIRECTLY VISIBLE & CONCISE) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300 uppercase">
              {lang === 'hi' ? 'कोई खास बात / नोट (Notes / Remark)' : 'Notes / Remark'}
            </label>
            <input
              type="text"
              placeholder={
                lang === 'hi'
                  ? 'जैसे: 10 बोरी बाकी बची है, अगले हफ्ते पूरा हिसाब होगा...'
                  : 'e.g., 10 bags pending delivery, partial payment...'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
          </div>

          {/* 6. ADVANCED OPTIONAL FIELDS ACCORDION (HIDDEN BY DEFAULT) */}
          <div className="pt-1 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="w-full flex items-center justify-between py-2 px-3 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {lang === 'hi'
                    ? showAdvanced
                      ? 'अतिरिक्त विवरण छुपाएं (दुकानदार, बिल नंबर)'
                      : '+ अधिक विवरण लिखें (दुकानदार, बिल/पर्ची नंबर)'
                    : showAdvanced
                    ? 'Hide Advanced Details'
                    : '+ More Options (Shopkeeper, Bill No)'}
                </span>
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      {lang === 'hi' ? 'दुकानदार / व्यक्ति का नाम (Paid To)' : 'Paid To (Shop / Person)'}
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder={
                          lang === 'hi' ? 'जैसे: शर्मा हार्डवेयर' : 'e.g., Sharma Hardware'
                        }
                        value={paidTo}
                        onChange={(e) => setPaidTo(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      {lang === 'hi' ? 'बिल या चालान नंबर (Bill No)' : 'Bill / Challan No'}
                    </label>
                    <div className="relative">
                      <Receipt className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder={lang === 'hi' ? 'जैसे: INV-2024 / पर्ची #12' : 'e.g., INV-2024'}
                        value={billNumber}
                        onChange={(e) => setBillNumber(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    {lang === 'hi' ? 'खर्च का प्रकार (Expense Classification)' : 'Expense Type'}
                  </label>
                  <select
                    value={expenseType}
                    onChange={(e) => setExpenseType(e.target.value as ExpenseType)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="construction">
                      {lang === 'hi' ? '🏗️ मकान निर्माण (Main House Construction)' : '🏗️ Main Construction'}
                    </option>
                    <option value="interior">
                      {lang === 'hi' ? '🛋️ इंटीरियर / सजावट (Interior & Furnishing)' : '🛋️ Interior'}
                    </option>
                    <option value="renovation">
                      {lang === 'hi' ? '🔨 मरम्मत / नवीनीकरण (Renovation)' : '🔨 Renovation'}
                    </option>
                    <option value="general">
                      {lang === 'hi' ? '📦 सामान्य खर्च (General)' : '📦 General'}
                    </option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT ACTION BUTTONS */}
          <div className="pt-3 border-t border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              {lang === 'hi' ? 'रद्द करें (Cancel)' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={!title.trim() || currentNumericAmount <= 0}
              className={`px-6 py-2.5 rounded-xl font-black text-sm sm:text-base transition-all shadow-xl flex items-center gap-2 cursor-pointer active:scale-95 ${
                !title.trim() || currentNumericAmount <= 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>
                {expenseToEdit
                  ? lang === 'hi'
                    ? 'बदलाव सेव करें'
                    : 'Update Expense'
                  : lang === 'hi'
                  ? 'खर्चा दर्ज करें'
                  : 'Save Expense'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
