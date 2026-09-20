import React, { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Sparkles,
  Train,
  Car,
  Plane,
  Bus,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ChevronRight,
  Layers,
  MapPin,
  HelpCircle,
  Zap,
  Split,
  Timer,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { ReplanApiResponse, ReplanRouteItem, OriginalJourneyInfo } from "../../types";
import { Card, Badge } from "../ui/design-system";

export interface BeforeAfterJourneyProps {
  replanData: ReplanApiResponse | null;
  selectedRoute: ReplanRouteItem | null;
  currentLocation: string;
  destination: string;
  disruption: string;
}

export const BeforeAfterJourney: React.FC<BeforeAfterJourneyProps> = ({
  replanData,
  selectedRoute,
  currentLocation,
  destination,
  disruption,
}) => {
  const [viewMode, setViewMode] = useState<"side-by-side" | "diff">("side-by-side");

  const effectiveRoute = selectedRoute || replanData?.recommended_route;

  // Pre-disruption original journey reference (defaults to 8h 30m, ₹1,500)
  const originalJourney: OriginalJourneyInfo = replanData?.original_journey || {
    service_id: "TR123",
    service_name: "Mandovi Express #10103",
    transport_mode: "Train",
    origin: currentLocation || "Mumbai",
    destination: destination || "Goa",
    departure_time: "07:10 AM",
    arrival_time: "03:40 PM",
    duration_minutes: 510, // 8h 30m
    cost: 1500, // ₹1,500
    status: "CANCELLED / DISRUPTED",
    original_ticket: "Confirmed AC-3 Tier Berth B3-42",
  };

  // Metrics
  const hasRoute = Boolean(effectiveRoute);
  const originalDuration = originalJourney.duration_minutes || 510;
  const newDuration = effectiveRoute?.total_duration_minutes ?? 0;

  const originalCost = originalJourney.cost || 1500;
  const newCost = effectiveRoute?.total_cost ?? 0;

  // Time delta (positive = time saved)
  const timeDifferenceMinutes = hasRoute ? originalDuration - newDuration : 0;
  const isTimeSaved = hasRoute && timeDifferenceMinutes > 0;
  const absTimeDiff = Math.abs(timeDifferenceMinutes);
  const timeDiffHours = Math.floor(absTimeDiff / 60);
  const timeDiffMins = absTimeDiff % 60;

  // Additional cost
  const additionalCost = hasRoute ? newCost - originalCost : 0;

  // Reason for change
  let reasonForChange = "Service disrupted due to corridor incident; rerouted via multi-modal contingency path to prevent journey termination.";
  if (disruption.toUpperCase().includes("TRAIN")) {
    reasonForChange = "Primary train cancelled due to track derailment & signal failure on rail corridor. Rerouted via multimodal Air Express corridor.";
  } else if (disruption.toUpperCase().includes("FLIGHT")) {
    reasonForChange = "Aviation departure grounded by severe weather and airport radar outage. Re-routed via semi-high speed rail.";
  } else if (disruption.toUpperCase().includes("BUS")) {
    reasonForChange = "Interstate bus corridor suspended due to transport strike. Bypassed via fast intercity air connection.";
  } else if (disruption.toUpperCase().includes("ROAD")) {
    reasonForChange = "National highway blocked by landslide on mountain pass. Shifted passengers to scheduled rail corridors.";
  } else if (disruption.toUpperCase().includes("METRO")) {
    reasonForChange = "Urban metro station closed due to flash waterlogging. Transferred to on-demand surface cab feeder.";
  }

  return (
    <Card
      id="before-after-journey-card"
      variant="default"
      padding="none"
      className="overflow-hidden"
    >
      {/* 1. HEADER BANNER */}
      <div className="bg-slate-900 text-white px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Autonomous Journey Evolution
              </span>
              <Badge variant="neutral" size="sm" className="bg-slate-800 text-slate-300 border-slate-700">
                Live State
              </Badge>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-white">
              Before / After Journey Visualization
            </h2>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("side-by-side")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              viewMode === "side-by-side"
                ? "bg-slate-900 text-white shadow-2xs font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Side-by-Side Flow
          </button>
          <button
            type="button"
            onClick={() => setViewMode("diff")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              viewMode === "diff"
                ? "bg-slate-900 text-white shadow-2xs font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Metric Comparison Diff
          </button>
        </div>
      </div>

      {/* 2. METRIC STAT BAR */}
      <div className="bg-slate-50/80 border-b border-border p-3.5 sm:p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: Original Journey */}
          <div className="bg-white rounded-lg border border-border p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Original Journey
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-semibold text-slate-800 font-mono">
                {Math.floor(originalDuration / 60)}h {originalDuration % 60}m
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ₹{originalCost.toLocaleString()}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block truncate">
              {originalJourney.service_name}
            </span>
          </div>

          {/* Card 2: New Recommended Journey */}
          <div className="bg-emerald-50/60 rounded-lg border border-emerald-200 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 block">
                New Recommended
              </span>
              <span className="text-[9px] font-semibold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                Autonomous
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-semibold text-emerald-950 font-mono">
                {Math.floor(newDuration / 60)}h {newDuration % 60}m
              </span>
              <span className="text-xs text-emerald-800 font-mono">
                ₹{newCost.toLocaleString()}
              </span>
            </div>
            <span className="text-[11px] text-emerald-800 mt-0.5 block truncate font-medium">
              {effectiveRoute?.title || "Air Express Direct Link"}
            </span>
          </div>

          {/* Card 3: Time Saved */}
          <div
            className={`rounded-lg border p-3 ${
              isTimeSaved
                ? "bg-amber-50/60 border-amber-200"
                : "bg-slate-100/70 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider block ${
                  isTimeSaved ? "text-amber-800" : "text-slate-600"
                }`}
              >
                Time Saved
              </span>
              {isTimeSaved ? (
                <TrendingDown className="h-3.5 w-3.5 text-amber-700" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-slate-500" />
              )}
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span
                className={`text-base sm:text-lg font-semibold font-mono ${
                  hasRoute ? (isTimeSaved ? "text-amber-950" : "text-slate-800") : "text-slate-500"
                }`}
              >
                {!hasRoute
                  ? "N/A"
                  : isTimeSaved
                  ? `${timeDiffHours}h ${timeDiffMins}m`
                  : `+${timeDiffHours}h ${timeDiffMins}m`}
              </span>
              <span className="text-[10px] font-semibold uppercase text-amber-800">
                {!hasRoute ? "severed" : isTimeSaved ? "saved" : "extra"}
              </span>
            </div>
            <span className="text-[11px] text-amber-900/80 mt-0.5 block">
              {!hasRoute ? "Corridor closed" : isTimeSaved ? "Faster arrival" : "Transit buffer"}
            </span>
          </div>

          {/* Card 4: Additional Cost */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-700 block">
                Additional Cost
              </span>
              <TrendingUp className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-semibold text-slate-900 font-mono">
                {!hasRoute
                  ? "₹0"
                  : additionalCost >= 0
                  ? `₹${additionalCost.toLocaleString()}`
                  : `-₹${Math.abs(additionalCost).toLocaleString()}`}
              </span>
              <span className="text-[10px] font-semibold uppercase text-slate-600">
                {!hasRoute ? "refund" : additionalCost >= 0 ? "fare diff" : "saved"}
              </span>
            </div>
            <span className="text-[11px] text-slate-600 mt-0.5 block">
              {!hasRoute ? "Full ticket refund" : "Direct emergency fare"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: SIDE-BY-SIDE OR DIFF */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* REASON FOR CHANGE BANNER */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Zap className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 block">
                Reason for Change
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-900 mt-0.5">
                {reasonForChange}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Disruption Event
            </span>
            <span className="text-xs font-mono font-semibold text-rose-700 uppercase">
              {disruption}
            </span>
          </div>
        </div>

        {viewMode === "side-by-side" ? (
          /* SIDE-BY-SIDE MODE */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
            {/* COLUMN 1: BEFORE DISRUPTION */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between relative">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                        Original Route
                      </span>
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-900">Before Disruption</h3>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-semibold text-slate-800 block">
                      {Math.floor(originalDuration / 60)}h {originalDuration % 60}m
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      ₹{originalCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="py-2 flex flex-col items-center space-y-2">
                  {/* Origin */}
                  <div className="w-full max-w-sm bg-white rounded-md border border-slate-200 p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      <div>
                        <span className="text-[9px] font-semibold uppercase text-slate-400 block">Origin</span>
                        <div className="text-xs font-semibold text-slate-900">{currentLocation || "Mumbai"}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">07:10 AM</span>
                  </div>

                  <ArrowDown className="h-3.5 w-3.5 text-slate-400" />

                  {/* Leg: Train */}
                  <div className="w-full max-w-sm bg-rose-50/80 rounded-md border border-rose-200 p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <Train className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-rose-950 flex items-center gap-1.5">
                          <span className="line-through">Train</span>
                          <span className="text-[11px] text-rose-700 font-normal">({originalJourney.service_name})</span>
                        </div>
                        <span className="text-[10px] text-rose-700">
                          ⚠ Derailed / Inoperative
                        </span>
                      </div>
                    </div>
                    <Badge variant="error" size="sm">Cancelled</Badge>
                  </div>

                  <ArrowDown className="h-3.5 w-3.5 text-slate-400" />

                  {/* Destination */}
                  <div className="w-full max-w-sm bg-white rounded-md border border-slate-200 p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      <div>
                        <span className="text-[9px] font-semibold uppercase text-slate-400 block">Destination</span>
                        <div className="text-xs font-semibold text-slate-900">{destination || "Goa"}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-rose-600 line-through">
                      03:40 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Direct single-leg rail route</span>
                <span className="font-semibold text-rose-700">Journey Interrupted</span>
              </div>
            </div>

            {/* COLUMN 2: AFTER DISRUPTION */}
            <div className={`rounded-lg border p-4 flex flex-col justify-between ${
              hasRoute ? "border-emerald-200 bg-emerald-50/20" : "border-amber-200 bg-amber-50/20"
            }`}>
              <div className="space-y-3">
                <div className={`flex items-center justify-between border-b pb-2.5 ${
                  hasRoute ? "border-emerald-200" : "border-amber-200"
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded text-white flex items-center justify-center font-bold text-xs ${
                      hasRoute ? "bg-emerald-600" : "bg-amber-600"
                    }`}>
                      2
                    </span>
                    <div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider block ${
                        hasRoute ? "text-emerald-700" : "text-amber-700"
                      }`}>
                        {hasRoute ? "New Route" : "Corridor Status"}
                      </span>
                      <h3 className={`text-xs sm:text-sm font-semibold ${
                        hasRoute ? "text-emerald-950" : "text-amber-950"
                      }`}>
                        {hasRoute ? "After Disruption" : "Holding Protocol"}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className={`text-xs font-semibold block ${
                      hasRoute ? "text-emerald-900" : "text-amber-900"
                    }`}>
                      {hasRoute ? `${Math.floor(newDuration / 60)}h ${newDuration % 60}m` : "Suspended"}
                    </span>
                    <span className={`text-[11px] block ${
                      hasRoute ? "text-emerald-700" : "text-amber-700"
                    }`}>
                      {hasRoute ? `₹${newCost.toLocaleString()}` : "100% Refundable"}
                    </span>
                  </div>
                </div>

                {!hasRoute ? (
                  <div className="p-3.5 rounded-md bg-white border border-amber-200 space-y-1.5 text-center my-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mx-auto" />
                    <h4 className="text-xs font-semibold text-amber-950">No Viable Outbound Route Cleared</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      All scheduled rail, road, and air connections are severed. Station welfare teams are providing lounge accommodations and zero-fee rebooking.
                    </p>
                  </div>
                ) : (
                  <div className="py-2 flex flex-col items-center space-y-1.5">
                    {/* Step 1: Origin */}
                    <div className="w-full max-w-sm bg-white rounded-md border border-slate-200 p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        <div>
                          <span className="text-[9px] font-semibold uppercase text-slate-400 block">Origin</span>
                          <span className="text-xs font-semibold text-slate-900">{currentLocation || "Mumbai Central"}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-medium">Immediate Dispatch</span>
                    </div>

                    <ArrowDown className="h-3.5 w-3.5 text-slate-400" />

                    {/* Step 2: Taxi */}
                    <div className="w-full max-w-sm bg-white border border-slate-200 rounded-md p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center">
                          <Car className="h-3 w-3" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-900 block">Taxi</span>
                          <span className="text-[10px] text-slate-500">Uber Premier Airport Feeder</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-700 font-medium">45m • ₹650</span>
                    </div>

                    <ArrowDown className="h-3.5 w-3.5 text-slate-400" />

                    {/* Step 3: Airport */}
                    <div className="w-full max-w-sm bg-white rounded-md border border-slate-200 p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                        <div>
                          <span className="text-[9px] font-semibold uppercase text-slate-500 block">Hub Transfer</span>
                          <span className="text-xs font-semibold text-slate-900">Airport (BOM Terminal 2)</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-600 font-medium">Fast Baggage Drop</span>
                    </div>

                    <ArrowDown className="h-3.5 w-3.5 text-slate-400" />

                    {/* Step 4: Flight */}
                    <div className="w-full max-w-sm bg-white border border-slate-200 rounded-md p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center">
                          <Plane className="h-3 w-3" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-900 block">Flight</span>
                          <span className="text-[10px] text-slate-500">Air India AI-667 (BOM → GOX)</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-700 font-medium">70m • ₹3,890</span>
                    </div>

                    <ArrowDown className="h-3.5 w-3.5 text-slate-400" />

                    {/* Step 5: Taxi */}
                    <div className="w-full max-w-sm bg-white border border-slate-200 rounded-md p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center">
                          <Car className="h-3 w-3" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-900 block">Taxi</span>
                          <span className="text-[10px] text-slate-500">Goa Miles Airport Prepaid Cab</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-700 font-medium">60m • ₹660</span>
                    </div>

                    <ArrowDown className="h-3.5 w-3.5 text-slate-400" />

                    {/* Step 6: Goa */}
                    <div className="w-full max-w-sm bg-emerald-50/80 border border-emerald-300 rounded-md p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                        <div>
                          <span className="text-[9px] font-semibold uppercase text-emerald-800 block">Final Destination</span>
                          <span className="text-xs font-semibold text-emerald-950">{destination || "Goa"}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        On-Time Arrival
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between font-medium ${
                hasRoute ? "border-emerald-200 text-emerald-800" : "border-amber-200 text-amber-800"
              }`}>
                <span>{hasRoute ? "Door-to-door multi-modal continuity" : "Passenger welfare protocol"}</span>
                <span className={`font-semibold ${hasRoute ? "text-emerald-900" : "text-amber-900"}`}>
                  {hasRoute ? "Active Guidance" : "Holding Pattern Active"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* METRIC COMPARISON DIFF MODE */
          <div className="bg-slate-50 border border-border rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Split className="h-4 w-4 text-slate-700" />
              Side-by-Side Impact Matrix
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-2 px-3">Journey Parameter</th>
                    <th className="py-2 px-3">Original Route</th>
                    <th className="py-2 px-3">New Recommended Route</th>
                    <th className="py-2 px-3">Autonomous Variance (Delta)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">Total Duration</td>
                    <td className="py-2.5 px-3 text-slate-700">{Math.floor(originalDuration / 60)}h {originalDuration % 60}m</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">{Math.floor(newDuration / 60)}h {newDuration % 60}m</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">
                      {isTimeSaved ? `-${timeDiffHours}h ${timeDiffMins}m (Saved)` : `+${timeDiffHours}h ${timeDiffMins}m`}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">Total Expenditure</td>
                    <td className="py-2.5 px-3 text-slate-700">₹{originalCost.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-900 font-semibold">₹{newCost.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-700">+₹{additionalCost.toLocaleString()} (Air + Cab)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">Transit Modality</td>
                    <td className="py-2.5 px-3 font-sans text-rose-700">Single-modal Rail (Blocked)</td>
                    <td className="py-2.5 px-3 font-sans text-emerald-800 font-medium">Multi-modal (Taxi → Flight → Taxi)</td>
                    <td className="py-2.5 px-3 font-sans text-slate-700">3 Synchronized Segments</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">Disruption Status</td>
                    <td className="py-2.5 px-3 font-sans text-rose-700 font-semibold">Cancelled by Incident</td>
                    <td className="py-2.5 px-3 font-sans text-emerald-700 font-semibold">Fully Confirmed & Available</td>
                    <td className="py-2.5 px-3 font-sans text-emerald-700">Resumed with 0s Interruption</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. BOTTOM SUMMARY COMPARISON CARD */}
        <div className="bg-slate-50 border border-border rounded-lg p-3.5 flex flex-col md:flex-row items-center justify-between gap-3.5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block">
                Autonomous Journey Evolution: 3h 10m Saved via Resilient Multi-Modal Pivot
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                The agent evaluated rail corridor disruption, bypassed blocked tracks, and synthesized a <strong>Taxi → Flight → Taxi</strong> rescue route. Travel time dropped from <strong>8h 30m</strong> to <strong>5h 20m</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs shrink-0">
            <div className="bg-white border border-border px-3 py-1.5 rounded-md text-center">
              <span className="text-[9px] uppercase text-slate-500 font-semibold block">Time Saved</span>
              <span className="text-emerald-700 font-semibold">{timeDiffHours}h {timeDiffMins}m</span>
            </div>
            <div className="bg-white border border-border px-3 py-1.5 rounded-md text-center">
              <span className="text-[9px] uppercase text-slate-500 font-semibold block">Additional Cost</span>
              <span className="text-slate-800 font-semibold">₹{additionalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
