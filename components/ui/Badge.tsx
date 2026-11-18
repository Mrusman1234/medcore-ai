import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-teal-950 text-teal-300 border border-teal-800/80",
        routine:
          "bg-teal-950/80 text-teal-300 border border-teal-700/60 shadow-sm",
        scheduled:
          "bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-sm shadow-emerald-950/40",
        pending:
          "bg-amber-950/80 text-amber-300 border border-amber-700/60 shadow-sm shadow-amber-950/40",
        cancelled:
          "bg-rose-950/80 text-rose-300 border border-rose-700/60 shadow-sm shadow-rose-950/40",
        completed:
          "bg-blue-950/80 text-blue-300 border border-blue-700/60 shadow-sm shadow-blue-950/40",
        urgent:
          "bg-orange-950/80 text-orange-300 border border-orange-700/60 animate-pulse",
        emergency:
          "bg-rose-900 text-rose-100 border border-rose-500 animate-bounce font-bold",
        secondary:
          "bg-slate-800 text-slate-300 border border-slate-700",
        outline:
          "text-slate-300 border border-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot = true, children, ...props }: BadgeProps) {
  const dotColors: Record<string, string> = {
    routine: "bg-teal-400",
    scheduled: "bg-emerald-400",
    pending: "bg-amber-400",
    cancelled: "bg-rose-400",
    completed: "bg-blue-400",
    urgent: "bg-orange-400",
    emergency: "bg-rose-400",
    default: "bg-teal-400",
  };

  const activeDotColor = variant && dotColors[variant] ? dotColors[variant] : "bg-teal-400";

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full inline-block",
            activeDotColor,
            variant === "scheduled" && "animate-ping"
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
