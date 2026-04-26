export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Atelier. All rights reserved.
        </p>
        <p className="text-xs text-zinc-400">
          Monitored with Datadog Browser RUM
        </p>
      </div>
    </footer>
  );
}
