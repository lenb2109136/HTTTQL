import React from 'react';
import './Admin.css';

export default function Admin() {
  return (
    <div className="admin-container">
      <div className="main-content">
        <div className="dashboard-content">
          {/* Metrics Cards */}
          <div className="metrics">
            <div className="metric-card">
              <h3>Earnings</h3>
              <p>$350.4</p>
            </div>
            <div className="metric-card">
              <h3>Spend this month</h3>
              <p>$642.39</p>
            </div>
            <div className="metric-card">
              <h3>Sales</h3>
              <p>$574.34</p>
              <span className="growth">+23% since last month</span>
            </div>
            <div className="metric-card">
              <h3>Your balance</h3>
              <p>$1000</p>
              <span>🇺🇸</span>
            </div>
            <div className="metric-card">
              <h3>New Tasks</h3>
              <p>154</p>
            </div>
            <div className="metric-card">
              <h3>Total Projects</h3>
              <p>2935</p>
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
                  <tr>
                    <td>
                      <input type="checkbox" checked={false} readOnly />
                      Horizon UI PRO
                    </td>
                    <td>17.5%</td>
                    <td>2458</td>
                    <td>12 Jan 2021</td>
                  </tr>
                  <tr>
                    <td>
                      <input type="checkbox" checked={true} readOnly />
                      Horizon UI Free
                    </td>
                    <td>10.8%</td>
                    <td>1485</td>
                    <td>21 Feb 2021</td>
                  </tr>
                  <tr>
                    <td>
                      <input type="checkbox" checked={true} readOnly />
                      Weekly Update
                    </td>
                    <td>21.3%</td>
                    <td>1024</td>
                    <td>13 Mar 2021</td>
                  </tr>
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
