import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-lg shadow-teal-500/20 border border-teal-400/30",
        primary:
          "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-md shadow-cyan-500/20",
        secondary:
          "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 shadow-sm",
        destructive:
          "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20",
        outline:
          "border border-slate-700 hover:border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800/60",
        ghost:
          "hover:bg-slate-800/80 text-slate-300 hover:text-white",
        link:
          "text-cyan-400 underline-offset-4 hover:underline p-0 h-auto",
        glow:
          "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:brightness-110",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
