import { 
    PieChart, Pie, Cell, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
  } from "recharts";
  import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
  
  // --- Mock Data ---
  const categoryData = [
    { name: "Housing", value: 800, color: "#8b5cf6" }, // Violet
    { name: "Food", value: 450, color: "#ec4899" },    // Pink
    { name: "Transport", value: 300, color: "#3b82f6" }, // Blue
    { name: "Shopping", value: 250, color: "#14b8a6" }, // Teal
    { name: "Others", value: 150, color: "#f59e0b" },   // Amber
  ];
  
  const monthlyData = [
    { name: "Jun", income: 4000, expense: 2400 },
    { name: "Jul", income: 3000, expense: 1398 },
    { name: "Aug", income: 2000, expense: 3800 },
    { name: "Sep", income: 2780, expense: 1908 },
    { name: "Oct", income: 1890, expense: 2800 },
    { name: "Nov", income: 2390, expense: 1800 },
  ];
  
  export default function Analytics() {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Financial Analytics</h1>
            <p>Deep dive into your spending habits.</p>
          </div>
        </div>
  
        {/* --- Insight Cards Row --- */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon income-bg"><TrendingUp size={24} color="#16a34a" /></div>
            <div className="stat-info">
              <span>Highest Category</span>
              <h3>Housing ($800)</h3>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon expense-bg"><AlertCircle size={24} color="#ef4444" /></div>
            <div className="stat-info">
              <span>Monthly Cap</span>
              <h3>82% Used</h3>
            </div>
            <div className="stat-trend negative">Caution</div>
          </div>
  
          <div className="stat-card">
            <div className="stat-icon saving-bg"><TrendingDown size={24} color="#8b5cf6" /></div>
            <div className="stat-info">
              <span>Savings Rate</span>
              <h3>12.4%</h3>
            </div>
            <div className="stat-trend positive">+2%</div>
          </div>
        </div>
  
        {/* --- Charts Row --- */}
        <div className="dashboard-split">
          
          {/* Left: Income vs Expense Bar Chart */}
          <div className="glass-panel" style={{ minHeight: '400px' }}>
            <h3>Income vs Expense</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none' }} 
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="expense" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          {/* Right: Spending Categories Pie Chart */}
          <div className="glass-panel" style={{ minHeight: '400px' }}>
            <h3>Spending Breakdown</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none' }} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
  
        </div>
      </div>
    );
  }