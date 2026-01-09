import AdminSidebar from "./AdminSidebar.jsx";

export default function Settings() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row">
        <AdminSidebar />
        <main className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="mt-2 text-gray-400">Settings will go here.</p>
        </main>
      </div>
    </div>
  );
}
