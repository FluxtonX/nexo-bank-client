export type DepositAsset = "BTC" | "ETH" | "USDT" | "fiat";

export type DepositNetwork = "BTC" | "ETH" | "TRC20" | "ERC20";

export type DepositAddressConfig = {
  asset: DepositAsset;
  assetName: string;
  network: DepositNetwork;
  networkName: string;
  address: string;
  qrValue: string;
  warning: string;
  explorerName: string;
  explorerTxUrl: string;
  verificationApiName: string;
  verificationApiEndpoint: string;
  minAmount: number;
  confirmations: number;
  arrivalTime: string;
  logoUrl?: string;
};

export type DepositRequestInput = {
  asset: DepositAsset;
  network: DepositNetwork;
  companyAddress: string;
  expectedAmount: number;
  txHash: string;
};

const BTC_ADDRESS = "bc1q7q50t9edden65k94vjzqef0lx3vfjjv4klz5zy";
const ETH_ADDRESS = "0x150B3BB98224598e20821De1A516A9fcC3bB65f9";
const USDT_TRC20_ADDRESS = "TVphkS3RjtbYV5TQAyNnc27Ae4BKFrV7QK";
const USDT_ERC20_ADDRESS = "0x150B3BB98224598e20821De1A516A9fcC3bB65f9";

export const DEPOSIT_ADDRESSES: DepositAddressConfig[] = [
  {
    asset: "BTC",
    assetName: "Bitcoin",
    network: "BTC",
    networkName: "Bitcoin Network",
    address: BTC_ADDRESS,
    qrValue: BTC_ADDRESS,
    warning:
      "Send only BTC on Bitcoin Network network to this address. Sending any other coin or network may cause permanent loss.",
    explorerName: "Blockstream Explorer",
    explorerTxUrl: "https://blockstream.info/tx/{TX_HASH}",
    verificationApiName: "Blockstream Explorer API",
    verificationApiEndpoint: "https://blockstream.info/api/tx/{TX_HASH}",
    minAmount: 0.001,
    confirmations: 3,
    arrivalTime: "30 mins",
    logoUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  {
    asset: "ETH",
    assetName: "Ethereum",
    network: "ETH",
    networkName: "Ethereum Mainnet",
    address: ETH_ADDRESS,
    qrValue: ETH_ADDRESS,
    warning:
      "Send only ETH on Ethereum Mainnet network to this address. Sending any other coin or network may cause permanent loss.",
    explorerName: "Etherscan",
    explorerTxUrl: "https://etherscan.io/tx/{TX_HASH}",
    verificationApiName: "Etherscan API V2",
    verificationApiEndpoint:
      "https://api.etherscan.io/v2/api?chainid=1&module=proxy&action=eth_getTransactionByHash&txhash={TX_HASH}&apikey={ETHERSCAN_API_KEY}",
    minAmount: 0.001,
    confirmations: 12,
    arrivalTime: "5-15 mins",
    logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    asset: "USDT",
    assetName: "Tether",
    network: "TRC20",
    networkName: "TRON TRC20",
    address: USDT_TRC20_ADDRESS,
    qrValue: USDT_TRC20_ADDRESS,
    warning:
      "Send only USDT on TRON TRC20 network to this address. Sending any other coin or network may cause permanent loss.",
    explorerName: "Tronscan",
    explorerTxUrl: "https://tronscan.org/#/transaction/{TX_HASH}",
    verificationApiName: "TronGrid API",
    verificationApiEndpoint: "https://api.trongrid.io/v1/accounts/{ADDRESS}/transactions/trc20",
    minAmount: 10,
    confirmations: 20,
    arrivalTime: "2-10 mins",
    logoUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  {
    asset: "USDT",
    assetName: "Tether",
    network: "ERC20",
    networkName: "Ethereum ERC20",
    address: USDT_ERC20_ADDRESS,
    qrValue: USDT_ERC20_ADDRESS,
    warning:
      "Send only USDT on Ethereum ERC20 network to this address. Sending any other coin or network may cause permanent loss.",
    explorerName: "Etherscan",
    explorerTxUrl: "https://etherscan.io/tx/{TX_HASH}",
    verificationApiName: "Etherscan ERC20 Token Transfer API",
    verificationApiEndpoint:
      "https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&address={ADDRESS}&contractaddress={USDT_ERC20_CONTRACT}&apikey={ETHERSCAN_API_KEY}",
    minAmount: 10,
    confirmations: 12,
    arrivalTime: "5-15 mins",
    logoUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
];

export function getDepositConfig(asset: string, network?: string) {
  const normalizedAsset = asset.toUpperCase();
  const normalizedNetwork = network?.toUpperCase();

  return (
    DEPOSIT_ADDRESSES.find(
      (item) =>
        item.asset === normalizedAsset &&
        (!normalizedNetwork || item.network === normalizedNetwork),
    ) ?? DEPOSIT_ADDRESSES.find((item) => item.asset === normalizedAsset) ?? DEPOSIT_ADDRESSES[0]
  );
}

export function getDepositNetworks(asset: DepositAsset) {
  return DEPOSIT_ADDRESSES.filter((item) => item.asset === asset);
}
