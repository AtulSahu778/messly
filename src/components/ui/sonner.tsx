import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Sonner Toast Component
 * Themed with Finance-Optimized iOS Dark Palette
 * 
 * Colors:
 * - Background: #111513 (Card Surface)
 * - Border: rgba(255,255,255,0.12) (Hairline)
 * - Success: #30D158 (Money Green)
 * - Error: #FF453A (Expense Red)
 * - Text: #FFFFFF / rgba(235,235,245,0.6)
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#111513] group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-[rgba(255,255,255,0.12)] group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-[rgba(235,235,245,0.6)]",
          actionButton: "group-[.toast]:bg-[#30D158] group-[.toast]:text-black group-[.toast]:rounded-xl group-[.toast]:font-semibold",
          cancelButton: "group-[.toast]:bg-[#1A1F1D] group-[.toast]:text-[rgba(235,235,245,0.6)] group-[.toast]:rounded-xl",
          success: "group-[.toast]:text-[#30D158]",
          error: "group-[.toast]:text-[#FF453A]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
