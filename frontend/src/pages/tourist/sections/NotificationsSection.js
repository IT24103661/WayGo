import { MdNotifications, MdCheckCircle, MdInfo, MdWarning, MdClose } from 'react-icons/md';

const NOTIFICATIONS = [
  { id: 1, type: 'success', title: 'Booking Confirmed!', message: 'Your booking for Sigiriya Rock Tour on Mar 15 is confirmed.', time: '2 hours ago', icon: MdCheckCircle },
  { id: 2, type: 'info', title: 'Driver Assigned', message: 'Ruwan D. has been assigned as your driver for the tour.', time: '1 day ago', icon: MdInfo },
  { id: 3, type: 'warning', title: 'Payment Due', message: 'Please complete payment for booking #BK-0044 before the trip.', time: '2 days ago', icon: MdWarning },
  { id: 4, type: 'success', title: 'Tour Completed', message: 'Thank you for joining the Yala Safari! Share your experience.', time: '5 days ago', icon: MdCheckCircle },
];

const TYPE_BADGE = {
  success: 'bg-emerald-100 text-emerald-700',
  info: 'bg-blue-100 text-blue-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
};

const TYPE_ICON_COLOR = {
  success: 'text-emerald-600',
  info: 'text-blue-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
};

export default function NotificationsSection() {
  return (
    <div className="space-y-4">
      {/* Mark All as Read */}
      <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border border-blue-100">
        <p className="text-sm text-blue-700 font-medium">You have 4 unread notifications</p>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold">Mark all as read</button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {NOTIFICATIONS.map((notif) => {
          const Icon = notif.icon;
          return (
            <div key={notif.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow`}>
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${TYPE_BADGE[notif.type]}`}>
                  <Icon className={`text-xl ${TYPE_ICON_COLOR[notif.type]}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                </div>

                {/* Close */}
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0">
                  <MdClose className="text-lg" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}