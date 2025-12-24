import { useEffect, useState } from "react";
import { Search, Filter, Download, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/transactions/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="page-container" style={{ padding: '25px', backgroundColor: '#f8faff' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Transactions</h1>
          <p style={{ color: '#64748b' }}>A complete history of your MoneyPal activity.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="icon-btn-outline" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}>
            <Download size={20} />
          </button>
          <button style={{ padding: '10px 20px', backgroundColor: '#8b5cf6', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600' }}>
            + Add New
          </button>
        </div>
      </div>

      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '24px', padding: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
              <th style={{ padding: '15px', color: '#64748b', fontWeight: '600' }}>Transaction</th>
              <th style={{ padding: '15px', color: '#64748b', fontWeight: '600' }}>Category</th>
              <th style={{ padding: '15px', color: '#64748b', fontWeight: '600' }}>Date</th>
              <th style={{ padding: '15px', color: '#64748b', fontWeight: '600' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? transactions.map((tx: any) => (
              <tr key={tx.id || Math.random()} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      padding: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: tx.transaction_type === 'credit' ? '#16a34a15' : '#ef444415' 
                    }}>
                      {tx.transaction_type === 'credit' ? 
                        <ArrowDownRight size={16} color="#16a34a" /> : 
                        <ArrowUpRight size={16} color="#ef4444" />
                      }
                    </div>
                    <span style={{ fontWeight: '600' }}>{tx.description}</span>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    backgroundColor: '#f1f5f9',
                    color: '#64748b' 
                  }}>{tx.category}</span>
                </td>
                <td style={{ padding: '15px', color: '#64748b' }}>
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td style={{ 
                  padding: '15px', 
                  fontWeight: '700', 
                  color: tx.transaction_type === 'credit' ? '#16a34a' : '#1e293b' 
                }}>
                  {tx.transaction_type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  {isLoading ? "Loading history..." : "No transactions found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}