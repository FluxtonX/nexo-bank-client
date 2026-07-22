const fs = require('fs');
const file = 'c:/Projects/cdnt project/northunion/src/components/dashboard/withdraw-workspace.tsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split(/\r?\n/);

const firstReturnIdx = lines.findIndex(l => l.trim() === 'return (');
const useEffectIdx = lines.findIndex(l => l.startsWith('  useEffect(() => {'));
const confirmEndIdx = lines.findIndex(l => l === '    } finally {') + 3;
const secondReturnIdx = lines.findIndex((l, i) => i > firstReturnIdx && l.trim() === 'return (');
const step2Idx = lines.findIndex((l, i) => i > secondReturnIdx && l.includes('{/* Step 2: Recipient Details */}'));

const hooksContent = lines.slice(useEffectIdx, confirmEndIdx + 1).join('\n');

const stateDefs = [
  '  const [userEmail, setUserEmail] = useState<string | null>(null);',
  '  const [sendingOtp, setSendingOtp] = useState(false);'
].join('\n');

const newLines = [];
newLines.push(...lines.slice(0, firstReturnIdx));
newLines.push(stateDefs);
newLines.push(hooksContent);
newLines.push('  return (');
newLines.push(...lines.slice(firstReturnIdx + 1, useEffectIdx - 1));
newLines.push(...lines.slice(step2Idx));

// Replace Step 3 variables
let finalContent = newLines.join('\n');
finalContent = finalContent.replace(
  '${numAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}',
  '{isCADAsset ? `$${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD` : `${numAmount} ${selectedAsset}`}'
);
finalContent = finalContent.replace(
  '${fee.toFixed(2)}',
  '{isCADAsset ? `$2.50 CAD` : `${feeInCrypto.toFixed(8)} ${selectedAsset} ($2.50 CAD)`}'
);
finalContent = finalContent.replace(
  '${youReceive.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}',
  '{youReceiveDisplay}'
);

fs.writeFileSync(file, finalContent);
console.log('File patched successfully');
