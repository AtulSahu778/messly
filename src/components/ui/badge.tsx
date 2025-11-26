import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, iosFontClass } from "@/lib/utils";

const badgeVariants = cva(
  cn(
    iosFontClass,
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition-colors",
  ),
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary",
        secondary: "bg-secondary/15 text-secondary",
        destructive: "bg-destructive/15 text-destructive",
        outline: "border border-ios-separator/[0.12] text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
