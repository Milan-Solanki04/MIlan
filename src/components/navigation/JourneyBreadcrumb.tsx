import React from 'react';
import {
  ChevronRight,
  ArrowLeft,
  Compass,
  Briefcase,
  AlertTriangle,
  Building2,
  MapPin,
  LifeBuoy,
  Bell,
  ShieldCheck,
  ShieldAlert,
  Layers,
  Sparkles,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { NavigationTab } from '../Header';
import { Badge, Button } from '../ui/design-system';

export interface JourneyBreadcrumbProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  previousTab?: NavigationTab | null;
  onBack?: () => void;
  subTitle?: string;
  contextInfo?: {
    origin?: string;
    destination?: string;
    tripRef?: string;
    routeTitle?: string;
  };
  onQuickAction?: (actionId: string) => void;
}

interface TabMeta {
  title: string;
  category: 'Your Journey' | 'Support & Status' | 'Enterprise & Tools';
  description: string;
  whereAmI: string;
  whatCanIDo: string[];
  whatNext: {
    label: string;
    targetTab: NavigationTab;
    description: string;
  };
  icon: React.ComponentType<{ className?: string }>;
}

const TAB_METADATA: Record<NavigationTab, TabMeta> = {
  trips: {
    title: 'Trip / Journey',
    category: 'Your Journey',
    description: 'Active corporate bookings, tickets, and live journey timeline',
    whereAmI: 'You are viewing your booked journeys and active ticket reservations.',
    whatCanIDo: [
      'Inspect departure/arrival times, transfers, and carriage assignments',
      'Simulate transit delays to test automated rebooking buffers',
      'Send trip details to Disruption Concierge or cancel reservations',
    ],
    whatNext: {
      label: 'Explore Transport Alternatives',
      targetTab: 'planner',
      description: 'Search and compare other routes or transit modes',
    },
    icon: Briefcase,
  },
  planner: {
    title: 'Transport / Planner',
    category: 'Your Journey',
    description: 'Multi-modal route finder comparing rail, flights, bus, and metro',
    whereAmI: 'You are in the Multi-Modal Transport Planner.',
    whatCanIDo: [
      'Search routes between any origin and destination worldwide',
      'Filter by travel mode (Rail, Air, Multi-Modal) and corporate travel policies',
      'Select any itinerary to view detailed segment breakdown and book',
    ],
    whatNext: {
      label: 'View Current Itinerary on Map',
      targetTab: 'map',
      description: 'See stops and transit corridors visually',
    },
    icon: Compass,
  },
  disruptions: {
    title: 'Disruptions / Concierge',
    category: 'Your Journey',
    description: 'Autonomous incident response, bypass routing, and trade-off comparison',
    whereAmI: 'You are in the Autonomous Disruption Concierge.',
    whatCanIDo: [
      'Detect cancellations or delay threats across scheduled transit segments',
      'Calculate Pareto-optimal bypass routes (Fastest, Cheapest, Minimal Transfers)',
      'Inspect before/after journey timelines and hotel sync protection',
    ],
    whatNext: {
      label: 'Check Hotel Protection',
      targetTab: 'hotels',
      description: 'Notify hotel and secure late check-in guarantees',
    },
    icon: AlertTriangle,
  },
  hotels: {
    title: 'Hotels & Stays',
    category: 'Your Journey',
    description: 'Destination accommodation, late check-in protection, and delay sync',
    whereAmI: 'You are managing destination hotel reservations and stay protection.',
    whatCanIDo: [
      'View guaranteed room bookings at your arrival destination',
      'Transmit automated late arrival notices to the front desk',
      'Search curated corporate hotels with verified amenity standards',
    ],
    whatNext: {
      label: 'Emergency & Help Contacts',
      targetTab: 'help',
      description: 'Get 24/7 assistance hotlines and passenger support',
    },
    icon: Building2,
  },
  map: {
    title: 'Journey Map',
    category: 'Your Journey',
    description: 'Visual route path, transfer hubs, and transit corridor tracking',
    whereAmI: 'You are viewing the interactive multi-modal geographic map.',
    whatCanIDo: [
      'Inspect origin, transfer stations, and destination markers on the map',
      'Switch between Radar Schematic, OpenStreetMap, and Google Maps Platform',
      'Click intermediate stops to view scheduled arrival and layover duration',
    ],
    whatNext: {
      label: 'Back to Transport Planner',
      targetTab: 'planner',
      description: 'Adjust travel dates or compare alternative carriers',
    },
    icon: MapPin,
  },
  help: {
    title: 'Find Help & Support',
    category: 'Support & Status',
    description: '24/7 carrier helplines, passenger rights charter, and emergency assistance',
    whereAmI: 'You are in the Traveler Emergency & Help Center.',
    whatCanIDo: [
      'Access 24/7 direct phone numbers for rail, airlines, and corporate travel desk',
      'Check passenger compensation entitlements under EU261 / DGCA charters',
      'Trigger 1-click autonomous re-routing or find nearest alternative transit hubs',
    ],
    whatNext: {
      label: 'Check Active Alerts',
      targetTab: 'notifications',
      description: 'Review real-time flight, train, and weather advisories',
    },
    icon: LifeBuoy,
  },
  notifications: {
    title: 'Activity / Status',
    category: 'Support & Status',
    description: 'Real-time transit alerts, system telemetry, and journey notifications',
    whereAmI: 'You are reviewing active travel advisories and real-time status updates.',
    whatCanIDo: [
      'View dispatch notifications, platform change alerts, and gate updates',
      'Filter alerts by severity (Critical Disruption, Warning, Info)',
      'Mark notifications as read or navigate directly to affected journeys',
    ],
    whatNext: {
      label: 'Review Active Trips',
      targetTab: 'trips',
      description: 'Check how alerts impact your scheduled departure',
    },
    icon: Bell,
  },
  policies: {
    title: 'Corporate Policies',
    category: 'Enterprise & Tools',
    description: 'Corporate travel policy rules, spending caps, and compliance tiers',
    whereAmI: 'You are managing corporate travel compliance rules and budget thresholds.',
    whatCanIDo: [
      'Switch between Standard, Executive, and Sustainable travel policies',
      'Configure cabin class permissions, booking lead times, and max fare limits',
      'Observe live compliance calculations across multi-modal routes',
    ],
    whatNext: {
      label: 'Test in Transport Planner',
      targetTab: 'planner',
      description: 'See how policy updates reflect on candidate route badges',
    },
    icon: ShieldCheck,
  },
  robustness: {
    title: 'Robustness Test Suite',
    category: 'Enterprise & Tools',
    description: '12 fault-injection test scenarios and 31 automated regression tests',
    whereAmI: 'You are in the Engineering Robustness & Fault Tolerance Test Harness.',
    whatCanIDo: [
      'Execute all 31 deterministic and scenario tests with 1 click',
      'Simulate network failures, provider timeouts, and total corridor cancellations',
      'Verify zero-crash fallback guarantees and resilience protocols',
    ],
    whatNext: {
      label: 'System Architecture',
      targetTab: 'architecture',
      description: 'Inspect service mesh diagrams and API contracts',
    },
    icon: ShieldAlert,
  },
  architecture: {
    title: 'System Architecture',
    category: 'Enterprise & Tools',
    description: 'Microservice topography, API endpoint contracts, and data models',
    whereAmI: 'You are inspecting the TravelAssist technical architecture and API endpoints.',
    whatCanIDo: [
      'Review REST endpoints (POST /api/v1/replan, GET /api/hotels, GET /api/routes)',
      'Inspect fallback graph routing algorithms and latency profiles',
      'Review corporate data privacy and offline resilience design',
    ],
    whatNext: {
      label: 'Return to Traveler Journey',
      targetTab: 'trips',
      description: 'Return to primary traveler dashboard',
    },
    icon: Layers,
  },
  telemetry: {
    title: 'Provider Telemetry',
    category: 'Enterprise & Tools',
    description: 'Service health mesh and upstream API latency monitoring',
    whereAmI: 'You are viewing live provider telemetry and upstream status.',
    whatCanIDo: [
      'Inspect Google Directions, IRCTC, Amtrak, and Weather API health',
      'View response time latencies and circuit breaker statuses',
    ],
    whatNext: {
      label: 'Back to Transport Planner',
      targetTab: 'planner',
      description: 'Run route searches with healthy providers',
    },
    icon: Sparkles,
  },
};

