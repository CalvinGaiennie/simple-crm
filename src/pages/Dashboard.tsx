import { activities, contacts, deals } from "../data/fakeData";

const currency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function Dashboard() {
  const openDeals = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
  const wonDeals = deals.filter((d) => d.stage === "Won");
  const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const winRate = Math.round((wonDeals.length / (wonDeals.length + deals.filter((d) => d.stage === "Lost").length)) * 100);

  const topDeals = [...openDeals].sort((a, b) => b.value - a.value).slice(0, 5);
  const recentActivity = [...activities].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);

  const contactById = (id: string) => contacts.find((c) => c.id === id);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back — here's how the pipeline looks today.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Open Pipeline</div>
          <div className="stat-value">{currency(pipelineValue)}</div>
          <div className="stat-sub">{openDeals.length} active deals</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Won This Period</div>
          <div className="stat-value">{currency(wonValue)}</div>
          <div className="stat-sub">{wonDeals.length} deals closed</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Win Rate</div>
          <div className="stat-value">{winRate}%</div>
          <div className="stat-sub">won vs. lost</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Contacts</div>
          <div className="stat-value">{contacts.length}</div>
          <div className="stat-sub">across {new Set(contacts.map((c) => c.company)).size} companies</div>
        </div>
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h2>Top Open Deals</h2>
          <table className="simple-table">
            <thead>
              <tr>
                <th>Deal</th>
                <th>Contact</th>
                <th>Stage</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {topDeals.map((deal) => (
                <tr key={deal.id}>
                  <td>{deal.title}</td>
                  <td>{contactById(deal.contactId)?.name}</td>
                  <td>
                    <span className={`stage-pill stage-${deal.stage.toLowerCase()}`}>{deal.stage}</span>
                  </td>
                  <td>{currency(deal.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            {recentActivity.map((item) => {
              const contact = contactById(item.contactId);
              return (
                <li key={item.id} className="activity-item">
                  <span className={`activity-icon activity-${item.type}`}>{item.type[0].toUpperCase()}</span>
                  <div>
                    <div className="activity-summary">
                      <strong>{contact?.name}</strong> — {item.summary}
                    </div>
                    <div className="activity-date">{item.date}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
