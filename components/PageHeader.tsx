// components/PageHeader.tsx

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="relative py-20 overflow-hidden bg-pink-50/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-200/30 via-pink-50/60 to-white pointer-events-none" />
      <div className="relative z-10 max-w-3xl px-6 mx-auto text-center">
        <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
          {title}
        </h1>
        {subtitle && <p className="text-lg text-gray-500">{subtitle}</p>}
      </div>
    </header>
  );
}