export const JourneyBreadcrumb: React.FC<JourneyBreadcrumbProps> = ({
  activeTab,
  onNavigate,
  previousTab,
  onBack,
  subTitle,
  contextInfo,
}) => {
  const current = TAB_METADATA[activeTab] || TAB_METADATA.planner;
  const Icon = current.icon;

  const previousMeta = previousTab ? TAB_METADATA[previousTab] : null;

  return (
    <div
      id="journey-breadcrumb-bar"
      className="bg-white border-b border-border py-3 px-4 sm:px-6 lg:px-8 mb-6 shadow-2xs transition-all"
    >
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* Top Row: Trail & Back button */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-slate-500 overflow-x-auto py-0.5">
            <button
              type="button"
              onClick={() => onNavigate('trips')}
              className="hover:text-slate-900 font-medium transition-colors whitespace-nowrap"
            >
              TravelAssist
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            <span className="text-slate-400 font-medium whitespace-nowrap">
              {current.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            <span className="font-semibold text-slate-900 flex items-center gap-1 whitespace-nowrap">
              <Icon className="w-3.5 h-3.5 text-slate-700" />
              {current.title}
            </span>

            {contextInfo?.tripRef && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                  {contextInfo.tripRef}
                </span>
              </>
            )}

            {contextInfo?.origin && contextInfo?.destination && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-600 truncate max-w-[180px]">
                  {contextInfo.origin} → {contextInfo.destination}
                </span>
              </>
            )}
          </nav>

          {/* Back Navigation Button */}
          {previousTab && previousTab !== activeTab && onBack && (
            <button
              type="button"
              id="breadcrumb-back-btn"
              onClick={onBack}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors shrink-0 shadow-2xs"
            >
              <ArrowLeft className="w-3 h-3 text-slate-600" />
              <span>Back to {previousMeta?.title.split('/')[0].trim() || 'Previous'}</span>
            </button>
          )}
        </div>

        {/* Middle Row: Page Title + "Where am I" description + Next Step CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {current.title}
              </h1>
              <Badge variant="neutral" size="sm">
                {current.category}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 leading-normal max-w-2xl">
              {subTitle || current.description}
            </p>
          </div>

          {/* "What should I do next?" prompt */}
          <div className="flex items-center gap-2 shrink-0 bg-slate-50 border border-slate-200/80 rounded-lg p-2 max-w-sm">
            <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Recommended Next Step
              </div>
              <button
                type="button"
                onClick={() => onNavigate(current.whatNext.targetTab)}
                className="text-xs font-semibold text-slate-900 hover:text-emerald-700 flex items-center gap-1 transition-colors text-left truncate"
                title={current.whatNext.description}
              >
                <span className="truncate">{current.whatNext.label}</span>
                <ChevronRight className="w-3 h-3 shrink-0 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom expandable / collapsible "What can I do here?" guidance chips */}
        <div className="pt-2 border-t border-slate-100/80 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600">
          <span className="font-semibold text-slate-800 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-500" />
            What you can do here:
          </span>
          {current.whatCanIDo.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-400"></span>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
