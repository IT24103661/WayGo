import { MdHelp, MdSend, MdPhone, MdEmail, MdAccessTime } from 'react-icons/md';

const FAQ_ITEMS = [
  {
    id: 1,
    question: 'How do I report a vehicle issue?',
    answer: 'Open a support ticket and choose "Vehicle Issue". A fleet manager will contact you quickly.'
  },
  {
    id: 2,
    question: 'What if a passenger does not show up?',
    answer: 'Wait 5 minutes, then mark the request as a no-show from your Active Requests screen.'
  },
  {
    id: 3,
    question: 'Can I go offline during a tour?',
    answer: 'Your status will show "On Trip" while the tour is active. End the trip to return online.'
  },
  {
    id: 4,
    question: 'How do I update my assigned vehicle?',
    answer: 'Fleet managers control assignments. Submit a ticket to request a vehicle change.'
  },
];

const SUPPORT_CHANNELS = [
  { icon: MdPhone, label: 'Fleet Hotline', value: '+94 11 345 6789', color: 'amber' },
  { icon: MdEmail, label: 'Email', value: 'fleet@waygo.lk', color: 'blue' },
  { icon: MdAccessTime, label: 'Hours', value: '24/7 Support', color: 'emerald' },
];

export default function SupportSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SUPPORT_CHANNELS.map((channel) => {
          const Icon = channel.icon;
          const colorMap = {
            amber: 'bg-cyan-50 border-cyan-200 text-cyan-700',
            blue: 'bg-emerald-50 border-emerald-200 text-emerald-700',
            emerald: 'bg-white border-slate-200 text-slate-700',
          };
          return (
            <div key={channel.label} className={`${colorMap[channel.color]} rounded-3xl border-2 p-6 text-center shadow-[0_15px_35px_-30px_rgba(34,211,238,0.2)]`}>
              <Icon className="text-3xl mx-auto mb-2" />
              <p className="font-semibold">{channel.label}</p>
              <p className="text-sm font-bold mt-2">{channel.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_-40px_rgba(34,211,238,0.2)] border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Submit a Support Ticket</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
            <input
              type="text"
              placeholder="Describe the issue..."
              className="w-full px-4 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white text-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white text-slate-700">
              <option>Vehicle Issue</option>
              <option>Passenger Issue</option>
              <option>Payment Issue</option>
              <option>Safety Concern</option>
              <option>General Inquiry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
            <textarea
              placeholder="Provide details so we can help faster..."
              rows="5"
              className="w-full px-4 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white text-slate-700"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-white py-2.5 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <MdSend className="text-lg" />
            Send Ticket
          </button>
        </form>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_-40px_rgba(34,211,238,0.2)] border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <MdHelp className="text-lg text-cyan-600" />
            Driver FAQs
          </h3>
        </div>
        <div className="divide-y divide-slate-200">
          {FAQ_ITEMS.map((item) => (
            <details key={item.id} className="p-4 hover:bg-slate-50 cursor-pointer">
              <summary className="font-semibold text-slate-800 flex items-center justify-between">
                {item.question}
                <span className="text-slate-400">▼</span>
              </summary>
              <p className="text-slate-600 mt-3 text-sm">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
