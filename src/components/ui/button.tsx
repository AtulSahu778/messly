import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, iosFontClass, iosInteractiveClass } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    iosFontClass,
    iosInteractiveClass,
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-4 py-3 text-base font-semibold tracking-tight ring-offset-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: "bg-card text-foreground border border-ios-separator/[0.12]",
        primary: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        subtle: "border border-ios-separator/[0.12] bg-card/80 text-foreground",
        outline: "border border-ios-separator/[0.12] bg-card/80 text-foreground",
        secondary: "bg-muted text-foreground",
        ghost: "bg-transparent text-foreground hover:bg-card/70",
        link: "bg-transparent text-primary underline-offset-4 hover:underline shadow-none px-0",
      },
      size: {
        default: "px-4 py-3",
        sm: "px-3 py-2 text-sm",
        lg: "px-5 py-4 text-lg",
        icon: "h-12 w-12 rounded-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
