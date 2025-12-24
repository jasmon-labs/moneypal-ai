import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, DollarSign, CreditCard, X, Plus, Loader2 } from "lucide-react";

const videoChartData = [
  { name: "Mon", amount: 2100 }, { name: "Tue", amount: 1800 },
  { name: "Wed", amount: 2400 }, { name: "Thu", amount: 2150 },
  { name: "Fri", amount: 3200 }, { name: "Sat", amount: 2800 },
  { name: "Sun", amount: 3490 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // GOLDEN BASE (Change these for the video start)
  const [baseIncome, setBaseIncome] = useState(5000); 
  const [liveExpense, setLiveExpense] = useState(0);
  const [showGoal, setShowGoal] = useState(false);

  const [formData, setFormData] = useState({
    description: "", 
    amount: "", 
    merchant: "Manipal Store",
    transaction_type: "debit", 
    payment_method: "Cash"
  });

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
        return;
    }

    // Check if AI has set a goal in this session
    if(localStorage.getItem("ai_goal_active") === "true") setShowGoal(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/transactions/", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
      }

      const data = await res.json();
      // SAFETY: Ensure data is an array before setting
      const safeData = Array.isArray(data) ? data : [];
      setTransactions(safeData);

      const totalEx = safeData.reduce((acc, t) => 
        t.transaction_type === "debit" ? acc + (Number(t.amount) || 0) : acc, 0);
      setLiveExpense(totalEx);
    } catch (err) { 
        console.error("Dashboard Fetch Error:", err);
        setTransactions([]); 
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
    } else {
        setIsReady(true);
        fetchData();
    }
  }, [navigate, fetchData]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/transactions/add", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
            ...formData, 
            amount: parseFloat(formData.amount as string) 
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ description: "", amount: "", merchant: "Manipal Store", transaction_type: "debit", payment_method: "Cash" });
        fetchData(); // Refresh the list
      } else if (response.status === 401) {
          navigate("/login");
      }
    } catch (err) { 
        console.error("Save failed", err); 
    } finally { 
        setIsLoading(false); 
    }
  };

  if (!isReady) return <div style={{padding: '40px', textAlign: 'center'}}>Loading MoneyPal...</div>;

  const totalExpenses = 1250 + (Number(liveExpense) || 0); 
  const totalBalance = baseIncome - totalExpenses;
  const savings = totalBalance * 0.3; 

  return (
    <div className="dashboard-container" style={{ padding: '25px', backgroundColor: '#f8faff', minHeight: '100vh' }}>
      {/* HEADER */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>Welcome, Chirag!</h1>
          <p style={{ color: '#64748b' }}>MoneyPal is tracking your Manipal lifestyle.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', backgroundColor: '#8b5cf6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
            + Add Transaction
        </button>
      </div>

      {/* SAVINGS GOAL - DYNAMIC PROGRESS BAR */}
      {showGoal && (
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '24px', marginBottom: '25px', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.2)', border: '1px solid #8b5cf6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontWeight: '700', color: '#1e293b' }}>Goal: Fender Stratocaster 🎸</h3>
                <span style={{ fontWeight: '600', color: '#8b5cf6' }}>{Math.min(((savings / 800) * 100), 100).toFixed(1)}%</span>
            </div>
            <div style={{ width: '100%', height: '12px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((savings / 800) * 100, 100)}%`, height: '100%', backgroundColor: '#8b5cf6', transition: 'width 1s ease' }}></div>
            </div>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>Plan active! Saved: ${savings.toFixed(0)} of $800 target.</p>
        </div>
      )}

      {/* STATS GRID */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: "Total Balance", val: totalBalance, icon: DollarSign, color: "#16a34a" },
          { label: "Total Income", val: baseIncome, icon: TrendingUp, color: "#2563eb" },
          { label: "Total Expenses", val: totalExpenses, icon: CreditCard, color: "#dc2626" },
          { label: "Total Savings", val: savings, icon: Wallet, color: "#9333ea" }
        ].map((item, i) => (
          <div key={i} style={{ padding: '24px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ padding: '8px', backgroundColor: `${item.color}15`, borderRadius: '10px' }}><item.icon size={20} color={item.color} /></div>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{item.label}</span>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '700' }}>${item.val.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
        {/* CHART SECTION */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: '600' }}>Spending Trends</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={videoChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#8b5cf6" fill="#8b5cf610" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY SECTION */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: '600' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {transactions?.length > 0 ? transactions.slice(0, 5).map((tx: any) => (
                <div key={tx.id || Math.random()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '10px' }}><Plus size={16} /></div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{tx.description || 'Unknown'}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{tx.category || 'General'}</div>
                        </div>
                    </div>
                    <span style={{ fontWeight: '700', color: tx.transaction_type === 'credit' ? '#16a34a' : '#ef4444' }}>
                        {tx.transaction_type === 'credit' ? '+' : '-'}${tx.amount}
                    </span>
                </div>
            )) : <p style={{ color: '#94a3b8', textAlign: 'center' }}>No live transactions yet.</p>}
          </div>
        </div>
      </div>

      {/* FULLY FUNCTIONAL TRANSACTION MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '400px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} />
            </button>
            <h2 style={{ marginBottom: '20px', fontWeight: 'bold' }}>New Transaction</h2>
            <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text" placeholder="Description (e.g. Mess Food)" required 
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} 
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} 
              />
              <input 
                type="number" placeholder="Amount ($)" required 
                value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} 
              />
              <select 
                value={formData.transaction_type} 
                onChange={(e) => setFormData({...formData, transaction_type: e.target.value})} 
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: 'white' }}
              >
                <option value="debit">Expense (Debit)</option>
                <option value="credit">Income (Credit)</option>
              </select>
              <button type="submit" disabled={isLoading} style={{ padding: '12px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isLoading ? "Saving..." : "Save to MoneyPal"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}