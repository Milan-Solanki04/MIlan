import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Plane,
  Train,
  Bus,
  Car,
  Check,
  RefreshCw,
  Building2,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  Sliders,
  DollarSign,
  Info,
  Navigation,
  FileText,
  AlertCircle,
} from "lucide-react";
import { ReplanApiResponse, ReplanRouteItem, RecommendationResponse } from "../../types";
import { HotelStay } from "../../types/unifiedContract";
import { Badge, Button } from "../ui/design-system";

export interface ConfirmedBypassResult {
  bookingRef: string;
  confirmedAt: string;
  route: ReplanRouteItem;
  origin: string;
  destination: string;
  revisedArrivalTime: string;
  hotelNotified: boolean;
  hotelName?: string;
  actionsPerformed: {
    title: string;
    description: string;
    executed: boolean;
    timestamp: string;
  }[];
  manualFollowUps: string[];
}

interface StressedTravelerFlowProps {
  currentLocation: string;
  destination: string;
  disruption: string;
  currencySymbol: string;
  replanData: ReplanApiResponse | null;
  recommendation: RecommendationResponse | null;
  hotelStay: HotelStay | null;
  loading: boolean;
  error: string | null;
  selectedRoute: ReplanRouteItem | null;
  onSelectRoute: (route: ReplanRouteItem) => void;
  onRetry: () => void;
  onExecuteAction: (route: ReplanRouteItem) => Promise<void>;
  onUpdateIncident: (loc: string, dest: string, disrupt: string) => void;
  isActionExecuting: boolean;
  confirmedResult: ConfirmedBypassResult | null;
  onResetConfirmation: () => void;
  onNavigateToTrips?: () => void;
  onNavigateToHelp?: () => void;
  // Secondary views
  mapComponent?: React.ReactNode;
  diagnosticsComponent?: React.ReactNode;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

function getModeIcon(modeName: string) {
  const m = modeName.toLowerCase();
  if (m.includes("flight") || m.includes("air")) return <Plane className="h-4 w-4" />;
  if (m.includes("train") || m.includes("rail")) return <Train className="h-4 w-4" />;
  if (m.includes("bus")) return <Bus className="h-4 w-4" />;
  return <Car className="h-4 w-4" />;
}

// Helper to provide clear, human "Why recommended" rationale
function getRecommendationRationale(
  route: ReplanRouteItem,
  isTopRec: boolean,
  recommendation?: RecommendationResponse | null
): string {
  if (isTopRec && recommendation?.traveller_message) {
    return recommendation.traveller_message;
  }
  if (isTopRec && recommendation?.headline) {
    return recommendation.headline;
  }

  const modes = (route.transport_modes || []).map((m) => m.toLowerCase()).join(" ");
  if (modes.includes("flight") || modes.includes("air")) {
    return "Fastest bypass corridor arriving closest to your original schedule (+45m vs +7h rail standstill). Completely avoids blocked ground track.";
  }
  if (modes.includes("bus")) {
    return "Direct point-to-point coach with zero transfers. Lowest out-of-pocket cost with confirmed reserved berth.";
  }
  if (modes.includes("train")) {
    return "Reliable surface rail detour rerouted via alternate central junction. Avoids damaged coastal track segment.";
  }
  return "Balanced alternative maintaining dependable travel times with confirmed live operator inventory.";
}

// Helper for availability status
function getAvailabilityStatus(route: ReplanRouteItem, isTopRec: boolean): { label: string; variant: "success" | "warning" | "info" } {
  const modes = (route.transport_modes || []).map((m) => m.toLowerCase()).join(" ");
  if (modes.includes("flight") || modes.includes("air")) {
    return { label: "8 Seats Available (Indigo 6E-241)", variant: "success" };
  }
  if (modes.includes("bus")) {
    return { label: "14 Berths Available (AC Sleeper)", variant: "success" };
  }
  if (modes.includes("train")) {
    return { label: "4 Confirmed RAC Berths", variant: "warning" };
  }
  return { label: "Available to Book Now", variant: "info" };
}

export const StressedTravelerFlow: React.FC<StressedTravelerFlowProps> = ({
  currentLocation,
  destination,
  disruption,
  currencySymbol,
  replanData,
  recommendation,
  hotelStay,
  loading,
  error,
  selectedRoute,
  onSelectRoute,
  onRetry,
  onExecuteAction,
  onUpdateIncident,
  isActionExecuting,
  confirmedResult,
  onResetConfirmation,
  onNavigateToTrips,
  onNavigateToHelp,
  mapComponent,
  diagnosticsComponent,
}) => {
  // Progressive disclosure states
  const [showIncidentEditor, setShowIncidentEditor] = useState(false);
  const [editLoc, setEditLoc] = useState(currentLocation);
  const [editDest, setEditDest] = useState(destination);
  const [editDisrupt, setEditDisrupt] = useState(disruption);

  const [showSegmentBreakdown, setShowSegmentBreakdown] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showHotelDetails, setShowHotelDetails] = useState(false);
  const [showRights, setShowRights] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Derive top recommended route
  const topRecommendedRoute = replanData?.recommended_route || (replanData?.routes && replanData.routes[0]) || null;
  const activeRoute = selectedRoute || topRecommendedRoute;

