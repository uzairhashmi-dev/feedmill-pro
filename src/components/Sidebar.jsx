import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Factory, Package, FlaskConical,
  ShoppingCart, ShoppingBag, Users, UserCheck,
  Settings, Wheat, ChartColumnStacked, ChevronRight, X,
} from "lucide-react";

const NAV = [
  {
    section: "MAIN",
    items: [
      { label: "Dashboard",   icon: LayoutDashboard,   path: "/dashboard"   },
      { label: "Production",  icon: Factory,            path: "/production"  },
      { label: "Inventory",   icon: Package,            path: "/inventory"   },
      { label: "Category",    icon: ChartColumnStacked, path: "/category"    },
      { label: "Formulation", icon: FlaskConical,       path: "/formulation" },
    ],
  },
  {
    section: "BUSINESS",
    items: [
      { label: "Sales",     icon: ShoppingCart, path: "/sales"     },
      { label: "Orders",    icon: ShoppingBag,  path: "/orders"    },
      { label: "Customers", icon: Users,        path: "/customers" },
    ],
  },
  {
    section: "ANALYTICS",
    items: [
      { label: "Staff",    icon: UserCheck, path: "/staff"    },
      { label: "Settings", icon: Settings,  path: "/settings" },
    ],
  },
];

// ✅ No logic changes — Sidebar is already dark-themed (bg-[#1a2e1a])
// It looks great in both light and dark mode as-is
export default function Sidebar({ isOpen, setIsOpen, collapsed }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-screen bg-[#1a2e1a] dark:bg-gray-900 flex flex-col shrink-0
        transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static
        ${collapsed ? "lg:w-17" : "lg:w-64"}
        w-64
      `}>

        {/* Logo */}
        <div className={`
          border-b border-white/10 flex items-center justify-between
          ${collapsed ? "lg:px-0 lg:justify-center px-5 py-5" : "px-5 py-5"}
          py-5
        `}>
          <div className={`flex items-center gap-3 ${collapsed ? "lg:gap-0" : ""}`}>
            <div className="w-9 h-9 bg-yellow-500 rounded-xl flex items-center
                            justify-center shrink-0">
              <Wheat size={18} className="text-black" />
            </div>
            <div className={`${collapsed ? "lg:hidden" : ""}`}>
              <p className="text-white font-bold text-lg leading-none">FeedMill Pro</p>
              <p className="text-[#4ade80]/60 text-[10px] uppercase tracking-wider mt-0.5">
                ERP System
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-white/50">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className={`flex-1 py-4 space-y-5 overflow-y-auto overflow-x-hidden
          ${collapsed ? "lg:px-2 px-3" : "px-3"}
        `}>
          {NAV.map((group) => (
            <div key={group.section}>
              <p className={`
                text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1.5
                ${collapsed ? "lg:hidden px-3" : "px-3"}
              `}>
                {group.section}
              </p>

              {collapsed && (
                <div className="hidden lg:block border-t border-white/10 mb-2 mx-1" />
              )}

              <div className="space-y-0.5">
                {group.items.map((navItem) => (
                  <NavLink
                    key={navItem.path}
                    to={navItem.path}
                    onClick={() => setIsOpen(false)}
                    title={collapsed ? navItem.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-sm
                       font-medium transition-all group
                       ${collapsed ? "lg:justify-center lg:px-0 lg:py-2.5" : ""}
                       ${isActive
                         ? "bg-[#4ade80]/15 text-[#4ade80]"
                         : "text-white/60 hover:text-white/90 hover:bg-white/5"
                       }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <navItem.icon
                          size={collapsed ? 19 : 16}
                          className={`shrink-0 ${
                            isActive
                              ? "text-[#4ade80]"
                              : "text-white/50 group-hover:text-white/70"
                          }`}
                        />
                        <span className={`flex-1 ${collapsed ? "lg:hidden" : ""}`}>
                          {navItem.label}
                        </span>
                        {isActive && !collapsed && (
                          <ChevronRight size={13} className="text-[#4ade80]/60 hidden lg:block" />
                        )}
                        {isActive && (
                          <ChevronRight size={13} className="text-[#4ade80]/60 lg:hidden" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={`border-t border-white/10 ${collapsed
          ? "lg:py-4 lg:flex lg:justify-center px-5 py-4"
          : "px-5 py-4"}`}>
          <p className={`text-white/25 text-[10px] ${collapsed ? "lg:hidden" : ""}`}>
            FeedMill Pro v1.0.0
          </p>
          {collapsed && (
            <div className="hidden lg:block w-1.5 h-1.5 rounded-full bg-white/20" />
          )}
        </div>
      </aside>
    </>
  );
}