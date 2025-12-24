import { useState } from "react";
import { User, Bell, Shield, Globe, Camera } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: false,
  });

  const [currency, setCurrency] = useState("USD");

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences and security.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* --- LEFT COLUMN: Profile Card --- */}
        <div className="glass-panel profile-card">
          <div className="profile-header">
            <div className="avatar-large">
              CM
              <button className="edit-avatar">
                <Camera size={16} />
              </button>
            </div>
            <h2>Chirag Mishra</h2>
            <p>Premium User</p>
          </div>
          
          <form className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" defaultValue="Chirag Mishra" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" defaultValue="chiragmishra120@gmail.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" defaultValue="+91 98765 43210" />
            </div>
            <button className="btn-save">Save Changes</button>
          </form>
        </div>

        {/* --- RIGHT COLUMN: Settings Options --- */}
        <div className="settings-options">
          
          {/* Preferences Section */}
          <div className="glass-panel settings-section">
            <div className="section-title">
              <Globe size={20} className="icon-purple" />
              <h3>Preferences</h3>
            </div>
            
            <div className="setting-item" style={{ borderBottom: 'none' }}>
              <div className="setting-info">
                <span>Currency</span>
                <p>Select your default display currency.</p>
              </div>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="custom-select"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="glass-panel settings-section">
            <div className="section-title">
              <Bell size={20} className="icon-blue" />
              <h3>Notifications</h3>
            </div>

            <div className="setting-item">
              <span>Email Alerts</span>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="email-toggle"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})} 
                />
                <label htmlFor="email-toggle"></label>
              </div>
            </div>

            <div className="setting-item">
              <span>Push Notifications</span>
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="push-toggle"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})} 
                />
                <label htmlFor="push-toggle"></label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="glass-panel settings-section">
            <div className="section-title">
              <Shield size={20} className="icon-red" />
              <h3>Security</h3>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span>Two-Factor Auth</span>
                <p>Add an extra layer of security.</p>
              </div>
              <button className="btn-outline-sm">Enable</button>
            </div>
            <div className="setting-item" style={{ borderBottom: 'none' }}>
              <button className="btn-text-red">Change Password</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}