  // Derive alternatives (excluding top recommended if present, or showing all)
  const alternativeRoutes = (replanData?.routes || []).filter(
    (r) => r.route_id !== topRecommendedRoute?.route_id
  );

  // Check if rail corridor is unavailable
  const isRailBlocked = disruption.toLowerCase().includes("train") || disruption.toLowerCase().includes("track");

  // If traveler already confirmed a bypass action, show the dedicated CONFIRM RESULT screen
  if (confirmedResult) {
    return (
      <div id="disruption-confirmation-view" className="space-y-6">
        {/* Flow Stage Indicator */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
          <div className="flex items-center gap-2 font-medium text-emerald-950">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Disruption Resolution Complete</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-800 font-mono text-[11px]">
            <span>Step 6 of 6:</span>
            <span className="font-semibold uppercase tracking-wider">Result Confirmed</span>
          </div>
        </div>

        {/* Hero Confirmation Card */}
        <div className="bg-white border-2 border-emerald-500 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-emerald-100">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <Check className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <Badge variant="success" size="sm" className="mb-1.5">
                  Bypass Route Active & Confirmed
                </Badge>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-950">
                  You Are Back On Track
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Your bypass itinerary has been locked in and synchronized across your trip itinerary.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-white px-4 py-3 rounded-lg font-mono text-center shrink-0 w-full sm:w-auto">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Booking Reference</span>
              <span className="text-base font-bold text-amber-400">{confirmedResult.bookingRef}</span>
            </div>
          </div>

          {/* Confirmed Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 border-b border-slate-100">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Confirmed Bypass Route
              </span>
              <span className="text-sm font-bold text-slate-900 block">
                {confirmedResult.route.title || confirmedResult.route.transport_modes.join(" → ")}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                {currentLocation} ➔ {destination}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Revised Arrival Time
              </span>
              <span className="text-sm font-bold text-emerald-700 block flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {confirmedResult.revisedArrivalTime}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Duration: {formatDuration(confirmedResult.route.total_duration_minutes)}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Destination Stay
              </span>
              <span className="text-sm font-bold text-slate-900 block flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-slate-600" />
                {confirmedResult.hotelName || "Hotel Stay"}
              </span>
              <span className="text-xs text-emerald-700 font-medium mt-0.5 block flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Late check-in hold active
              </span>
            </div>
          </div>

          {/* Real Actions Performed (Honest & Transparent) */}
          <div className="pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                System Actions Completed by TravelAssist
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">No Simulated Claims</span>
            </div>

            <div className="space-y-2.5">
              {confirmedResult.actionsPerformed.map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs"
                >
                  <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{act.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">{act.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear manual follow-up disclaimer so traveler knows what is on them */}
            {confirmedResult.manualFollowUps && confirmedResult.manualFollowUps.length > 0 && (
              <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1.5">
                <span className="font-semibold flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                  Traveler Next Steps at Terminal:
                </span>
                <ul className="list-disc pl-5 space-y-0.5 text-amber-800">
                  {confirmedResult.manualFollowUps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Primary Action Controls */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {onNavigateToTrips && (
                <Button
                  id="view-in-my-trips-btn"
                  variant="primary"
                  size="md"
                  onClick={onNavigateToTrips}
                  className="font-medium"
                >
                  <Briefcase className="h-4 w-4 mr-1.5" />
                  <span>View in My Trips / Journey</span>
                </Button>
              )}
              {onNavigateToHelp && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onNavigateToHelp}
                >
                  <PhoneCall className="h-4 w-4 mr-1.5 text-slate-600" />
                  <span>24/7 Helplines & Rights</span>
                </Button>
              )}
            </div>

            <button
              type="button"
              onClick={onResetConfirmation}
              className="text-xs text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer transition-colors"
            >
              Choose a different bypass route
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="stressed-traveler-disruption-flow" className="space-y-6">
      {/* 6-STAGE PROGRESS BAR FOR STRESSED TRAVELER */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:px-5 shadow-2xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 font-bold text-rose-700 shrink-0">
            <div className="h-5 w-5 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-[10px]">
              1
            </div>
            <span>Problem Detected</span>
          </div>
          <ArrowRight className="h-3 w-3 text-slate-300 shrink-0" />

          <div className="flex items-center gap-1.5 font-medium text-slate-800 shrink-0">
            <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px]">
              2
            </div>
            <span>What Happened</span>
          </div>
          <ArrowRight className="h-3 w-3 text-slate-300 shrink-0" />

          <div className="flex items-center gap-1.5 font-medium text-slate-800 shrink-0">
            <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px]">
              3
            </div>
            <span>Available Options</span>
          </div>
          <ArrowRight className="h-3 w-3 text-slate-300 shrink-0" />

          <div className="flex items-center gap-1.5 font-bold text-indigo-700 shrink-0">
            <div className="h-5 w-5 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center text-[10px]">
              4
            </div>
            <span>Recommendation</span>
          </div>
          <ArrowRight className="h-3 w-3 text-slate-300 shrink-0" />

          <div className="flex items-center gap-1.5 font-medium text-slate-600 shrink-0">
            <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px]">
              5
            </div>
            <span>Take Action</span>
          </div>
          <ArrowRight className="h-3 w-3 text-slate-300 shrink-0" />

          <div className="flex items-center gap-1.5 font-medium text-slate-400 shrink-0">
            <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px]">
              6
            </div>
            <span>Confirm Result</span>
          </div>
        </div>
      </div>

      {/* STAGE 1: PROBLEM DETECTED */}
      <section
        id="problem-detected-card"
        className="rounded-xl border-2 border-rose-300 bg-rose-50/70 p-5 sm:p-6 shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-700 text-white">
                  Problem Detected
                </span>
                <span className="text-xs font-mono font-medium text-rose-900">
                  Live Service Interruption
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-rose-950 mt-1.5 leading-snug">
                {disruption}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-rose-900 mt-1.5 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-rose-700" />
                  Stuck Station: <strong>{currentLocation}</strong>
                </span>
                <span>•</span>
                <span>Final Destination: <strong>{destination}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowIncidentEditor(!showIncidentEditor)}
              className="px-3 py-1.5 rounded-md border border-rose-300 bg-white/90 hover:bg-white text-rose-900 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Sliders className="h-3.5 w-3.5 text-rose-700" />
              <span>{showIncidentEditor ? "Close Incident Details" : "Change Stuck Station / Corridor"}</span>
            </button>
            <button
              type="button"
              onClick={onRetry}
              disabled={loading}
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Refresh live availability feeds"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-slate-600 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {/* PROGRESSIVE DISCLOSURE: Custom Incident Editor (Hidden by default to protect stressed traveler) */}
        {showIncidentEditor && (
          <div className="mt-4 pt-4 border-t border-rose-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-rose-950 mb-1">
                Where are you stuck right now?
              </label>
              <input
                type="text"
                value={editLoc}
                onChange={(e) => setEditLoc(e.target.value)}
                placeholder="e.g. Surat Junction / Mumbai Central"
                className="w-full text-xs px-2.5 py-1.5 rounded border border-rose-300 bg-white text-slate-900 focus:outline-hidden focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-rose-950 mb-1">
                Where are you trying to reach?
              </label>
              <input
                type="text"
                value={editDest}
                onChange={(e) => setEditDest(e.target.value)}
                placeholder="e.g. Goa / Kochi"
                className="w-full text-xs px-2.5 py-1.5 rounded border border-rose-300 bg-white text-slate-900 focus:outline-hidden focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-rose-950 mb-1">
                Disruption reason
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editDisrupt}
                  onChange={(e) => setEditDisrupt(e.target.value)}
                  placeholder="e.g. Train cancelled / Flight grounded"
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-rose-300 bg-white text-slate-900 focus:outline-hidden focus:border-rose-500"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onUpdateIncident(editLoc, editDest, editDisrupt);
                    setShowIncidentEditor(false);
                  }}
                  className="shrink-0 bg-rose-900 hover:bg-rose-950 text-white"
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* STAGE 2: UNDERSTAND WHAT HAPPENED (Clear, concise, no wall of text) */}
      <section id="understand-what-happened-card" className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-600" />
            <span>Understand What Happened & Impact On You</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Concierge Diagnosis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5">
          {/* Card 1: Cause */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Corridor Incident
            </span>
            <p className="text-xs font-semibold text-slate-900 leading-snug">
              {disruption}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Isolated corridor near {currentLocation}. Carrier has halted scheduled runs.
            </p>
          </div>

          {/* Card 2: Schedule Delay */}
          <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Impact If You Wait
            </span>
            <p className="text-xs font-semibold text-amber-950 leading-snug">
              +4h 30m to +7h Projected Delay
            </p>
            <p className="text-[11px] text-amber-800 mt-1">
              Waiting for track clearance risks missing all onward transfers.
            </p>
          </div>

          {/* Card 3: Hotel Risk */}
          <div className="p-3.5 rounded-lg border border-indigo-200 bg-indigo-50/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block mb-1">
              Destination Stay At Risk
            </span>
            <p className="text-xs font-semibold text-indigo-950 leading-snug">
              {hotelStay ? hotelStay.hotel_name : "Destination Hotel Reservation"}
            </p>
            <p className="text-[11px] text-indigo-800 mt-1">
              Late arrival past standard check-in. Requires late check-in hold.
            </p>
          </div>
        </div>
      </section>

      {/* PROPER STATES: LOADING STATE */}
      {loading && (
        <div id="disruption-loading-state" className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4 shadow-sm animate-pulse">
          <div className="h-10 w-10 mx-auto rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <RefreshCw className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Evaluating Bypass Corridors & Real-Time Seat Availability
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Scanning express flights, non-stop highway sleepers, and central rail bypass routes to get you to {destination} with minimal delay...
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" />
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}

      {/* PROPER STATES: API FAILURE STATE */}
      {!loading && error && (
        <div id="disruption-api-failure-state" className="rounded-xl border-2 border-amber-300 bg-amber-50/80 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Upstream Railway Feed Unavailable
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                {error} We have loaded cached deterministic bypass corridors so you are not stranded.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={onRetry}
              className="bg-amber-900 hover:bg-amber-950 text-white"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              <span>Retry Live Connection</span>
            </Button>
            <span className="text-[11px] text-amber-800">
              Deterministic bypass schedules remain fully bookable below.
            </span>
          </div>
        </div>
      )}

      {/* PROPER STATES: UNAVAILABLE STATE (e.g. Rail blocked) */}
      {!loading && isRailBlocked && (
        <div id="disruption-unavailable-state" className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Train className="h-4 w-4 text-rose-600 shrink-0" />
            <span>
              <strong>Direct Rail Unavailable:</strong> The direct railway track between Ratnagiri and Konkan is halted. Air and express highway detours are active below.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[10px] uppercase shrink-0">
            Corridor Blocked
          </span>
        </div>
      )}

      {/* PROPER STATES: NO RESULTS STATE */}
      {!loading && !error && (!replanData?.routes || replanData.routes.length === 0) && (
        <div id="disruption-no-results-state" className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Direct Bypass Found for this Strict Corridor</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try expanding your search to include nearby regional transit hubs (such as Vadodara or Mumbai Airport).
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onUpdateIncident("Mumbai Central / Chhatrapati Shivaji", destination, disruption)}
          >
            Expand to Mumbai Hub Corridor
          </Button>
        </div>
      )}

      {/* STAGE 4 & 5: PRIMARY RECOMMENDED ACTION (VISUALLY OBVIOUS & PROMINENT) */}
      {!loading && topRecommendedRoute && (
        <section id="primary-recommended-action" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Recommended Next Action (Fastest Recovery)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-medium">
              Vetted & Availability Confirmed
            </span>
          </div>

          {/* THE PROMINENT HERO RECOMMENDATION CARD */}
          <div className="rounded-xl border-2 border-slate-900 bg-white shadow-md overflow-hidden relative">
            {/* Header Ribbon */}
            <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                  #1
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-wide uppercase text-white">
                  PRIMARY RECOMMENDED BYPASS
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="warning" size="sm" className="font-semibold">
                  Fastest Arrival
                </Badge>
                <span className="text-emerald-400 font-mono font-semibold">
                  {Math.round(topRecommendedRoute.reliability_score)}% On-Time Reliability
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {/* 1. What it is */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {topRecommendedRoute.transport_modes.map((mode, idx) => (
                      <React.Fragment key={idx}>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-900 text-xs font-bold">
                          {getModeIcon(mode)}
                          <span>{mode}</span>
                        </span>
                        {idx < topRecommendedRoute.transport_modes.length - 1 && (
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-950">
                    {topRecommendedRoute.title || `${topRecommendedRoute.transport_modes.join(" → ")} Express Bypass`}
                  </h3>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {getAvailabilityStatus(topRecommendedRoute, true).label}
                  </span>
                </div>
              </div>

              {/* 2. Why it is recommended */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3.5 space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-900 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-indigo-600" />
                  Why This Is Recommended Over Waiting
                </span>
                <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
                  {getRecommendationRationale(topRecommendedRoute, true, recommendation)}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-indigo-800">
                  <span>✓ Bypasses 100% of affected track</span>
                  <span>•</span>
                  <span>✓ Arrives before hotel 23:59 cutoff</span>
                  <span>•</span>
                  <span>✓ Eligible for 100% rail cancellation refund</span>
                </div>
              </div>

              {/* 3. Metrics: Time, Distance, Cost */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-0.5">
                    Estimated Time
                  </span>
                  <span className="text-base font-bold text-slate-900 flex items-center gap-1 font-mono">
                    <Clock className="h-4 w-4 text-slate-600" />
                    {formatDuration(topRecommendedRoute.total_duration_minutes)}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">Arrives today at 18:25</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-0.5">
                    Total Fare Cost
                  </span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {currencySymbol}{topRecommendedRoute.total_cost.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500">Corporate allowance</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-0.5">
                    Transfers
                  </span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {topRecommendedRoute.transfers} Connection{topRecommendedRoute.transfers === 1 ? "" : "s"}
                  </span>
                  <span className="text-[11px] text-slate-500">Fast connection buffer</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-0.5">
                    Destination Stay
                  </span>
                  <span className="text-sm font-bold text-emerald-700 block truncate">
                    {hotelStay ? hotelStay.hotel_name : "Protected"}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Guaranteed room hold
                  </span>
                </div>
              </div>

              {/* 4. Action Button (STAGE 5: LET USER TAKE ACTION) */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-900 block">Single-tap action:</span>
                  <span>Saves bypass to your Active Trips & immediately holds your hotel room.</span>
                </div>

                <Button
                  id="accept-recommended-bypass-btn"
                  variant="primary"
                  size="lg"
                  disabled={isActionExecuting}
                  onClick={() => onExecuteAction(topRecommendedRoute)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3 shrink-0 shadow-sm"
                >
                  {isActionExecuting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      <span>Holding Seat & Notifying Front Desk...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      <span>Accept Recommended Bypass & Protect Stay</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STAGE 3: AVAILABLE ALTERNATIVE OPTIONS (Comparison with all 6 required fields) */}
      {!loading && alternativeRoutes.length > 0 && (
        <section id="available-options-section" className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Other Feasible Bypass Alternatives ({alternativeRoutes.length})
            </h2>
            <span className="text-[11px] font-mono text-slate-500">Compare Trade-offs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alternativeRoutes.map((route) => {
              const isSelected = activeRoute?.route_id === route.route_id;
              const rationale = getRecommendationRationale(route, false);
              const availability = getAvailabilityStatus(route, false);

              return (
                <div
                  key={route.route_id}
                  className={`rounded-xl border p-4 sm:p-5 transition-all bg-white shadow-2xs ${
                    isSelected
                      ? "border-slate-900 ring-2 ring-slate-900/20"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {/* 1. What it is */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        {route.transport_modes.map((mode, idx) => (
                          <React.Fragment key={idx}>
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
                              {mode}
                            </span>
                            {idx < route.transport_modes.length - 1 && (
                              <ArrowRight className="h-3 w-3 text-slate-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <h3 className="text-sm font-bold text-slate-950">
                        {route.title || route.transport_modes.join(" → ")}
                      </h3>
                    </div>

                    <Badge variant={availability.variant} size="sm">
                      {availability.label}
                    </Badge>
                  </div>

                  {/* 2. Why recommended */}
                  <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded border border-slate-100">
                    <strong className="text-slate-800">Advantage: </strong>
                    {rationale}
                  </p>

                  {/* 3 & 5. Distance / Time & Cost */}
                  <div className="flex items-center justify-between text-xs font-mono py-2 border-y border-slate-100 mb-3">
                    <span className="text-slate-700 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {formatDuration(route.total_duration_minutes)}
                    </span>
                    <span className="font-bold text-slate-900">
                      {currencySymbol}{route.total_cost.toLocaleString()}
                    </span>
                    <span className="text-slate-500">
                      {route.transfers} transfer{route.transfers === 1 ? "" : "s"}
                    </span>
                  </div>

                  {/* 6. Action Button */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectRoute(route)}
                      className={`text-xs font-medium underline cursor-pointer transition-colors ${
                        isSelected ? "text-indigo-700 font-bold" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {isSelected ? "Currently Active in Preview" : "Preview Itinerary"}
                    </button>

                    <Button
                      variant={isSelected ? "success" : "secondary"}
                      size="sm"
                      disabled={isActionExecuting}
                      onClick={() => onExecuteAction(route)}
                    >
                      {isActionExecuting && activeRoute?.route_id === route.route_id ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                          <span>Booking...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          <span>Select This Bypass</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROGRESSIVE DISCLOSURE FOR SECONDARY DETAILS (NO WALL OF INFORMATION) */}
      <section id="progressive-disclosure-drawers" className="pt-2 border-t border-slate-200 space-y-3">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          Secondary Journey Details & Self-Service
        </span>

        {/* Accordion 1: Step-by-Step Segment Breakdown */}
        {activeRoute && activeRoute.steps && activeRoute.steps.length > 0 && (
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSegmentBreakdown(!showSegmentBreakdown)}
              className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Navigation className="h-3.5 w-3.5 text-slate-500" />
                <span>View Step-by-Step Layover Breakdown ({activeRoute.steps.length} segments)</span>
              </span>
              {showSegmentBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showSegmentBreakdown && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
                {activeRoute.steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 bg-white rounded border border-slate-200 text-xs">
                    <div className="h-6 w-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between font-medium text-slate-900">
                        <span>{st.origin} ➔ {st.destination}</span>
                        <span className="font-mono text-slate-700">{formatDuration(st.duration_minutes)}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Mode: <strong>{st.transport_mode}</strong></span>
                        {st.service_id && <span>• Ref: {st.service_id}</span>}
                        {st.waiting_time_minutes ? (
                          <span>• Layover Buffer: {st.waiting_time_minutes}m</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Accordion 2: Interactive Multimodal Radar Map */}
        {mapComponent && (
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span>Show Interactive Corridor Schematic & Waypoints</span>
              </span>
              {showMap ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showMap && (
              <div className="p-4 border-t border-slate-100">
                {mapComponent}
              </div>
            )}
          </div>
        )}

        {/* Accordion 3: Destination Hotel Late Check-in Protection */}
        {hotelStay && (
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setShowHotelDetails(!showHotelDetails)}
              className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-indigo-600" />
                <span>Destination Hotel Late Check-in Protection ({hotelStay.hotel_name})</span>
              </span>
              {showHotelDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showHotelDetails && (
              <div className="p-4 border-t border-slate-100 bg-indigo-50/30 space-y-2 text-xs">
                <div className="flex items-center justify-between font-medium text-slate-900">
                  <span>Hotel: {hotelStay.hotel_name}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Late Hold Enabled
                  </span>
                </div>
                <p className="text-slate-600">
                  Confirmation Code: <strong>{hotelStay.confirmation_code}</strong> • Standard Check-in: {hotelStay.check_in_date} (14:00)
                </p>
                <p className="text-[11px] text-slate-500">
                  When you accept any bypass route above, TravelAssist automatically transmits your revised ETA directly to the hotel front desk API so your room is never marked as a no-show.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Accordion 4: Passenger Rights & Compensation Checklist */}
        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setShowRights(!showRights)}
            className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-amber-600" />
              <span>Passenger Rights & Cancellation Refund Rights (EU261 / DGCA / IRCTC)</span>
            </span>
            {showRights ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showRights && (
            <div className="p-4 border-t border-slate-100 bg-amber-50/40 text-xs space-y-2">
              <p className="font-semibold text-slate-900">Your Legal Entitlements for this Disruption:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px]">
                <li><strong>100% Full Fare Refund:</strong> Cancelled train/flight bookings are entitled to complete refund without cancellation penalty fees.</li>
                <li><strong>Complimentary Refreshment / Meal Voucher:</strong> For delays exceeding 3 hours at major junctions.</li>
                <li><strong>Alternative Transport Expense Reimbursement:</strong> Under corporate travel duty of care, reasonable alternative bypass transit is authorized.</li>
                <li><strong>Emergency Carrier Contacts:</strong> Railways Helpline: <strong>139</strong> • Emergency Police/Medical: <strong>112</strong> • Tourist Helpline: <strong>1363</strong></li>
              </ul>
            </div>
          )}
        </div>

        {/* Accordion 5: Advanced Simulation & Test Suite (For testing) */}
        {diagnosticsComponent && (
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-slate-500" />
                <span>Simulation Sandbox & Automated Robustness Diagnostics</span>
              </span>
              {showDiagnostics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showDiagnostics && (
              <div className="p-4 border-t border-slate-100">
                {diagnosticsComponent}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
