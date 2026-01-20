export const ERC20_ABI = [
    'function balanceOf(address) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
];

export const VAULT_ABI = [
    'function deposit(uint256 amount)',
    'function balanceOf(address) view returns (uint256)',
];
