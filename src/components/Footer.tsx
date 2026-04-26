export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Atelier. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
