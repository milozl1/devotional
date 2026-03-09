export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-2 border-slate-200 border-t-[#1e3a5f]`}
      />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-3 border-slate-200 border-t-[#1e3a5f] mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Se încarcă...</p>
      </div>
    </div>
  );
}
