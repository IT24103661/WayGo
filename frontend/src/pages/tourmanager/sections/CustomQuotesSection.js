import { useState } from 'react';
import { MdOutlineRequestQuote, MdCheckCircle, MdAccessTime } from 'react-icons/md';
import { useTourManagerQuotes } from '../../../hooks/useTourManagerAPI';

const DEMO_QUOTES = [
  {
    _id: 'CQ-301',
    requestedRoute: 'Colombo -> Kandy -> Sigiriya -> Dambulla',
    status: 'Pending',
    userId: { name: 'Amaya Perera' },
    quotedPrice: 0
  },
  {
    _id: 'CQ-302',
    requestedRoute: 'Negombo -> Wilpattu -> Anuradhapura',
    status: 'Pending',
    userId: { name: 'Liam Carter' },
    quotedPrice: 0
  },
];

export default function CustomQuotesSection() {
  const { quotes, loading, updateQuote } = useTourManagerQuotes('Pending');
  const [prices, setPrices] = useState({});

  const displayQuotes = quotes.length > 0 ? quotes : DEMO_QUOTES;

  const handlePriceChange = (quoteId) => (event) => {
    setPrices((prev) => ({ ...prev, [quoteId]: event.target.value }));
  };

  const handleSendQuote = async (quoteId) => {
    const quotedPrice = Number(prices[quoteId]);
    if (!quotedPrice) {
      return;
    }
    await updateQuote(quoteId, { quotedPrice, status: 'Quoted' });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase">Custom Quotes</p>
        <h2 className="text-2xl font-bold text-emerald-950">Pending Custom Quotes</h2>
        <p className="text-emerald-700/80">Review bespoke trip requests and send premium quotes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading && (
          <div className="col-span-full text-emerald-700">Loading quotes...</div>
        )}
        {!loading && displayQuotes.map((quote) => (
          <div key={quote._id} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-emerald-200 shadow-[0_20px_50px_-40px_rgba(16,185,129,0.35)] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <MdOutlineRequestQuote className="text-xl" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">{quote.userId?.name || 'Guest'}</p>
                  <p className="text-xs text-emerald-600/80">{quote._id}</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                {quote.status || 'Pending'}
              </span>
            </div>

            <div className="mt-4 text-sm text-emerald-800">
              <p className="font-semibold">Route</p>
              <p className="text-emerald-700/80 mt-1">{quote.requestedRoute}</p>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-emerald-700">
              <div className="flex items-center gap-2">
                <MdAccessTime className="text-emerald-500" />
                Quote needed in 6 hrs
              </div>
              <div className="flex items-center gap-2">
                <MdCheckCircle className="text-emerald-500" />
                {quote.quotedPrice ? `LKR ${quote.quotedPrice.toLocaleString()}` : 'Pending price'}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <input
                type="number"
                value={prices[quote._id] || ''}
                onChange={handlePriceChange(quote._id)}
                placeholder="Enter price"
                className="flex-1 px-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={() => handleSendQuote(quote._id)}
                className="px-4 py-2 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                Send
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
