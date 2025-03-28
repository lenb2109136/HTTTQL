import React from 'react';
import HeaderAdmin from './HeaderAdmin';
import SidebarAdmin from './SidebarAdmin';
import './Admin.css';

export default function Admin() {
  // Mock data for the dashboard
  const metrics = {
    earnings: 350.4,
    spend: 642.39,
    sales: 574.34,
    balance: 1000,
    newTasks: 154,
    totalProjects: 2935,
  };

  const checkTableData = [
    {
      name: 'Horizon UI PRO',
      progress: '17.5%',
      quantity: 2458,
      date: '12 Jan 2021',
    },
    {
      name: 'Horizon UI Free',
      progress: '10.8%',
      quantity: 1485,
      date: '21 Feb 2021',
    },
    {
      name: 'Weekly Update',
      progress: '21.3%',
      quantity: 1024,
      date: '13 Mar 2021',
    },
  ];

  return (
    <div className="admin-container">
      <div className="main-content">
        <div className="dashboard-content">
          {/* Metrics Cards */}
          <div className="metrics">
            <div className="metric-card">
              <h3>Earnings</h3>
              <p>${metrics.earnings}</p>
            </div>
            <div className="metric-card">
              <h3>Spend this month</h3>
              <p>${metrics.spend}</p>
            </div>
            <div className="metric-card">
              <h3>Sales</h3>
              <p>${metrics.sales}</p>
              <span className="growth">+23% since last month</span>
            </div>
            <div className="metric-card">
              <h3>Your balance</h3>
              <p>${metrics.balance}</p>
              <span>🇺🇸</span>
            </div>
            <div className="metric-card">
              <h3>New Tasks</h3>
              <p>{metrics.newTasks}</p>
            </div>
            <div className="metric-card">
              <h3>Total Projects</h3>
              <p>{metrics.totalProjects}</p>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="charts-tables">
            {/* Line Chart Placeholder */}
            <div className="chart-section">
              <h3>
                Total: $37.5K <span className="decline">(-2.45%)</span>
              </h3>
              <p>Spent: On track</p>
              <div className="chart-placeholder">
                <p>[Line Chart: Spent over time (Sep to Feb)]</p>
              </div>
            </div>

            {/* Bar Chart Placeholder */}
            <div className="chart-section">
              <h3>Weekly Revenue</h3>
              <div className="chart-placeholder">
                <p>[Bar Chart: Revenue from 17th to 25th]</p>
              </div>
            </div>

            {/* Check Table */}
            <div className="table-section">
              <h3>Check Table</h3>
              <table>
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>PROGRESS</th>
                    <th>QUANTITY</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {checkTableData.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={index === 1 || index === 2}
                          readOnly
                        />
                        {row.name}
                      </td>
                      <td>{row.progress}</td>
                      <td>{row.quantity}</td>
                      <td>{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Daily Traffic */}
            <div className="traffic-section">
              <h3>Daily Traffic</h3>
              <p>
                2,579 Visitors <span className="growth">+2.45%</span>
              </p>
              <div className="chart-placeholder">
                <p>[Bar Chart: Daily Traffic]</p>
              </div>
            </div>

            {/* Pie Chart Placeholder */}
            <div className="pie-chart-section">
              <h3>Your Pie Chart</h3>
              <div className="chart-placeholder">
                <p>[Pie Chart: Data Distribution]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
