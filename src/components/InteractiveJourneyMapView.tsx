import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  Layers,
  Train,
  Plane,
  Navigation,
  Clock,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { MapView } from './map/MapView';
import { RouteOption, BookedTrip } from '../types/travel';
import { Card, Badge, Button } from './ui/design-system';

interface InteractiveJourneyMapViewProps {
  bookedTrips: BookedTrip[];
  activeRoute: RouteOption | null;
  onNavigateToTab: (tab: string) => void;
  onOpenInConcierge?: (origin: string, dest: string) => void;
}

export const InteractiveJourneyMapView: React.FC<InteractiveJourneyMapViewProps> = ({
  bookedTrips,
  activeRoute,
  onNavigateToTab,
  onOpenInConcierge,
}) => {
  const [sourceMode, setSourceMode] = useState<'booked' | 'searched'>('booked');

  const hasBookedTrips = bookedTrips.length > 0;
  const currentTrip = hasBookedTrips ? bookedTrips[0] : null;

  // Determine origin, destination, and steps
  let originName = 'Mumbai Central';
  let destName = 'Goa';
  let steps: any[] = [];
  let routeTitle = 'Multi-Modal Route';

  if (sourceMode === 'booked' && currentTrip) {
    originName = currentTrip.origin_name;
    destName = currentTrip.destination_name;
    routeTitle = currentTrip.title;
    steps = (currentTrip.segments || []).map((s, idx) => ({
      stepId: s.id || `step-${idx}`,
      from: s.start_name,
      to: s.end_name,
      mode: s.mode.toLowerCase().includes('flight')
        ? 'flight'
        : s.mode.toLowerCase().includes('rail')
        ? 'train'
        : s.mode.toLowerCase().includes('bus')
        ? 'bus'
        : s.mode.toLowerCase().includes('metro')
        ? 'metro'
        : 'car',
      durationMinutes: s.duration_minutes,
      cost: s.cost || s.cost_usd,
      distanceKm: s.distance_km,
      carrier: s.provider_name,
      serviceNumber: s.flight_or_service_num,
      instructions: s.instructions,
    }));
  } else if (activeRoute) {
    originName = activeRoute.origin_name;
    destName = activeRoute.destination_name;
    routeTitle = activeRoute.title;
    steps = (activeRoute.segments || []).map((s, idx) => ({
      stepId: s.id || `step-${idx}`,
      from: s.start_name,
      to: s.end_name,
      mode: s.mode.toLowerCase().includes('flight')
        ? 'flight'
        : s.mode.toLowerCase().includes('rail')
        ? 'train'
        : s.mode.toLowerCase().includes('bus')
        ? 'bus'
        : s.mode.toLowerCase().includes('metro')
        ? 'metro'
        : 'car',
      durationMinutes: s.duration_minutes,
      cost: s.cost || s.cost_usd,
      distanceKm: s.distance_km,
      carrier: s.provider_name,
      serviceNumber: s.flight_or_service_num,
      instructions: s.instructions,
    }));
  }

  return (
    <div id="interactive-journey-map-view" className="space-y-6">
      {/* Top Controls Bar */}
      <Card variant="default" padding="md" className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{routeTitle}</span>
              <Badge variant="neutral" size="sm">
                {sourceMode === 'booked' ? 'Booked Itinerary' : 'Planned Route'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span>{originName}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>{destName}</span>
              <span className="text-slate-300">•</span>
              <span>{steps.length} {steps.length === 1 ? 'segment' : 'segments'}</span>
            </p>
          </div>
        </div>

        {/* Source Toggle & Quick Actions */}
        <div className="flex items-center gap-2.5">
          {hasBookedTrips && activeRoute && (
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setSourceMode('booked')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  sourceMode === 'booked'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3 h-3 text-blue-600" />
                <span>Booked Trip</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('searched')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  sourceMode === 'searched'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3 h-3 text-emerald-600" />
                <span>Search Route</span>
              </button>
            </div>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToTab('planner')}
            className="flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Change Transport</span>
          </Button>

          {onOpenInConcierge && (
            <Button
              variant="warning"
              size="sm"
              onClick={() => onOpenInConcierge(originName, destName)}
              className="flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Test Disruption</span>
            </Button>
          )}
        </div>
      </Card>

      {/* Embedded Map Component */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-white">
        <MapView
          currentLocation={originName}
          destination={destName}
          routeSteps={steps}
          showControls={true}
          showStepTimeline={true}
          className="h-[650px] w-full"
        />
      </div>
    </div>
  );
};
