import { NavLink } from "react-router-dom";

const base = "block rounded-lg px-3 py-2 transition";
const inactive = "text-gray-300 hover:bg-white/10 hover:text-white";
const active = "bg-white/10 text-white ring-1 ring-white/10";

export default function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4 h-fit">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Admin Menu
      </p>

      <nav className="space-y-2">
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Products
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Orders
        </NavLink>

        <NavLink
          to="/admin/enjoy"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Enjoy
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
