import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Ban,
  Bus,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  Flame,
  Layers,
  MapPin,
  Plane,
  RefreshCw,
  Route as RouteIcon,
  ShieldAlert,
  Sparkles,
  Star,
  Train,
  Zap,
} from "lucide-react";
import {
  SimulatorDisruptionType,
  ReplanApiResponse,
  ReplanRouteItem,
  OriginalJourneyInfo,
} from "../../types";
import { Card, Badge, Button } from "../ui/design-system";

export interface DisruptionSimulatorProps {
  onTriggerDisruption: (
    disruptionType: SimulatorDisruptionType,
    description: string,
    onProgressUpdate?: (step: "original" | "disruption" | "replanning" | "completed") => void
  ) => Promise<void>;
  isLoading: boolean;
  replanData: ReplanApiResponse | null;
  selectedRoute: ReplanRouteItem | null;
  currentLocation: string;
  destination: string;
}

export const DISRUPTION_OPTIONS: {
  type: SimulatorDisruptionType;
  label: string;
  category: string;
  defaultDescription: string;
  affectedService: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    type: "TRAIN CANCELLED",
    label: "TRAIN CANCELLED",
    category: "Rail Corridor Outage",
    defaultDescription: "Track derailment & signal breakdown on Konkan Railway. All express trains halted.",
    affectedService: "Mandovi Express (#10103 / TR123)",
    icon: Train,
  },
  {
    type: "TRAIN DELAYED",
    label: "TRAIN DELAYED",
    category: "Overhead Equipment Fault",
    defaultDescription: "Overhead power line snapped. Cascading delay of +180 minutes on rail corridor.",
    affectedService: "Vande Bharat Superfast (#20671)",
    icon: Clock,
  },
  {
    type: "BUS CANCELLED",
    label: "BUS CANCELLED",
    category: "Interstate Transit Strike",
    defaultDescription: "Interstate highway permit strike and toll operator boycott. Sleeper buses cancelled.",
    affectedService: "VRL Multi-Axle Sleeper (#VRL-552)",
    icon: Bus,
  },
  {
    type: "FLIGHT CANCELLED",
    label: "FLIGHT CANCELLED",
    category: "Airport Ground Stop",
    defaultDescription: "Monsoon turbulence and ATC radar failure at BOM Airport. Flights grounded.",
    affectedService: "Air India (AI-667 BOM → GOX)",
    icon: Plane,
  },
  {
    type: "ROAD BLOCKED",
    label: "ROAD BLOCKED",
    category: "Highway Landslide",
    defaultDescription: "Major mudslide and multiple fallen trees blocking National Highway 66 corridor.",
    affectedService: "NH66 Interstate Highway",
    icon: Ban,
  },
  {
    type: "METRO CLOSED",
    label: "METRO CLOSED",
    category: "Subway Flooding",
    defaultDescription: "Severe waterlogging at underground interchange. Metro Aqua Line suspended.",
    affectedService: "Mumbai Metro Aqua Line 3",
    icon: Layers,
  },
];

