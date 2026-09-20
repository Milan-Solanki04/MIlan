import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sun,
  Edit3,
  RefreshCw,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { HotelStay } from '../../types/unifiedContract';
import { Card, Badge, Button, EmptyState } from '../ui/design-system';

interface ConciergeHotelStayCardProps {
  hotel: HotelStay | null;
  loading: boolean;
  onRefresh?: () => void;
  destinationCity: string;
  revisedArrivalTime?: string;
  onNotifyLateArrival?: (instructions: string) => Promise<boolean>;
  onModifyDates?: (newDate: string, notes: string) => Promise<boolean>;
}

export const ConciergeHotelStayCard: React.FC<ConciergeHotelStayCardProps> = ({
  hotel,
  loading,
  onRefresh,
  destinationCity,
  revisedArrivalTime,
  onNotifyLateArrival,
  onModifyDates,
}) => {
  const [notifying, setNotifying] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState(hotel?.check_in_date || '');
  const [editNotes, setEditNotes] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const handleSendNotification = async () => {
    if (!hotel) return;
    setNotifying(true);
    setNotificationSuccess(null);
    try {
      const instructions = `Traveler disrupted in-transit. Guaranteed room hold requested until revised arrival at ${
        revisedArrivalTime || '10:30 PM'
      }.`;
      if (onNotifyLateArrival) {
        const ok = await onNotifyLateArrival(instructions);
        if (ok) {
          setNotificationSuccess(
            `Front Desk at ${hotel.hotel_name} notified. Guaranteed late arrival room hold active until 02:00 AM.`
          );
        }
      } else {
        const res = await fetch(`/api/hotels/${hotel.trip_id}/modify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            late_check_in_notified: true,
            special_instructions: instructions,
          }),
        });
        if (res.ok) {
          setNotificationSuccess(
            `Front Desk at ${hotel.hotel_name} notified. Guaranteed late arrival room hold active until 02:00 AM.`
          );
        }
      }
    } catch (err) {
      console.error('Failed to notify hotel:', err);
    } finally {
      setNotifying(false);
    }
  };

  const handleSaveModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotel) return;
    setSavingEdit(true);
    try {
      if (onModifyDates) {
        await onModifyDates(editDate, editNotes);
      } else {
        await fetch(`/api/hotels/${hotel.trip_id}/modify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            new_check_in_date: editDate,
            special_instructions: editNotes,
          }),
        });
      }
      setIsEditing(false);
      setNotificationSuccess('Hotel reservation details updated with corporate travel partner.');
    } catch (err) {
      console.error('Failed to modify hotel:', err);
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
    return (
      <Card variant="default" padding="md" className="flex items-center justify-center gap-3 text-slate-500 text-xs py-8">
        <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
        <span>Synchronizing destination accommodation and late check-in guarantee...</span>
      </Card>
    );
  }

  if (!hotel) {
    return (
      <Card variant="default" padding="md">
        <EmptyState
          icon={Building2}
          title="No destination accommodation linked"
          description={`When replanning to ${destinationCity || 'your destination'}, reserved accommodations will sync here.`}
        />
      </Card>
    );
  }

  const isDelayed =
    hotel.status === 'CHECK_IN_DELAYED' ||
    Boolean(revisedArrivalTime) ||
    !hotel.late_check_in_notified;

  return (
    <Card
      id="concierge-hotel-stay-card"
      variant="default"
      padding="md"
      className="space-y-4"
    >
      {/* Header: Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="neutral" size="sm">
                Destination Stay
              </Badge>
              <span className="text-[11px] font-mono text-slate-500">
                Code: {hotel.confirmation_code}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
              {hotel.hotel_name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hotel.late_check_in_notified ? (
            <Badge variant="success" size="md">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Room Hold Active
            </Badge>
          ) : isDelayed ? (
            <Badge variant="warning" size="md">
              <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-600" />
              Late Check-in Risk
            </Badge>
          ) : (
            <Badge variant="neutral" size="md">
              <Check className="h-3.5 w-3.5 mr-1 text-slate-600" />
              Confirmed
            </Badge>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-1.5 rounded-md border border-border hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
              title="Refresh hotel status"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Notification Success Banner */}
      {notificationSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{notificationSuccess}</div>
        </div>
      )}

      {/* Hotel Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-md bg-slate-50 border border-border">
          <span className="text-[11px] text-slate-500 block mb-0.5 flex items-center gap-1 font-medium">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            Location & City
          </span>
          <span className="font-semibold text-slate-800 line-clamp-1">
            {hotel.city || destinationCity}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5 line-clamp-1">
            {hotel.address}
          </span>
        </div>

        <div className="p-3 rounded-md bg-slate-50 border border-border">
          <span className="text-[11px] text-slate-500 block mb-0.5 flex items-center gap-1 font-medium">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            Check-in & Room Type
          </span>
          <span className="font-semibold text-slate-800">{hotel.check_in_date}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5 line-clamp-1">
            {hotel.room_type}
          </span>
        </div>

        <div className="p-3 rounded-md bg-amber-50/50 border border-amber-200">
          <span className="text-[11px] text-amber-800 block mb-0.5 flex items-center gap-1 font-medium">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            Arrival Timing Sync
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 line-through text-[11px]">
              {hotel.original_check_in_time}
            </span>
            <span className="font-semibold text-amber-900 font-mono">
              {revisedArrivalTime || hotel.estimated_arrival_time || '10:30 PM'}
            </span>
          </div>
          <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
            {hotel.late_check_in_notified
              ? '✓ Front desk notified of delayed arrival'
              : '⚠ Action advised: notify front desk'}
          </span>
        </div>
      </div>

      {/* Destination Intel & Helpline */}
      {hotel.destination_info && (
        <div className="p-3 rounded-md bg-slate-50 border border-border text-xs space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span>Weather: {hotel.destination_info.weather_condition} ({hotel.destination_info.temperature_celsius}°C)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="h-3 w-3 text-slate-400" />
              <span>Helpline: <strong>{hotel.destination_info.emergency_helpline}</strong></span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
            <strong>Transit & First-Mile:</strong> {hotel.destination_info.transit_tips}
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <Button
          variant={hotel.late_check_in_notified ? "secondary" : "primary"}
          size="md"
          onClick={handleSendNotification}
          disabled={notifying}
          className="flex-1 min-w-[200px]"
        >
          {notifying ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
              <span>Notifying Hotel Front Desk...</span>
            </>
          ) : hotel.late_check_in_notified ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
              <span>Front Desk Notified • Re-Send Hold</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5 mr-1.5" />
              <span>Notify Hotel of Late Arrival (Hold Room)</span>
            </>
          )}
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
          <span>{isEditing ? 'Cancel Edit' : 'Modify Dates'}</span>
        </Button>

        <a
          href={`tel:${hotel.contact_phone}`}
          className="inline-flex items-center justify-center font-medium transition-all cursor-pointer disabled:opacity-50 text-xs px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-border"
        >
          <Phone className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
          <span>Call Desk</span>
        </a>
      </div>

      {/* Inline Modification Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveModification}
          className="p-3.5 bg-slate-50 border border-border rounded-md space-y-3 text-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-slate-600" />
              Modify Reservation Dates & Special Instructions
            </span>
            <span className="text-[11px] text-slate-500">Direct Front Desk Link</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                New Check-In Date
              </label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border border-border bg-white text-xs text-slate-800 focus:outline-hidden focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Special Front Desk Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Flight lands at midnight, hold reservation"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border border-border bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={savingEdit}
            >
              {savingEdit ? 'Updating Reservation...' : 'Save & Dispatch to Hotel'}
            </Button>
          </div>
        </form>
      )}

      {/* Corporate Policy Protection Notice */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
        <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        <span>
          <strong>Corporate No-Show Protection:</strong> In-transit disruption clause active. No penalty or room cancellation applied for delayed arrival.
        </span>
      </div>
    </Card>
  );
};
