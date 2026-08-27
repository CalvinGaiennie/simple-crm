import { useState } from "react";
import Sidebar, { type Page } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Deals from "./pages/Deals";

function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <div className="app-shell">
      <Sidebar active={page} onNavigate={setPage} />
      <main className="app-content">
        {page === "dashboard" && <Dashboard />}
        {page === "contacts" && <Contacts />}
        {page === "deals" && <Deals />}
      </main>
    </div>
  );
}

export default App;
