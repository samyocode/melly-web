// app/admin/photo-pool/page.tsx

export default function PhotoPoolPage() {
  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight">Photo Pool</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage the curated face photos used for seed user generation. Stored in
        Cloudinary under{" "}
        <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
          admin/seed_pool/
        </code>
        .
      </p>
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-12 text-center text-sm text-gray-400">
        Coming next: upload, tag (gender / age range), preview grid.
      </div>
    </div>
  );
}
