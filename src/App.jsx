import { useState } from 'react';
import './styles/main.css';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('swap');

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      {/* Header */}
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid #333' }}>
        <h1>DeFiSwap</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Tabs */}
      <main style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          {['swap', 'liquidity', 'analytics'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{
                marginRight: '0.5rem',
                backgroundColor: activeTab === tab ? '#6f4ef2' : '#222',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Konten Berdasarkan Tab */}
        {activeTab === 'swap' && <Swap />}
        {activeTab === 'liquidity' && <Liquidity />}
        {activeTab === 'analytics' && <Analytics />}
      </main>
    </div>
  );
}

function Swap() {
  const [tokenA, setTokenA] = useState('ETH');
  const [tokenB, setTokenB] = useState('DAI');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');

  return (
    <div className="card">
      <h2>Swap Tokens</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>From: {tokenA}</label>
        <input 
          type="number" 
          value={amountA} 
          onChange={(e) => setAmountA(e.target.value)} 
          placeholder="0.0" 
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
      </div>
      <div>
        <label>To: {tokenB}</label>
        <input 
          type="number" 
          value={amountB} 
          onChange={(e) => setAmountB(e.target.value)} 
          placeholder="0.0" 
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
      </div>
      <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
        Swap
      </button>
    </div>
  );
}

function Liquidity() {
  return <div className="card">Add Liquidity</div>;
}

function Analytics() {
  return <div className="card">Analytics Dashboard</div>;
}