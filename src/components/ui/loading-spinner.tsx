// components/ui/loading-spinner.tsx
import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ size = 16 }: { size?: number }) => {
  return (
    <Loader2 className="animate-spin text-white" size={size} strokeWidth={2} />
  );
};
