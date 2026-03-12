import { useState } from 'react';
import { MdSave, MdInfo } from 'react-icons/md';

/* ── Reusable number input row ── */
function NumberField({ label, helpText, name, value, unit, min, max, step = 1, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {helpText && <p className="text-xs text-gray-400 mt-0.5">{helpText}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {unit && <span className="text-sm text-gray-400 font-medium">{unit}</span>}
        <input
          type="number"
          name={name}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          className="w-28 text-right border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

/* ── Toggle row ── */
function ToggleRow({ label, helpText, enabled, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {helpText && <p className="text-xs text-gray-400 mt-0.5">{helpText}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

/* ── Card wrapper ── */
function ConfigCard({ title, subtitle, children, onSave, saved }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-6 py-2">{children}</div>
      {onSave && (
        <div className="px-6 pb-5 pt-2 flex items-center justify-between">
          {saved && (
            <span className="text-xs text-emerald-600 font-semibold animate-fade-in">✓ Saved successfully</span>
          )}
          {!saved && <span />}
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <MdSave className="text-base" /> Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Initial config state ── */
const INITIAL = {
  commission: { taxi: 10, tour: 12, refund: 5 },
  fare: { baseFare: 150, perKm: 85, waitPerMin: 5, surgeMultiplier: 1.5, airportSurcharge: 500 },
  tour: { depositPct: 20, cancellationHrs: 48, maxGroupSize: 20 },
  toggles: {
    surgeEnabled:        true,
    maintenanceMode:     false,
    newRegistrations:    true,
    driverSelfRegister:  false,
    smsNotifications:    true,
    emailReports:        true,
  },
};

export default function ConfigSection() {
  const [cfg, setCfg] = useState(INITIAL);
  const [saved, setSaved] = useState({});

  const numChange = (section) => (e) =>
    setCfg((p) => ({ ...p, [section]: { ...p[section], [e.target.name]: Number(e.target.value) } }));

  const toggleChange = (key) =>
    setCfg((p) => ({ ...p, toggles: { ...p.toggles, [key]: !p.toggles[key] } }));

  function saveSection(key) {
    setSaved((p) => ({ ...p, [key]: true }));
    setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 2500);
  }

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
        <MdInfo className="text-lg flex-shrink-0 mt-0.5" />
        <p>Changes here affect the entire platform in real time. Review carefully before saving.</p>
      </div>

      {/* Commission Rates */}
      <ConfigCard
        title="Commission Rates"
        subtitle="Percentage of booking value retained by WayGo"
        onSave={() => saveSection('commission')}
        saved={saved.commission}
      >
        <NumberField label="Taxi Commission"        helpText="% taken from each taxi booking"        name="taxi"   value={cfg.commission.taxi}   unit="%" min={0} max={50} onChange={numChange('commission')} />
        <NumberField label="Tour Commission"         helpText="% taken from each tour booking"        name="tour"   value={cfg.commission.tour}   unit="%" min={0} max={50} onChange={numChange('commission')} />
        <NumberField label="Refund Handling Fee"     helpText="% charged on processed refunds"        name="refund" value={cfg.commission.refund} unit="%" min={0} max={20} onChange={numChange('commission')} />
      </ConfigCard>

      {/* Base Taxi Fares */}
      <ConfigCard
        title="Taxi Fare Structure"
        subtitle="Base pricing rules applied to all taxi bookings"
        onSave={() => saveSection('fare')}
        saved={saved.fare}
      >
        <NumberField label="Base Fare"              helpText="Fixed charge for every ride"                    name="baseFare"          value={cfg.fare.baseFare}          unit="LKR" min={0}   step={10}  onChange={numChange('fare')} />
        <NumberField label="Rate per km"            helpText="Per kilometre charge after base"                name="perKm"             value={cfg.fare.perKm}             unit="LKR" min={0}   step={5}   onChange={numChange('fare')} />
        <NumberField label="Wait time (per min)"    helpText="Charge when vehicle is stationary"              name="waitPerMin"        value={cfg.fare.waitPerMin}        unit="LKR" min={0}   step={1}   onChange={numChange('fare')} />
        <NumberField label="Surge Multiplier"       helpText="Maximum surge pricing factor (×)"               name="surgeMultiplier"   value={cfg.fare.surgeMultiplier}   unit="×"   min={1}   step={0.1} onChange={numChange('fare')} />
        <NumberField label="Airport Surcharge"      helpText="Fixed surcharge on BIA pick-up/drop-off"        name="airportSurcharge"  value={cfg.fare.airportSurcharge}  unit="LKR" min={0}   step={50}  onChange={numChange('fare')} />
      </ConfigCard>

      {/* Tour Booking Rules */}
      <ConfigCard
        title="Tour Booking Rules"
        subtitle="Policies applied to all tour packages"
        onSave={() => saveSection('tour')}
        saved={saved.tour}
      >
        <NumberField label="Required Deposit"         helpText="% of tour price paid at booking"                name="depositPct"       value={cfg.tour.depositPct}      unit="%" min={0}  max={100} onChange={numChange('tour')} />
        <NumberField label="Free Cancellation Window" helpText="Hours before tour where full refund is issued"  name="cancellationHrs"  value={cfg.tour.cancellationHrs} unit="hrs" min={0} step={6}   onChange={numChange('tour')} />
        <NumberField label="Max Group Size"           helpText="Upper cap on tourists per tour booking"          name="maxGroupSize"     value={cfg.tour.maxGroupSize}    unit="pax" min={1} max={100}  onChange={numChange('tour')} />
      </ConfigCard>

      {/* System Toggles */}
      <ConfigCard
        title="System Toggles"
        subtitle="Feature flags and platform-wide switches"
        onSave={() => saveSection('toggles')}
        saved={saved.toggles}
      >
        <ToggleRow label="Surge Pricing"          helpText="Enable dynamic fare multiplier during peak hours" enabled={cfg.toggles.surgeEnabled}       onChange={() => toggleChange('surgeEnabled')} />
        <ToggleRow label="New User Registrations" helpText="Allow new tourists to self-register"              enabled={cfg.toggles.newRegistrations}   onChange={() => toggleChange('newRegistrations')} />
        <ToggleRow label="Driver Self-Register"   helpText="Allow drivers to apply without invite"            enabled={cfg.toggles.driverSelfRegister} onChange={() => toggleChange('driverSelfRegister')} />
        <ToggleRow label="SMS Notifications"      helpText="Send booking SMS to tourists and drivers"         enabled={cfg.toggles.smsNotifications}   onChange={() => toggleChange('smsNotifications')} />
        <ToggleRow label="Weekly Email Reports"   helpText="Send summary reports to admin email"              enabled={cfg.toggles.emailReports}       onChange={() => toggleChange('emailReports')} />
        <ToggleRow
          label={<span className="text-red-600">Maintenance Mode</span>}
          helpText="Lock the platform — only admins can access"
          enabled={cfg.toggles.maintenanceMode}
          onChange={() => toggleChange('maintenanceMode')}
        />
      </ConfigCard>
    </div>
  );
}
