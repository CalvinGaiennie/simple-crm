export type Page = "dashboard" | "contacts" | "deals";

interface SidebarProps {
  active: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "◧" },
  { id: "contacts", label: "Contacts", icon: "☺" },
  { id: "deals", label: "Pipeline", icon: "◫" },
];

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">◆</span>
        <span>SimpleCRM</span>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${active === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-avatar">CG</span>
          <div>
            <div className="sidebar-user-name">Calvin</div>
            <div className="sidebar-user-role">Sales</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
