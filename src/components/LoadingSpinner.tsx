export default function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-linec border-t-amber rounded-full animate-spin" />
        <p className="text-faint text-sm">در حال بارگذاری...</p>
      </div>
    </div>
  );
}
