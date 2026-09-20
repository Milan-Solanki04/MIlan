import React, { useState } from 'react';
import {
  LifeBuoy,
  PhoneCall,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Building2,
  Train,
  Plane,
  Compass,
  FileText,
  Clock,
  MapPin,
  ArrowRight,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Card, Badge, Button } from './ui/design-system';

interface FindHelpViewProps {
  onLaunchConcierge?: (origin?: string, dest?: string, disruption?: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

interface HelplineItem {
  name: string;
  category: 'Rail' | 'Aviation' | 'Corporate' | 'Emergency';
  number: string;
  hours: string;
  description: string;
  tag: string;
}

const HELPLINES: HelplineItem[] = [
  {
    name: 'Acme Corp 24/7 Global Travel Concierge Desk',
    category: 'Corporate',
    number: '+1-800-555-0199',
    hours: '24/7 • Dedicated Corporate Tier',
    description: 'Instant corporate rebooking, policy override authorization, and direct expense approvals.',
    tag: 'Priority Support',
  },
  {
    name: 'Indian Railways (IRCTC) Emergency Rail Helpline',
    category: 'Rail',
    number: '139',
    hours: '24/7 Multi-Lingual IVR',
    description: 'Real-time train running status, PNR cancellation, platform changes, and onboard emergency assistance.',
    tag: 'Toll-Free in India',
  },
  {
    name: 'Amtrak Passenger Operations & Disruption Desk',
    category: 'Rail',
    number: '1-800-USA-RAIL (1-800-872-7245)',
    hours: '24/7 Agent Availability',
    description: 'Acela Express and Northeast Regional re-ticketing, delay voucher issuance, and baggage recovery.',
    tag: 'US Corridor',
  },
  {
    name: 'Eurostar & Cross-Channel Rail Passenger Desk',
    category: 'Rail',
    number: '+44 1233 617575',
    hours: '06:00 - 22:00 CET',
    description: 'Channel tunnel transit disruption rerouting, Thalys/SNCF connection protection, and delay compensation.',
    tag: 'UK & Europe',
  },
  {
    name: 'Global Airline Passenger Disruption Assistance',
    category: 'Aviation',
    number: '+1-800-433-7300',
    hours: '24/7 Worldwide',
    description: 'Flight cancellation rebooking, interline partner routing, and baggage tracking assistance.',
    tag: 'Flight Support',
  },
  {
    name: 'International Emergency Services (Police/Medical)',
    category: 'Emergency',
    number: '112 / 911 / 100',
    hours: '24/7 Urgent Response',
    description: 'Immediate police, ambulance, fire, or station security assistance at any major transit hub.',
    tag: 'Immediate Emergency',
  },
];

export const FindHelpView: React.FC<FindHelpViewProps> = ({
  onLaunchConcierge,
  onNavigateToTab,
}) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const handleCopyNumber = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const filteredHelplines = selectedCategory === 'ALL'
    ? HELPLINES
    : HELPLINES.filter((h) => h.category === selectedCategory);

  return (
    <div id="find-help-view" className="space-y-6">
      {/* Quick Action Assistance Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Action 1: Disruption Re-route */}
        <Card variant="interactive" padding="md" className="space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-md bg-amber-100 text-amber-800">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-slate-900">Service Delayed or Cancelled?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Launch the Autonomous Disruption Concierge to calculate immediate Pareto-optimal bypass itineraries with verified connection buffers.
            </p>
          </div>
          <Button
            variant="warning"
            size="sm"
            onClick={() => onLaunchConcierge && onLaunchConcierge('Mumbai Central', 'Goa', 'Train cancelled')}
            className="w-full justify-between"
          >
            <span>Launch Disruption Re-Route</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Card>

        {/* Quick Action 2: Hotel Delay Sync */}
        <Card variant="interactive" padding="md" className="space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-md bg-teal-100 text-teal-800">
                <Building2 className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-slate-900">Late Arrival at Destination?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prevent your destination hotel room from being released as a no-show. Send an automated late check-in notice directly to the front desk.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateToTab && onNavigateToTab('hotels')}
            className="w-full justify-between"
          >
            <span>Notify Hotel of Late Arrival</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Card>

        {/* Quick Action 3: New Multi-Modal Route */}
        <Card variant="interactive" padding="md" className="space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-md bg-blue-100 text-blue-800">
                <Compass className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-slate-900">Need Alternative Transport?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare regional flights, express rail, intercity sleeper buses, and metro connectors with corporate policy compliance guarantees.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToTab && onNavigateToTab('planner')}
            className="w-full justify-between"
          >
            <span>Open Transport Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Card>
      </div>

      {/* Main Helplines Directory */}
      <Card variant="default" padding="lg" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">
                24/7 Traveler Helplines & Emergency Assistance
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct carrier contact points, corporate travel desk, and official transit operations centers
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            {['ALL', 'Corporate', 'Rail', 'Aviation', 'Emergency'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Helplines List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHelplines.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-border bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.name}</span>
                    <Badge variant={item.category === 'Emergency' ? 'danger' : 'neutral'} size="sm">
                      {item.tag}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.hours}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span className="font-mono text-xs sm:text-sm font-bold text-slate-900">
                    {item.number}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyNumber(item.number)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  {copiedNumber === item.number ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Passenger Rights & Compensation Charter */}
      <Card variant="default" padding="lg" className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Passenger Rights & Delay Compensation Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Global regulations (EU261, DGCA India Passenger Charter, US DOT Airline Customer Service Commitment)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl border border-border bg-white space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Delay &gt; 2 Hours</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Carriers must provide complimentary food, beverages, and access to communications (calls/messaging).
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-white space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Delay &gt; 5 Hours</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Entitled to a 100% full ticket refund without cancellation fee, or immediate alternative routing to destination.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-white space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Overnight Disruption</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Operating carrier must provide free hotel accommodation and shuttle transfers to/from station or airport.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-white space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">4</span>
              <span>Corporate Policy Guarantee</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Acme Corp policy covers up to $250 / ₹20,000 incidentals and automatic flight upgrade for delays exceeding 4 hours.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