export const DisruptionSimulator: React.FC<DisruptionSimulatorProps> = ({
  onTriggerDisruption,
  isLoading,
  replanData,
  selectedRoute,
  currentLocation,
  destination,
}) => {
  const [selectedDisruption, setSelectedDisruption] = useState<SimulatorDisruptionType>("TRAIN CANCELLED");
  const [activeStep, setActiveStep] = useState<"original" | "disruption" | "replanning" | "completed">("completed");
  const [isSimulating, setIsSimulating] = useState(false);

  const currentOption = DISRUPTION_OPTIONS.find((o) => o.type === selectedDisruption) || DISRUPTION_OPTIONS[0];

  const handleTrigger = async () => {
    setIsSimulating(true);
    try {
      setActiveStep("original");
      await new Promise((r) => setTimeout(r, 450));

      setActiveStep("disruption");
      await new Promise((r) => setTimeout(r, 500));

      setActiveStep("replanning");

      await onTriggerDisruption(
        selectedDisruption,
        currentOption.defaultDescription,
        (step) => setActiveStep(step)
      );

      setActiveStep("completed");
    } finally {
      setIsSimulating(false);
    }
  };

  const originalJourney: OriginalJourneyInfo = replanData?.original_journey || {
    service_id: "TR123",
    service_name: "Mandovi Express (#10103 / TR123)",
    transport_mode: "Train",
    origin: currentLocation || "Mumbai CSMT Terminal",
    destination: destination || "Goa Madgaon (MAO)",
    departure_time: "07:10 AM",
    arrival_time: "06:45 PM",
    duration_minutes: 695,
    cost: 1250,
    status: "CANCELLED DUE TO DISRUPTION",
    original_ticket: "Confirmed AC 3-Tier Berth B3-42",
  };

  const activeRecommended = selectedRoute || replanData?.recommended_route;
  const removedServices = replanData?.removed_services || [
    currentOption.affectedService,
    "Upstream Connecting Feeder Services",
  ];

  return (
    <Card
      id="demo-disruption-simulator-panel"
      variant="default"
      padding="none"
      className="overflow-hidden"
    >
      {/* PANEL HEADER */}
      <div className="bg-slate-900 text-white px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Disruption Simulation Sandbox
              </span>
              <Badge variant="neutral" size="sm" className="bg-slate-800 text-slate-300 border-slate-700">
                Deterministic
              </Badge>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-white">
              Simulate Disruption Event
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Compass className="h-3.5 w-3.5 text-slate-400" />
          <span>Multimodal autonomous rerouting engine</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* CONTROLS BAR */}
        <div className="bg-slate-50 border border-border rounded-lg p-3 sm:p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 space-y-1">
            <label
              htmlFor="disruption-type-dropdown"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600"
            >
              Select Disruption Incident
            </label>
            <div className="relative">
              <select
                id="disruption-type-dropdown"
                value={selectedDisruption}
                onChange={(e) => setSelectedDisruption(e.target.value as SimulatorDisruptionType)}
                disabled={isSimulating || isLoading}
                className="w-full text-xs sm:text-sm font-medium bg-white border border-border rounded-md px-3 py-1.5 text-slate-900 focus:outline-hidden focus:border-slate-400 cursor-pointer disabled:opacity-60"
              >
                {DISRUPTION_OPTIONS.map((opt) => (
                  <option key={opt.type} value={opt.type}>
                    {opt.label} — {opt.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:self-end pt-1 sm:pt-0">
            <Button
              id="trigger-disruption-btn"
              type="button"
              variant="destructive"
              size="md"
              onClick={handleTrigger}
              disabled={isSimulating || isLoading}
              className="w-full sm:w-auto"
            >
              {isSimulating || isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  <span>Calculating Replan...</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  <span>Trigger Disruption</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* REPLANNING PIPELINE TRANSITION STEPS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RouteIcon className="h-3.5 w-3.5 text-slate-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Replanning Pipeline Sequence
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              Active Step:{" "}
              <strong className="text-slate-800 font-semibold">
                {activeStep === "original" && "1. Original Journey"}
                {activeStep === "disruption" && "2. Disruption Injected"}
                {activeStep === "replanning" && "3. Automatic Replanning"}
                {activeStep === "completed" && "4. New Recommended Route"}
              </strong>
            </span>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 sm:gap-3">
            {/* STEP 1: ORIGINAL JOURNEY */}
            <div
              className={`rounded-lg border p-3 flex flex-col justify-between transition-colors ${
                activeStep === "original"
                  ? "border-amber-400 bg-amber-50/50"
                  : "border-border bg-slate-50/70 text-slate-700"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                    Step 1
                  </span>
                  <Badge variant="neutral" size="sm">Pre-Disruption</Badge>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Train className="h-3.5 w-3.5 text-slate-500" />
                  Original Route
                </h4>
                <p className="text-[11px] font-medium text-slate-800 leading-tight">
                  {originalJourney.service_name}
                </p>
                <div className="text-[11px] text-slate-500 space-y-0.5 pt-0.5 font-mono">
                  <div>Dep: {originalJourney.departure_time}</div>
                  <div>
                    Duration: {Math.floor(originalJourney.duration_minutes / 60)}h{" "}
                    {originalJourney.duration_minutes % 60}m
                  </div>
                  <div>Cost: ₹{originalJourney.cost.toLocaleString()}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-border mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>Booked</span>
                <span className="text-emerald-700 font-semibold">Confirmed</span>
              </div>
            </div>

            {/* STEP 2: DISRUPTION */}
            <div
              className={`rounded-lg border p-3 flex flex-col justify-between transition-colors ${
                activeStep === "disruption"
                  ? "border-rose-300 bg-rose-50"
                  : replanData?.disruption
                  ? "border-rose-200 bg-rose-50/30 text-rose-950"
                  : "border-border bg-slate-50/70 text-slate-700"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-rose-600">
                    Step 2
                  </span>
                  <Badge variant="error" size="sm">Disruption</Badge>
                </div>
                <h4 className="text-xs font-semibold text-rose-950 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                  Corridor Incident
                </h4>
                <div className="text-[11px] font-semibold text-rose-900 uppercase">
                  {selectedDisruption}
                </div>
                <p className="text-[11px] text-rose-800 leading-tight">
                  {currentOption.defaultDescription}
                </p>
                <div className="pt-0.5">
                  <span className="text-[10px] uppercase font-semibold text-rose-700 tracking-wider">
                    Invalidated Leg:
                  </span>
                  <ul className="text-[10px] text-rose-900 font-medium space-y-0.5 mt-0.5">
                    {removedServices.slice(0, 1).map((s, idx) => (
                      <li key={idx} className="flex items-center gap-1 truncate">
                        <Ban className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                        <span className="truncate">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="pt-2 border-t border-rose-200 mt-2 text-[10px] text-rose-700 font-mono flex items-center justify-between">
                <span>Impact</span>
                <span className="font-semibold text-rose-800">Cancelled</span>
              </div>
            </div>

            {/* STEP 3: AUTOMATIC REPLANNING */}
            <div
              className={`rounded-lg border p-3 flex flex-col justify-between transition-colors ${
                activeStep === "replanning"
                  ? "border-amber-300 bg-amber-50"
                  : "border-border bg-slate-50/70 text-slate-700"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-600">
                    Step 3
                  </span>
                  <Badge variant="warning" size="sm">Graph Synthesis</Badge>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <RefreshCw
                    className={`h-3.5 w-3.5 text-amber-600 ${
                      activeStep === "replanning" ? "animate-spin" : ""
                    }`}
                  />
                  Multimodal Re-routing
                </h4>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Bypassing severed links; evaluating combinations across rail, road, and air.
                </p>
                <div className="text-[10px] space-y-0.5 pt-0.5 text-slate-600 font-mono">
                  <div className="flex items-center justify-between">
                    <span>Candidates:</span>
                    <span className="font-semibold text-slate-900">
                      {replanData?.routes.length || 4} routes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Criteria:</span>
                    <span className="text-slate-700 font-medium">Time / Cost / Rel</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-border mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>Latency</span>
                <span className="font-semibold text-slate-700">&lt; 280ms deterministic</span>
              </div>
            </div>

            {/* STEP 4: NEW RECOMMENDED ROUTE */}
            <div
              className={`rounded-lg border p-3 flex flex-col justify-between transition-colors ${
                activeStep === "completed"
                  ? "border-emerald-300 bg-emerald-50/40"
                  : "border-border bg-slate-50/70 text-slate-700"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-600">
                    Step 4
                  </span>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
                <h4 className="text-xs font-semibold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  New Route Proposed
                </h4>
                <p className="text-[11px] font-semibold text-emerald-900 leading-tight truncate">
                  {activeRecommended?.transport_modes.join(" → ") || "Air Express Direct Link"}
                </p>
                <div className="text-[11px] space-y-0.5 text-emerald-800 pt-0.5 font-mono">
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span className="font-semibold">
                      {activeRecommended
                        ? `${Math.floor(activeRecommended.total_duration_minutes / 60)}h ${
                            activeRecommended.total_duration_minutes % 60
                          }m`
                        : "5h 20m"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fare:</span>
                    <span className="font-semibold">
                      ₹{activeRecommended?.total_cost.toLocaleString() || "5,200"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Score:</span>
                    <span className="font-semibold text-emerald-900">
                      {activeRecommended?.overall_score || 9.2} / 10
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-emerald-200 mt-2 text-[10px] text-emerald-700 font-mono flex items-center justify-between">
                <span>Map Sync</span>
                <span className="font-semibold text-emerald-800">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK BAR */}
        <div className="bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>
              Simulating an incident triggers an automated rerouting pass, updates alternative itineraries, and synchronizes destination accommodation guarantees.
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-500 shrink-0">
            Engine: <span className="font-semibold text-slate-700">POST /api/v1/replan</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
