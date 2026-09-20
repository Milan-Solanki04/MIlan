import React from "react";

// ============================================================================
// DESIGN TOKENS & CONSTANTS
// ============================================================================

export const THEME = {
  radius: {
    card: "rounded-xl",
    nested: "rounded-lg",
    control: "rounded-lg",
    badge: "rounded-md",
    pill: "rounded-full",
  },
  border: "border border-slate-200/90",
  shadow: {
    card: "shadow-xs",
    hover: "hover:shadow-sm",
    popover: "shadow-md",
  },
  typography: {
    pageTitle: "text-xl font-bold tracking-tight text-slate-900",
    sectionTitle: "text-sm font-bold uppercase tracking-wider text-slate-600",
    cardTitle: "text-base font-bold text-slate-900",
    body: "text-xs sm:text-sm text-slate-600 leading-relaxed",
    mono: "font-mono font-medium tracking-tight",
  },
};

// ============================================================================
// BADGE COMPONENT
// ============================================================================

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "error"
  | "info"
  | "purple"
  | "mono"
  | "neutral"
  | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-700 border-slate-200/80",
    neutral: "bg-slate-100 text-slate-700 border-slate-200/80",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    error: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-sky-50 text-sky-800 border-sky-200",
    purple: "bg-purple-50 text-purple-800 border-purple-200",
    mono: "font-mono bg-slate-100 text-slate-800 border-slate-200 text-[11px] font-semibold tracking-wider",
    outline: "bg-white text-slate-700 border-slate-300",
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: "bg-slate-400",
    neutral: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    error: "bg-rose-500",
    info: "bg-sky-500",
    purple: "bg-purple-500",
    mono: "bg-slate-500",
    outline: "bg-slate-400",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-md whitespace-nowrap select-none transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "destructive"
  | "warning"
  | "success"
  | "accent";

export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  iconRight?: React.ReactNode | React.ComponentType<{ className?: string }>;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  disabled,
  className = "",
  ...props
}) => {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 border-transparent shadow-xs focus-visible:ring-slate-900",
    secondary:
      "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 shadow-xs focus-visible:ring-slate-400",
    outline:
      "bg-transparent text-slate-700 border-slate-300 hover:bg-slate-100/70 focus-visible:ring-slate-400",
    ghost:
      "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border-transparent focus-visible:ring-slate-400",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border-transparent shadow-xs focus-visible:ring-rose-500",
    destructive:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border-transparent shadow-xs focus-visible:ring-rose-500",
    warning:
      "bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 border-transparent shadow-xs focus-visible:ring-amber-500",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 border-transparent shadow-xs focus-visible:ring-emerald-500",
    accent:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border-transparent shadow-xs focus-visible:ring-blue-500",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-2.5 text-xs rounded-lg gap-1.5",
    md: "h-9.5 px-3.5 text-xs font-semibold rounded-lg gap-2",
    lg: "h-11 px-5 text-sm font-semibold rounded-lg gap-2.5",
  };

  const renderIcon = (i?: React.ReactNode | React.ComponentType<{ className?: string }>) => {
    if (!i) return null;
    if (React.isValidElement(i)) return i;
    if (typeof i === "function") {
      const IconComponent = i as React.ComponentType<{ className?: string }>;
      return <IconComponent className="w-3.5 h-3.5 shrink-0" />;
    }
    return i as React.ReactNode;
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center border font-medium transition-all duration-150 active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{renderIcon(icon)}</span>
      )}
      {children}
      {iconRight && !loading && <span className="shrink-0">{renderIcon(iconRight)}</span>}
    </button>
  );
};

// ============================================================================
// CARD COMPONENT
// ============================================================================

export type CardVariant =
  | "default"
  | "subtle"
  | "interactive"
  | "outline"
  | "elevated"
  | "selected"
  | "warning"
  | "success"
  | "danger";

export type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  compact?: boolean;
  padding?: CardPadding;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  compact = false,
  padding,
  className = "",
  ...props
}) => {
  const variantStyles: Record<CardVariant, string> = {
    default: "bg-white border-slate-200/90 shadow-xs",
    subtle: "bg-slate-50/70 border-slate-200/80 shadow-xs",
    outline: "bg-white border-slate-200 shadow-none",
    elevated: "bg-white border-slate-200 shadow-sm",
    selected: "bg-white border-slate-900 ring-1 ring-slate-900 shadow-xs",
    interactive:
      "bg-white border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all",
    warning: "bg-white border-amber-300 shadow-xs",
    success: "bg-white border-emerald-300 shadow-xs",
    danger: "bg-white border-rose-300 shadow-xs",
  };

  const paddingStyles: Record<CardPadding, string> = {
    none: "p-0",
    sm: "p-3 sm:p-3.5",
    md: "p-4 sm:p-5",
    lg: "p-5 sm:p-6",
  };

  const resolvedPadding = padding ? paddingStyles[padding] : (compact ? "p-3 sm:p-4" : "p-4 sm:p-5");

  return (
    <div
      className={`rounded-xl border ${variantStyles[variant]} ${resolvedPadding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// SECTION HEADER COMPONENT
// ============================================================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
  icon,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && <div className="text-slate-700 shrink-0">{icon}</div>}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">{title}</h2>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

// ============================================================================
// STAT / METRIC PILL COMPONENT
// ============================================================================

interface MetricItemProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  description?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  className?: string;
  trend?: { value: string; positive?: boolean };
}

export const MetricItem: React.FC<MetricItemProps> = ({
  label,
  value,
  unit,
  subValue,
  description,
  icon,
  highlight = false,
  className = "",
  trend,
}) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
        highlight
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-slate-50/80 text-slate-900 border-slate-200/80"
      } ${className}`}
    >
      {icon && (
        <span className={`shrink-0 ${highlight ? "text-slate-300" : "text-slate-500"}`}>
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div
          className={`text-[10px] font-bold uppercase tracking-wider flex items-center justify-between gap-1 ${
            highlight ? "text-slate-400" : "text-slate-500"
          }`}
        >
          <span>{label}</span>
          {trend && (
            <span
              className={`text-[9px] font-semibold px-1 rounded ${
                trend.positive ? "text-emerald-700 bg-emerald-50" : "text-slate-500 bg-slate-100"
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-mono text-sm font-bold tracking-tight ${highlight ? "text-white" : "text-slate-900"}`}>
            {value}
          </span>
          {unit && (
            <span className={`text-[11px] font-medium ${highlight ? "text-slate-300" : "text-slate-500"}`}>
              {unit}
            </span>
          )}
        </div>
        {(subValue || description) && (
          <div className={`text-[10px] truncate ${highlight ? "text-slate-400" : "text-slate-500"}`}>
            {subValue || description}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

interface EmptyStateProps {
  icon: React.ReactNode | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => {
  const renderIcon = (i: React.ReactNode | React.ComponentType<{ className?: string }>) => {
    if (React.isValidElement(i)) return i;
    if (typeof i === "function") {
      const IconComponent = i as React.ComponentType<{ className?: string }>;
      return <IconComponent className="w-6 h-6 text-slate-500" />;
    }
    return i as React.ReactNode;
  };

  return (
    <div
      className={`text-center py-12 px-6 rounded-xl border border-dashed border-slate-300 bg-white/70 max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3.5">
        {renderIcon(icon)}
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mb-4">{description}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};
