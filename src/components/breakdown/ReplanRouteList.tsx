import React from "react";
import {
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Check,
  Layers,
} from "lucide-react";
import { ReplanRouteItem } from "../../types";
import { Card, Badge, Button, SectionHeader } from "../ui/design-system";

interface RouteListProps {
  routes: ReplanRouteItem[];
  recommendedRouteId?: string;
  selectedRouteId?: string;
  currencySymbol?: string;
  onSelectRoute?: (route: ReplanRouteItem) => void;
  alternatives?: {
    fastest?: ReplanRouteItem | null;
    cheapest?: ReplanRouteItem | null;
    most_reliable?: ReplanRouteItem | null;
    least_transfers?: ReplanRouteItem | null;
  };
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

function formatScore(score?: number | null): string {
  if (score === undefined || score === null || isNaN(score)) return "8.8";
  const normalized = score > 10 ? score / 10 : score;
  return normalized.toFixed(1);
}

export const RouteList: React.FC<RouteListProps> = ({
  routes,
  recommendedRouteId,
  selectedRouteId,
  currencySymbol = "₹",
  onSelectRoute,
  alternatives,
}) => {
  const altCategories = [
    { key: "fastest", label: "FASTEST", badgeVariant: "info" as const, item: alternatives?.fastest },
    { key: "cheapest", label: "CHEAPEST", badgeVariant: "success" as const, item: alternatives?.cheapest },
    { key: "most_reliable", label: "MOST RELIABLE", badgeVariant: "neutral" as const, item: alternatives?.most_reliable },
    { key: "least_transfers", label: "LEAST TRANSFERS", badgeVariant: "warning" as const, item: alternatives?.least_transfers },
  ].filter((c) => c.item !== null && c.item !== undefined);

  return (
    <div id="alternative-routes-section" className="space-y-6">
      {/* ALTERNATIVE ROUTES (Category Winners) */}
      {altCategories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-500" />
              <span>Alternative Routes (Category Winners)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Top Category Trade-offs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {altCategories.map((cat) => {
              const item = cat.item!;
              const isSelected = item.route_id === selectedRouteId;

              return (
                <div
                  key={cat.key}
                  onClick={() => onSelectRoute?.(item)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white shadow-xs ring-1 ring-slate-900"
                      : "border-border bg-surface-elevated hover:border-slate-400 text-slate-900 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge
                      variant={isSelected ? "neutral" : cat.badgeVariant}
                      size="sm"
                      className={isSelected ? "bg-white/20 text-white border-white/20" : ""}
                    >
                      {cat.label}
                    </Badge>
                    <span
                      className={`text-xs font-mono font-semibold ${
                        isSelected ? "text-amber-300" : "text-slate-600"
                      }`}
                    >
                      Score {formatScore(item?.overall_score)}/10
                    </span>
                  </div>

                  {item.title && (
                    <div className={`text-xs font-semibold mb-1 truncate ${isSelected ? "text-white" : "text-slate-900"}`}>
                      {item.title}
                    </div>
                  )}

                  {/* Modes */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium my-2.5">
                    {item.transport_modes.map((mode, idx) => (
                      <React.Fragment key={idx}>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-800 border border-slate-200"
                          }`}
                        >
                          {mode}
                        </span>
                        {idx < item.transport_modes.length - 1 && (
                          <ArrowRight
                            className={`h-3 w-3 ${isSelected ? "text-slate-400" : "text-slate-400"}`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Numbers */}
                  <div
                    className={`flex items-center justify-between pt-2.5 border-t text-xs font-mono ${
                      isSelected ? "border-white/10 text-slate-300" : "border-border text-slate-600"
                    }`}
                  >
                    <span className={`font-semibold ${isSelected ? "text-white" : "text-slate-900"}`}>
                      {currencySymbol}
                      {item.total_cost.toLocaleString()}
                    </span>
                    <span>{formatDuration(item.total_duration_minutes)}</span>
                    <span>{item.transfers} transfer{item.transfers === 1 ? "" : "s"}</span>
                    <span className={isSelected ? "text-emerald-400 font-semibold" : "text-emerald-600 font-semibold"}>
                      {Math.round(item.reliability_score)}% rel
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL ROUTE CANDIDATES LIST */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            All Feasible Evaluated Routes ({routes.length})
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">Deterministic Engine Ranking</span>
        </div>

        <div className="space-y-2.5">
          {routes.map((route) => {
            const isRec = route.route_id === recommendedRouteId;
            const isSelected = route.route_id === selectedRouteId;
            const hasTransferWarning = route.transfers >= 2;
            const hasWaitWarning = route.waiting_minutes >= 45;

            return (
              <div
                key={route.route_id}
                onClick={() => onSelectRoute?.(route)}
                className={`p-3.5 sm:p-4 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "border-slate-900 bg-slate-50/60 shadow-xs ring-1 ring-slate-900/30"
                    : "border-border bg-surface-elevated hover:border-slate-400 shadow-2xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {route.title && (
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 block mr-1">
                        {route.title}
                      </span>
                    )}
                    <span className="font-medium text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {route.transport_modes.join(" → ")}
                    </span>
                    {isRec && (
                      <Badge variant="warning" size="sm">
                        Recommended
                      </Badge>
                    )}
                    {route.category && (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200 uppercase">
                        {route.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900 font-mono">
                      {currencySymbol}
                      {route.total_cost.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-600 flex items-center gap-1 font-mono">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {formatDuration(route.total_duration_minutes)}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant={isSelected ? "success" : "secondary"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRoute?.(route);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>Select</span>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Sub metrics: deterministic metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2.5 border-t border-slate-100 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans block">Transfers</span>
                    <span className="font-medium text-slate-800">{route.transfers}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans block">Waiting</span>
                    <span className="font-medium text-slate-800">{route.waiting_minutes}m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans block">Transfer Walk</span>
                    <span className="font-medium text-slate-800">{route.transfer_minutes}m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans block">Reliability</span>
                    <span className="font-medium text-emerald-700">
                      {Math.round(route.reliability_score)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans block">Score</span>
                    <span className="font-semibold text-slate-900">
                      {formatScore(route?.overall_score)}/10
                    </span>
                  </div>
                </div>

                {/* Warnings */}
                {(hasTransferWarning || hasWaitWarning) && (
                  <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
                    {hasTransferWarning && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        Multiple transfers ({route.transfers})
                      </span>
                    )}
                    {hasWaitWarning && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        Long waiting buffer ({route.waiting_minutes}m)
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { RouteList as ReplanRouteList };

