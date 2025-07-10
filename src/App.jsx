import { useState, useEffect, useRef } from 'react';
import './styles/main.css';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('swap');
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [tokenA, setTokenA] = useState('ETH');
  const [tokenB, setTokenB] = useState('DAI');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.ethereum) {
      window.web3 = new (require('web3'))(window.ethereum);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new window.THREE.Scene();
    const camera = new window.THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    const renderer = new window.THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new window.THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
    const material = new window.THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
    const particles = new window.THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setWalletConnected(true);
        alert(`Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
      } catch (error) {
        console.error("User rejected request", error);
        alert("Gagal menghubungkan dompet!");
      }
    } else {
      alert("MetaMask tidak ditemukan! Silakan install MetaMask terlebih dahulu.");
    }
  };

  const handleSwap = async () => {
    if (!window.web3 || !walletConnected) {
      alert("Silakan hubungkan dompet terlebih dahulu.");
      return;
    }

    setIsSwapping(true);
    try {
      const tx = {
        from: account,
        to: '0xRecipientAddress',
        value: window.web3.utils.toWei(amountA, 'ether'),
        gas: 21000
      };

      const receipt = await window.web3.eth.sendTransaction(tx);
      console.log('Transaksi berhasil:', receipt.transactionHash);
      alert("Swap berhasil!");

      const temp = amountA;
      setAmountA(amountB);
      setAmountB(temp);
    } catch (error) {
      console.error("Transaksi gagal:", error);
      alert("Swap gagal!");
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      {/* 3D Background */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />

      {/* Header */}
      <header className="relative z-10 container flex justify-between items-center py-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
            <span>DEX</span>
          </div>
          <h1 className="text-xl font-bold">DeFiSwap</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {!walletConnected ? (
            <button 
              onClick={connectWallet}
              className="btn btn-primary"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="px-4 py-2 rounded-lg bg-gray-800">
              <span className="font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <main className="container relative z-10 py-8">
        <div className="flex space-x-4 mb-8">
          {['swap', 'liquidity', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Swap Section */}
        {activeTab === 'swap' && (
          <div className="card slide-in">
            <h2 className="text-xl font-bold mb-4">Swap Tokens</h2>
            
            {/* Input Token A */}
            <div className="p-4 rounded-xl mb-4 bg-gray-700">
              <div className="flex justify-between mb-2">
                <span className="opacity-70">From</span>
                <span>Balance: 3.2 ETH</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={amountA}
                  onChange={(e) => setAmountA(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-2xl font-medium outline-none"
                />
                <button 
                  onClick={() => {}}
                  className="px-3 py-1 rounded-lg bg-gray-600"
                >
                  {tokenA} ▼
                </button>
              </div>
            </div>
            
            {/* Swap Button */}
            <div className="flex justify-center -my-4 z-10">
              <button 
                onClick={handleSwap}
                className={`p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white ${isSwapping ? 'animate-spin' : ''}`}
              >
                🔁
              </button>
            </div>
            
            {/* Input Token B */}
            <div className="p-4 rounded-xl mb-6 bg-gray-700">
              <div className="flex justify-between mb-2">
                <span className="opacity-70">To</span>
                <span>Balance: 1200 DAI</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={amountB}
                  onChange={(e) => setAmountB(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-2xl font-medium outline-none"
                />
                <button 
                  onClick={() => {}}
                  className="px-3 py-1 rounded-lg bg-gray-600"
                >
                  {tokenB} ▼
                </button>
              </div>
            </div>
            
            {/* Swap Button */}
            <button
              disabled={!amountA || !amountB || isSwapping}
              onClick={handleSwap}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                !amountA || !amountB || isSwapping
                  ? 'bg-gray-600 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90'
              } text-white shadow-lg hover:shadow-xl`}
            >
              {isSwapping ? 'Swapping...' : 'Swap'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}