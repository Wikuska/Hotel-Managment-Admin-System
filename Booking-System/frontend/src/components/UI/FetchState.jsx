import { AlertCircle, Loader2, Inbox } from "lucide-react";

export default function FetchState({
  isLoading,
  error,
  data,
  emptyMessage = "No data found to display.",
  children,
  className = "",
}) {
  const baseLayout = "flex flex-col items-center p-4 h-full justify-center";

  if (isLoading) {
    return (
      <div className={`${baseLayout} text-zinc-500 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Fetching data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${baseLayout} text-red-600 ${className}`}>
        <AlertCircle className="w-10 h-10 mb-2" />
        <p className="font-bold">Error occured</p>
        <p className="text-sm">{error.message || error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`${baseLayout} text-zinc-500 ${className}`}>
        <Inbox className="w-10 h-10 mb-2" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
