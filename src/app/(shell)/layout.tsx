import { BottomNav } from "@/components/BottomNav";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col">
      <main
        className="flex-1 px-4 pt-6"
        style={{ paddingBottom: "calc(6.5rem + env(safe-area-inset-bottom))" }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
