import React from "react";
import {
  AlertOctagon,
  PhoneCall,
  ShieldAlert,
  MapPin,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { EmergencyAssistanceInfo, ReplanWarning } from "../../types";
import { Card, Badge } from "../ui/design-system";

interface EmergencyAssistanceBannerProps {
  status?: string;
  emergencyAssistance?: EmergencyAssistanceInfo;
  warnings?: ReplanWarning[];
  suggestedDestinations?: string[];
  currentLocation?: string;
  destination?: string;
  onSelectAlternativeDestination?: (dest: string) => void;
}

export const EmergencyAssistanceBanner: React.FC<EmergencyAssistanceBannerProps> = ({
  status,
  emergencyAssistance,
  warnings,
  suggestedDestinations,
  currentLocation = "Current Location",
  destination = "Destination",
  onSelectAlternativeDestination,
}) => {
  if (!emergencyAssistance && (!warnings || warnings.length === 0) && status === "SUCCESS") {
    return null;
  }

  const isSevere =
    status === "ALL_SERVICES_CANCELLED" ||
    status === "NO_ROUTE_FOUND" ||
    status === "NO_TRANSPORT_OPTIONS" ||
    status === "CONNECTION_IMPOSSIBLE" ||
    status === "DESTINATION_UNAVAILABLE";

  return (
    <Card
      id="emergency-assistance-panel"
      variant={isSevere ? "danger" : "warning"}
      padding="lg"
      className="transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg shrink-0 ${
              isSevere ? "bg-rose-600 text-white" : "bg-amber-600 text-white"
            }`}
          >
            {isSevere ? (
              <AlertOctagon className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={isSevere ? "danger" : "warning"} size="sm">
                {status || "RESILIENCE ADVISORY"}
              </Badge>
              <span className="text-xs text-slate-500 font-mono">
                Safe Contingency Protocol
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold mt-1 text-slate-900">
              {emergencyAssistance?.title || "Traveller Assistance & Network Contingency"}
            </h3>
          </div>
        </div>

        {(emergencyAssistance?.helpline_number || (emergencyAssistance as any)?.helpline) && (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border shadow-2xs">
            <PhoneCall className="h-4 w-4 text-rose-600" />
            <div className="text-left">
              <span className="text-[10px] block text-slate-500 uppercase tracking-wider font-semibold">
                24/7 Helpline
              </span>
              <span className="text-xs font-bold text-slate-900 font-mono">
                {emergencyAssistance?.helpline_number || (emergencyAssistance as any)?.helpline}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Advisory Text */}
      {emergencyAssistance?.advisory && (
        <p className="mt-3.5 text-xs text-slate-700 leading-relaxed">
          {emergencyAssistance.advisory}
        </p>
      )}

      {/* Actionable Passenger Steps */}
      {emergencyAssistance?.actionable_steps && emergencyAssistance.actionable_steps.length > 0 && (
        <div className="mt-4 bg-surface-elevated rounded-lg border border-border p-3.5 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Recommended Immediate Actions
          </h4>
          <ul className="space-y-1.5">
            {emergencyAssistance.actionable_steps.map((step, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed"
              >
                <span className="h-4 w-4 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nearby Hubs / Alternative Destinations */}
      {((emergencyAssistance?.suggested_nearest_hubs && emergencyAssistance.suggested_nearest_hubs.length > 0) || (suggestedDestinations && suggestedDestinations.length > 0)) && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-3 border-t border-border/80">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-slate-600" />
            Reachable Alternate Hubs:
          </span>
          {(emergencyAssistance?.suggested_nearest_hubs || suggestedDestinations || []).map((hub, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectAlternativeDestination && onSelectAlternativeDestination(hub)}
              className="px-2.5 py-1 rounded-md bg-white border border-border hover:border-slate-400 hover:bg-slate-50 text-xs font-medium text-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <MapPin className="h-3 w-3 text-slate-500" />
              <span>{hub}</span>
              <ArrowRight className="h-2.5 w-2.5 text-slate-400" />
            </button>
          ))}
        </div>
      )}

      {/* Warnings & Resolutions list */}
      {warnings && warnings.length > 0 && (
        <div className="mt-3.5 space-y-1.5">
          {warnings.map((w, idx) => (
            <div
              key={idx}
              className="text-xs p-2.5 rounded-lg bg-surface-elevated border border-border text-slate-800 flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">{w.message}</span>
                  {w.resolution && (
                    <span className="block text-slate-600 mt-0.5 text-[11px]">
                      Resolution: {w.resolution}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                {w.code}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
