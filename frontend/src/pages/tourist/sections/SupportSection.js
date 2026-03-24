import { MdHelp, MdSend, MdPhone, MdEmail, MdAccessTime } from 'react-icons/md';

const FAQ_ITEMS = [
  { id: 1, question: 'How do I book a tour?', answer: 'Simply browse available tours, select your preferred date, and click "Book Now" to proceed with payment.' },
  { id: 2, question: 'Can I cancel or modify my booking?', answer: 'Yes, you can cancel up to 24 hours before your booking. Modifications can be made through the My Bookings section.' },
  { id: 3, question: 'What payment methods are accepted?', answer: 'We accept credit cards, debit cards, and mobile payments like Dialog, Mobitel, and Airtel.' },
  { id: 4, question: 'How do I contact my driver?', answer: 'Once your booking is confirmed, you can contact your driver through the WhatsApp link provided in your booking details.' },
  { id: 5, question: 'What if I have an emergency during my trip?', answer: 'Call our 24/7 emergency hotline at +94 11 234 5678. Your safety is our priority.' },
];

const SUPPORT_CHANNELS = [
  { icon: MdPhone, label: 'Call Us', value: '+94 11 234 5678', color: 'blue' },
  { icon: MdEmail, label: 'Email', value: 'support@waygo.lk', color: 'purple' },
  { icon: MdAccessTime, label: 'Hours', value: '24/7 Available', color: 'emerald' },
];

export default function SupportSection() {
  return (
    <div className="space-y-6">
      {/* Support Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SUPPORT_CHANNELS.map((channel) => {
          const Icon = channel.icon;
          const colorMap = {
            blue: 'bg-blue-50 border-blue-200 text-blue-700',
            purple: 'bg-purple-50 border-purple-200 text-purple-700',
            emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          };
          return (
            <div key={channel.label} className={`${colorMap[channel.color]} rounded-2xl border-2 p-6 text-center hover:shadow-md transition-shadow`}>
              <Icon className="text-3xl mx-auto mb-2" />
              <p className="font-semibold">{channel.label}</p>
              <p className="text-sm font-bold mt-2">{channel.value}</p>
            </div>
          );
        })}
      </div>

      {/* Submit Ticket */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Submit a Support Ticket</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              placeholder="Describe your issue..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Booking Issue</option>
              <option>Payment Issue</option>
              <option>Driver/Vehicle Issue</option>
              <option>General Inquiry</option>
              <option>Complaint</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
            <textarea
              placeholder="Describe your issue in detail..."
              rows="5"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <MdSend className="text-lg" />
            Send Ticket
          </button>
        </form>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <MdHelp className="text-lg text-blue-600" />
            Frequently Asked Questions
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {FAQ_ITEMS.map((item) => (
            <details key={item.id} className="p-4 hover:bg-gray-50 cursor-pointer">
              <summary className="font-semibold text-gray-800 flex items-center justify-between">
                {item.question}
                <span className="text-gray-400">▼</span>
              </summary>
              <p className="text-gray-600 mt-3 text-sm">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}