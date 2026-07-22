const fs = require('fs');
const file = 'c:/Projects/cdnt project/northunion/src/components/dashboard/withdraw-workspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add cadAmount state and useEffect for selectedAsset
content = content.replace(
  'const [amount, setAmount] = useState("");',
  'const [amount, setAmount] = useState("");\n  const [cadAmount, setCadAmount] = useState("");'
);

content = content.replace(
  'const wallets = metrics?.wallets || [];',
  `const wallets = metrics?.wallets || [];\n  \n  useEffect(() => {\n    if (wallets.length > 0 && !wallets.some(w => w.currency === selectedAsset)) {\n      setSelectedAsset(wallets[0].currency);\n    }\n  }, [wallets, selectedAsset]);`
);

// 2. Add handleCryptoChange and handleCadChange before return
const handlers = `
  const handleCryptoChange = (val: string) => {
    setAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && selectedRate > 0) {
      setCadAmount((num * selectedRate).toFixed(2));
    } else {
      setCadAmount("");
    }
  };

  const handleCadChange = (val: string) => {
    setCadAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && selectedRate > 0) {
      setAmount((num / selectedRate).toFixed(8));
    } else {
      setAmount("");
    }
  };
`;

content = content.replace(
  '  return (\n        <div className="mx-auto',
  handlers + '\n  return (\n        <div className="mx-auto'
);

// 3. Update onChange in Select Asset
content = content.replace(
  /setAmount\(""\);/g,
  'handleCryptoChange("");'
);

// 4. Update the input field and add CAD input
const inputSection = `
              <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">
                {isCADAsset ? "Enter amount in CAD" : \`Enter amount in \${selectedAsset}\`}
              </label>
              <input 
                type="number" 
                placeholder={isCADAsset ? "0.00" : "0.00000000"}
                value={amount}
                onChange={(e) => handleCryptoChange(e.target.value)}
                step={isCADAsset ? "0.01" : "0.00000001"}
                className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[16px] font-medium text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
              />
              {!isCADAsset && (
                <div className="mt-4">
                  <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">
                    Or enter amount in CAD
                  </label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={cadAmount}
                    onChange={(e) => handleCadChange(e.target.value)}
                    step="0.01"
                    className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[16px] font-medium text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
                  />
                </div>
              )}
`;
// We replace from `<label ...>` to `)}` of the `cadEquivalent` paragraph
content = content.replace(
  /<label className="mb-2 block text-\[14px\] font-bold text-\[#0A0F2C\]">[\s\S]*?\{!isCADAsset && numAmount > 0 && \([\s\S]*?\)\}*?/m,
  inputSection
);

// 5. Update preset buttons
content = content.replace(
  /onClick=\{\(\) => setAmount\(preset\)\}/g,
  'onClick={() => handleCryptoChange(preset)}'
);
content = content.replace(
  /onClick=\{\(\) => setAmount\(cryptoAmt\)\}/g,
  'onClick={() => handleCryptoChange(cryptoAmt)}'
);
content = content.replace(
  /onClick=\{\(\) => setAmount\(isCADAsset \? availableBalance\.toString\(\) : selectedWallet\.balance\.toString\(\)\)\}/g,
  'onClick={() => handleCryptoChange(isCADAsset ? availableBalance.toString() : selectedWallet.balance.toString())}'
);

fs.writeFileSync(file, content);
console.log('File patched successfully');
