import React from 'react';
import {
  Clock,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Train,
  Plane,
  Car,
  Footprints,
  Navigation,
  ArrowRight,
  Info,
  Briefcase,
  MapPin,
} from 'lucide-react';
import { RouteOption, RouteSegment, SegmentMode } from '../types/travel';
import { Card, Badge, Button, EmptyState } from './ui/design-system';

interface RouteListProps {
  routes: RouteOption[];
  selectedRouteId: string | null;
  onSelectRoute: (route: RouteOption) => void;
}

export const RouteList: React.FC<RouteListProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
}) => {
  const getModeIcon = (mode: SegmentMode) => {
    switch (mode) {
      case 'FLIGHT':
        return <Plane className="w-3.5 h-3.5 text-indigo-600" />;
      case 'HIGH_SPEED_RAIL':
      case 'COMMUTER_TRAIN':
        return <Train className="w-3.5 h-3.5 text-blue-600" />;
      case 'METRO':
      case 'BUS':
        return <Navigation className="w-3.5 h-3.5 text-emerald-600" />;
      case 'RIDE_SHARE':
        return <Car className="w-3.5 h-3.5 text-amber-600" />;
      case 'WALK':
        return <Footprints className="w-3.5 h-3.5 text-slate-500" />;
      default:
        return <Navigation className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  return (
    <div id="route-options-container" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Corporate Route Options ({routes.length} Alternatives)
        </h2>
        <span className="text-[11px] text-slate-500 font-mono">
          Ranked by policy compliance, travel duration, and fare benchmark
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {routes.length === 0 ? (
          <EmptyState
            title="Enter origin and destination to search routes"
            description="Search any city, airport, station, or pick on map to compute multi-modal routes"
            icon={<MapPin className="w-8 h-8 text-slate-400" />}
          />
        ) : (
          routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const firstSeg = route.segments[0];
            const lastSeg = route.segments[route.segments.length - 1];

            return (
              <div
                key={route.id}
                id={`route-card-${route.id}`}
                onClick={() => onSelectRoute(route)}
                className={`rounded-lg border transition-all cursor-pointer p-4 sm:p-5 bg-surface-elevated ${
                  isSelected
                    ? 'border-slate-900 shadow-xs ring-1 ring-slate-900/40'
                    : 'border-border shadow-2xs hover:border-slate-400 hover:shadow-xs'
                }`}
              >
                {/* Header row: Badge, Title & Compliance Status */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {route.badge && (
                      <Badge
                        variant={
                          route.badge === 'Corporate Pick'
                            ? 'info'
                            : route.badge === 'Fastest'
                            ? 'neutral'
                            : route.badge === 'Best Value'
                            ? 'success'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {route.badge}
                      </Badge>
                    )}
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                      {route.title}
                    </h3>
                    {route.via_stations && route.via_stations.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>Via {route.via_stations.join(', ')}</span>
                      </span>
                    )}
                  </div>

                  {/* Compliance Badge */}
                  <div className="flex items-center gap-2">
                    {route.compliance_status === 'COMPLIANT' && (
                      <Badge variant="success" size="sm">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Policy Compliant</span>
                      </Badge>
                    )}
                    {route.compliance_status === 'WARNING' && (
                      <Badge variant="warning" size="sm">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Warning: Flagged</span>
                      </Badge>
                    )}
                    {route.compliance_status === 'OUT_OF_POLICY' && (
                      <Badge variant="danger" size="sm">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Requires Manager Approval</span>
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Main metrics grid: 4 columns - Duration, Fare, Cabin Tier, Transfers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-border mb-3 bg-slate-50/70 rounded-lg px-4 font-mono">
                  {/* Duration */}
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 font-sans flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Total Duration
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">
                      {formatDuration(route.total_duration_minutes)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {firstSeg?.departure_time} → {lastSeg?.arrival_time}
                    </div>
                  </div>

                  {/* Cost */}
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 font-sans flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-slate-400" />
                      Estimated Fare
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">
                      {route.currency_symbol || '$'}{(route.total_cost ?? route.total_cost_usd).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {(route.total_cost ?? route.total_cost_usd) <= (route.benchmark_cost ?? route.benchmark_cost_usd) ? (
                        <span className="text-emerald-700 font-medium">
                          -{route.currency_symbol || '$'}{((route.benchmark_cost ?? route.benchmark_cost_usd) - (route.total_cost ?? route.total_cost_usd)).toLocaleString()} under cap
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">
                          +{route.currency_symbol || '$'}{((route.total_cost ?? route.total_cost_usd) - (route.benchmark_cost ?? route.benchmark_cost_usd)).toLocaleString()} over cap
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cabin Tier */}
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 font-sans flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      Max Cabin Tier
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">
                      {route.max_cabin_class}
                    </div>
                    <div className="text-[11px] text-slate-500 font-sans">
                      {route.total_distance_km} km distance
                    </div>
                  </div>

                  {/* Transfers & Reliability */}
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 font-sans">
                      Transfers & Stops
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">
                      {(() => {
                        const totalHalts = route.segments.reduce(
                          (sum, seg) => sum + (seg.intermediate_stops?.length || 0),
                          0
                        );
                        if (route.transfer_count === 0) {
                          return totalHalts > 0 ? `Direct (${totalHalts} Halts)` : 'Direct (Non-Stop)';
                        }
                        return `${route.transfer_count} Transfer${route.transfer_count > 1 ? 's' : ''}${
                          totalHalts > 0 ? ` (${totalHalts} Halts)` : ''
                        }`;
                      })()}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium font-sans">
                      {route.reliability_score}% on-time rating
                    </div>
                  </div>
                </div>

                {/* Segment timeline visualization strip */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-600">
                    {route.segments.map((seg, idx) => (
                      <React.Fragment key={seg.id || idx}>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-800 font-medium border border-slate-200">
                          {getModeIcon(seg.mode)}
                          <span className="text-[11px]">{seg.provider_name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({seg.duration_minutes}m)</span>
                          {seg.intermediate_stops && seg.intermediate_stops.length > 0 && (
                            <span className="text-[9px] bg-blue-100/80 text-blue-800 px-1 py-0.2 rounded font-semibold font-mono">
                              +{seg.intermediate_stops.length}
                            </span>
                          )}
                        </span>
                        {idx < route.segments.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <Button
                    id={`select-route-btn-${route.id}`}
                    type="button"
                    variant={isSelected ? "primary" : "secondary"}
                    size="sm"
                    className="shrink-0"
                  >
                    <span>{isSelected ? 'Selected' : 'Inspect Itinerary'}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>

                {/* Compliance Notes preview */}
                {route.compliance_notes.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-border flex items-start gap-1.5 text-xs text-slate-500">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      {route.compliance_notes.map((note, idx) => (
                        <div key={idx} className="text-[11px] text-slate-600">
                          • {note}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
