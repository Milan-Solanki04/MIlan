import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Briefcase,
  ShieldCheck,
  Layers,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  Building2,
  Bell,
  MapPin,
  LifeBuoy,
  MoreHorizontal,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { TravelerProfile, CurrencyCode } from '../types/travel';
import { Badge, Button } from './ui/design-system';

export type NavigationTab =
  | 'trips'
  | 'planner'
  | 'disruptions'
  | 'hotels'
  | 'map'
  | 'help'
  | 'notifications'
  | 'policies'
  | 'robustness'
  | 'architecture'
  | 'telemetry';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  bookedCount: number;
  currentTraveler: TravelerProfile;
  onSelectTraveler: (traveler: TravelerProfile) => void;
  onOpenTelemetry: () => void;
  onOpenE2EModal?: () => void;
  currency: CurrencyCode;
  onChangeCurrency: (currency: CurrencyCode) => void;
  unreadNotificationsCount?: number;
  hasActiveDisruption?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  bookedCount,
  currentTraveler,
  onSelectTraveler,
  onOpenTelemetry,
  onOpenE2EModal,
  currency,
  onChangeCurrency,
  unreadNotificationsCount = 2,
  hasActiveDisruption = true,
}) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isToolActive = ['policies', 'robustness', 'architecture'].includes(activeTab);

  const handleTabClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  return (
    <>
      <header id="app-header" className="bg-white border-b border-border sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Logo & Brand */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleTabClick('trips')}
                className="flex items-center gap-3 text-left group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 rounded-lg p-0.5"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition-colors">
                  <Compass className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                      TravelAssist
                    </span>
                    <Badge variant="success" size="sm">
                      Autonomous
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 hidden sm:block leading-none mt-0.5">
                    Multi-Modal Travel & Disruption Concierge
                  </p>
                </div>
              </button>
            </div>

            {/* Center: Primary Journey Navigation Tabs (Desktop) */}
            <nav
              id="header-nav"
              aria-label="Main Journey Navigation"
              className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 gap-0.5"
            >
              {/* 1. Trip / Journey */}
              <button
                type="button"
                id="nav-tab-trips"
                onClick={() => handleTabClick('trips')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'trips'
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Your booked itineraries and active tickets"
              >
                <Briefcase className={`w-3.5 h-3.5 ${activeTab === 'trips' ? 'text-white' : 'text-blue-600'}`} />
                <span>Trip / Journey</span>
                {bookedCount > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-mono font-bold rounded-full ${
                      activeTab === 'trips' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                    }`}
                  >
                    {bookedCount}
                  </span>
                )}
              </button>

              {/* 2. Transport (Planner) */}
              <button
                type="button"
                id="nav-tab-planner"
                onClick={() => handleTabClick('planner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'planner'
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Search and compare multi-modal transit options"
              >
                <Compass className={`w-3.5 h-3.5 ${activeTab === 'planner' ? 'text-white' : 'text-emerald-600'}`} />
                <span>Transport</span>
              </button>

              {/* 3. Disruptions */}
              <button
                type="button"
                id="nav-tab-disruptions"
                onClick={() => handleTabClick('disruptions')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                  activeTab === 'disruptions'
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Autonomous delay mitigation and rebooking"
              >
                <AlertTriangle className={`w-3.5 h-3.5 ${activeTab === 'disruptions' ? 'text-amber-300' : 'text-amber-600'}`} />
                <span>Disruptions</span>
                {hasActiveDisruption && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>

              {/* 4. Hotels */}
              <button
                type="button"
                id="nav-tab-hotels"
                onClick={() => handleTabClick('hotels')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'hotels'
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Destination hotel stays and late check-in sync"
              >
                <Building2 className={`w-3.5 h-3.5 ${activeTab === 'hotels' ? 'text-white' : 'text-teal-600'}`} />
                <span>Hotels</span>
              </button>

              {/* 5. Map */}
              <button
                type="button"
                id="nav-tab-map"
                onClick={() => handleTabClick('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'map'
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Interactive multi-modal route map and stops"
              >
                <MapPin className={`w-3.5 h-3.5 ${activeTab === 'map' ? 'text-white' : 'text-indigo-600'}`} />
                <span>Map</span>
              </button>

              {/* 6. Find Help */}
              <button
                type="button"
                id="nav-tab-help"
                onClick={() => handleTabClick('help')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'help'
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="24/7 helplines, passenger rights, and emergency support"
              >
                <LifeBuoy className={`w-3.5 h-3.5 ${activeTab === 'help' ? 'text-white' : 'text-rose-600'}`} />
                <span>Find Help</span>
              </button>

              {/* 7. Activity / Status */}
              <button
                type="button"
                id="nav-tab-notifications"
                onClick={() => handleTabClick('notifications')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Real-time alerts and journey activity"
              >
                <Bell className={`w-3.5 h-3.5 ${activeTab === 'notifications' ? 'text-white' : 'text-blue-500'}`} />
                <span>Activity / Status</span>
                {unreadNotificationsCount > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-mono font-bold rounded-full ${
                      activeTab === 'notifications' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                    }`}
                  >
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Secondary Tools Dropdown (Policies, Tests, Architecture) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  id="nav-tools-dropdown-btn"
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isToolActive
                      ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title="Enterprise tools, policies, test suite & architecture"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                  <span>Tools</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {toolsDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Enterprise & Diagnostics
                    </div>

                    <button
                      type="button"
                      id="nav-dropdown-policies"
                      onClick={() => handleTabClick('policies')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                        activeTab === 'policies'
                          ? 'bg-slate-100 font-semibold text-slate-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <div className="font-medium">Corporate Policies</div>
                        <div className="text-[10px] text-slate-400">Budget caps & cabin rules</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="nav-dropdown-robustness"
                      onClick={() => handleTabClick('robustness')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                        activeTab === 'robustness'
                          ? 'bg-slate-100 font-semibold text-slate-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <div className="font-medium">31-Test Suite</div>
                        <div className="text-[10px] text-slate-400">Fault tolerance runner</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="nav-dropdown-architecture"
                      onClick={() => handleTabClick('architecture')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                        activeTab === 'architecture'
                          ? 'bg-slate-100 font-semibold text-slate-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Layers className="w-4 h-4 text-slate-700 shrink-0" />
                      <div>
                        <div className="font-medium">System Architecture</div>
                        <div className="text-[10px] text-slate-400">API contracts & microservices</div>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      type="button"
                      id="nav-dropdown-telemetry"
                      onClick={() => {
                        setToolsDropdownOpen(false);
                        onOpenTelemetry();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-medium">Provider Health Telemetry</div>
                        <div className="text-[10px] text-slate-400">Live API latencies</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Right: Currency Toggle, E2E Button, & Traveler Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* PRD E2E Interactive Test Trigger */}
              {onOpenE2EModal && (
                <button
                  type="button"
                  id="header-e2e-btn"
                  onClick={onOpenE2EModal}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                  title="Run PRD Section 15 12-Step Autonomous Flow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>E2E Flow</span>
                </button>
              )}

              {/* Currency switcher toggle */}
              <div id="currency-switcher" className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  id="curr-inr"
                  onClick={() => onChangeCurrency('INR')}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    currency === 'INR'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Indian Rupee (INR)"
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  id="curr-usd"
                  onClick={() => onChangeCurrency('USD')}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    currency === 'USD'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="US Dollar (USD)"
                >
                  $ USD
                </button>
              </div>

              {/* Traveler Card */}
              <div id="header-user-badge" className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-semibold text-xs shrink-0">
                  {currentTraveler.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                    {currentTraveler.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {currentTraveler.tier}
                  </div>
                </div>
              </div>

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                id="mobile-nav-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-hidden"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto shadow-xl animate-in slide-in-from-top-2 duration-150">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Your Journey
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTabClick('trips')}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'trips' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Trip / Journey ({bookedCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('planner')}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'planner' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transport</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('disruptions')}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'disruptions' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Disruptions</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('hotels')}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'hotels' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Hotels</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('map')}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'map' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Journey Map</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('help')}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'help' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LifeBuoy className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Find Help</span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Support & Updates
              </div>
              <button
                type="button"
                onClick={() => handleTabClick('notifications')}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'notifications' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Activity / Status Alerts</span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <Badge variant="neutral" size="sm">
                    {unreadNotificationsCount} unread
                  </Badge>
                )}
              </button>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Enterprise Tools & Architecture
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTabClick('policies')}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                    activeTab === 'policies' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Policies</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('robustness')}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                    activeTab === 'robustness' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>31-Test Suite</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('architecture')}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                    activeTab === 'architecture' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <span>Architecture</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTelemetry();
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Telemetry</span>
                </button>
              </div>
            </div>

            {onOpenE2EModal && (
              <div className="pt-2 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenE2EModal();
                  }}
                  className="w-full justify-center"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Run PRD 12-Step Autonomous Flow</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Thumb Navigation Bar (< 1024px) */}
      <nav
        id="mobile-bottom-nav"
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg"
      >
        {/* 1. Trip / Journey */}
        <button
          type="button"
          onClick={() => handleTabClick('trips')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'trips' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Briefcase className={`w-4 h-4 ${activeTab === 'trips' ? 'text-slate-900' : 'text-slate-500'}`} />
            {bookedCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-slate-900 text-white text-[8px] font-bold flex items-center justify-center">
                {bookedCount}
              </span>
            )}
          </div>
          <span className="mt-0.5">Journey</span>
        </button>

        {/* 2. Transport */}
        <button
          type="button"
          onClick={() => handleTabClick('planner')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'planner' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className={`w-4 h-4 ${activeTab === 'planner' ? 'text-slate-900' : 'text-slate-500'}`} />
          <span className="mt-0.5">Transport</span>
        </button>

        {/* 3. Disruptions */}
        <button
          type="button"
          onClick={() => handleTabClick('disruptions')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-lg text-[10px] font-medium transition-colors relative ${
            activeTab === 'disruptions' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <AlertTriangle className={`w-4 h-4 ${activeTab === 'disruptions' ? 'text-amber-600' : 'text-slate-500'}`} />
            {hasActiveDisruption && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </div>
          <span className="mt-0.5">Disruptions</span>
        </button>

        {/* 4. Map */}
        <button
          type="button"
          onClick={() => handleTabClick('map')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'map' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className={`w-4 h-4 ${activeTab === 'map' ? 'text-slate-900' : 'text-slate-500'}`} />
          <span className="mt-0.5">Map</span>
        </button>

        {/* 5. Find Help */}
        <button
          type="button"
          onClick={() => handleTabClick('help')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'help' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LifeBuoy className={`w-4 h-4 ${activeTab === 'help' ? 'text-slate-900' : 'text-slate-500'}`} />
          <span className="mt-0.5">Help</span>
        </button>

        {/* 6. More / Menu */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-lg text-[10px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-slate-500" />
          <span className="mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};
