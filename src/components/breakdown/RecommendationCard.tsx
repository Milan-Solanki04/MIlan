import React from "react";
import {
  Sparkles,
  ArrowRight,
  Clock,
  Navigation,
  Quote,
  CheckCircle2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { RecommendationResponse, ReplanRouteItem } from "../../types";
import { Card, Badge, Button, MetricItem } from "../ui/design-system";

interface RecommendationCardProps {
  recommendation: RecommendationResponse | null;
  recommendedRoute: ReplanRouteItem | null;
  loading: boolean;
  onRefresh: () => void;
  onSelectRoute?: (route: ReplanRouteItem) => void;
  isSelected?: boolean;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  recommendedRoute,
  loading,
  onRefresh,
  onSelectRoute,
  isSelected = false,
}) => {
  if (loading) {
    return (
      <Card variant="default" padding="lg" className="animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-slate-200 rounded-md" />
          <div className="h-4 w-48 bg-slate-200 rounded" />
        </div>
        <div className="h-20 bg-slate-100 rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="h-16 bg-slate-100 rounded-lg" />
          <div className="h-16 bg-slate-100 rounded-lg" />
          <div className="h-16 bg-slate-100 rounded-lg" />
          <div className="h-16 bg-slate-100 rounded-lg" />
        </div>
      </Card>
    );
  }

  if (!recommendedRoute && !recommendation) {
    return (
      <Card variant="outline" padding="lg" className="text-center py-10">
        <Sparkles className="h-7 w-7 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-800">Awaiting Replanning Request</p>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Execute route replanning to generate the top recommended route and trade-off evaluation.
        </p>
      </Card>
    );
  }

  const isGemini = recommendation?.provider_used?.startsWith("gemini");
  const modes = recommendedRoute?.transport_modes || ["Taxi", "Flight", "Taxi"];
  const durationText = recommendedRoute ? formatDuration(recommendedRoute.total_duration_minutes) : "5h 20m";
  const costNumber = recommendedRoute ? recommendedRoute.total_cost : 5200;
  const transfersCount = recommendedRoute ? recommendedRoute.transfers : 2;
  const reliability = recommendedRoute ? Math.round(recommendedRoute.reliability_score) : 91;
  const overallRating =
    recommendedRoute?.overall_score !== undefined && recommendedRoute?.overall_score !== null
      ? (recommendedRoute.overall_score > 10
          ? (recommendedRoute.overall_score / 10).toFixed(1)
          : Number(recommendedRoute.overall_score).toFixed(1))
      : "9.2";

  return (
    <Card
      id="recommended-route-card"
      variant="elevated"
      padding="none"
      className="overflow-hidden border border-slate-300/80 shadow-sm relative"
    >
      {/* Top Header: RECOMMENDED ROUTE */}
      <div className="px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white">
              RECOMMENDED BYPASS ROUTE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {((recommendation as any)?.confidence_score || (recommendation as any)?.confidence) && (
            <Badge variant="neutral" size="sm" className="bg-white/10 text-white border-white/20">
              {Math.round((recommendation as any)?.confidence_score || (recommendation as any)?.confidence)}% Match
            </Badge>
          )}
          <Badge variant="neutral" size="sm" className="bg-white/10 text-white border-white/20">
            Score {overallRating}/10
          </Badge>
          <Badge variant="warning" size="sm">
            {isGemini ? "AI Grounded" : "Engine Rank #1"}
          </Badge>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Core Route Headline: e.g. Taxi → Flight → Taxi */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {modes.map((mode, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-md shadow-2xs">
                    {mode}
                  </span>
                  {idx < modes.length - 1 && (
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Optimal autonomous bypass avoiding active travel disruption
            </p>
          </div>

          {/* Action: [Select Route] */}
          {recommendedRoute && (
            <Button
              id="select-recommended-route-btn"
              variant={isSelected ? "success" : "primary"}
              size="md"
              onClick={() => onSelectRoute?.(recommendedRoute)}
              className="shrink-0"
            >
              {isSelected ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Selected Route</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-amber-400" />
                  <span>Select Route</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* The 4 Core Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricItem
            label="Travel Time"
            value={durationText}
            description="Including transfers"
            icon={<Clock className="h-3.5 w-3.5" />}
          />
          <MetricItem
            label="Total Cost"
            value={`₹${costNumber.toLocaleString()}`}
            description="All segments"
          />
          <MetricItem
            label="Transfers"
            value={`${transfersCount} stop${transfersCount === 1 ? "" : "s"}`}
            description="Direct connection"
          />
          <MetricItem
            label="Reliability"
            value={`${reliability}%`}
            description="Historical on-time"
            trend={{ value: `${reliability}%`, positive: reliability >= 85 }}
          />
        </div>

        {/* AI Agent Traveller Message */}
        {recommendation && (
          <div className="relative rounded-lg border border-amber-200/80 bg-amber-50/50 p-4 space-y-2">
            <Quote className="absolute top-3.5 right-3.5 h-5 w-5 text-amber-300/80 pointer-events-none" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
                AI Concierge Guidance
              </span>
              {(recommendation.headline || (recommendation as any).reason_headline) && (
                <span className="text-xs font-semibold text-slate-900">
                  — {recommendation.headline || (recommendation as any).reason_headline}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed pr-6">
              "{recommendation.traveller_message || recommendation.reasoning || (recommendation as any).detailed_reasoning}"
            </p>

            {/* Trade-off analysis advantages if present */}
            {Array.isArray((recommendation.trade_off_analysis as any)?.advantages) && (
              <ul className="text-xs text-slate-700 space-y-1 pt-2 border-t border-amber-200/60">
                {((recommendation.trade_off_analysis as any).advantages as string[]).map((adv, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Booking action prompt if present */}
            {(recommendation as any).booking_action_prompt && (
              <div className="pt-2 text-xs font-medium text-amber-900 flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                <span>{(recommendation as any).booking_action_prompt}</span>
              </div>
            )}
          </div>
        )}

        {/* Important Warnings if any */}
        {recommendation?.warnings && recommendation.warnings.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Transfer & Wait Advisory:</span>
              <ul className="space-y-0.5 text-amber-800">
                {recommendation.warnings.map((w, idx) => (
                  <li key={idx}>• {w}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
