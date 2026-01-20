import { ethers } from 'ethers';
import { ERC20_ABI, VAULT_ABI } from './contracts';
import { USDC_ADDRESS, VAULT_ADDRESS, USDC_DECIMALS } from '../utils/constants';

export type TxStatus =
    | 'IDLE'
    | 'CHECKING'
    | 'APPROVING'
    | 'DEPOSITING'
    | 'SUCCESS'
    | 'REJECTED'
    | 'FAILED';

export const approveAndDeposit = async ({
    provider,
    signer,
    userAddress,
    amount,
    onStatus,
}: {
    provider: any;
    signer: any;
    userAddress: string;
    amount: string; // human-readable, e.g. "100"
    onStatus: (s: TxStatus) => void;
}) => {
    try {
        onStatus('CHECKING');

        const browserProvider = new ethers.BrowserProvider(provider);
        const signer = await browserProvider.getSigner();


        const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
        const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, signer);

        const parsedAmount = ethers.parseUnits(amount, USDC_DECIMALS);

        // 1️⃣ Check allowance
        const allowance = await usdc.allowance(userAddress, VAULT_ADDRESS);

        if (allowance < parsedAmount) {
            // 2️⃣ Approve
            onStatus('APPROVING');

            const usdcWithSigner = usdc.connect(signer);
            const approveTx = await usdcWithSigner.approve(
                VAULT_ADDRESS,
                parsedAmount
            );

            await approveTx.wait();
        }

        // 3️⃣ Deposit
        onStatus('DEPOSITING');

        const depositTx = await vault.deposit(parsedAmount);
        await depositTx.wait();

        onStatus('SUCCESS');
    } catch (err: any) {
        if (err?.code === 4001) {
            onStatus('REJECTED'); // user rejected in wallet
        } else {
            onStatus('FAILED'); // revert / RPC / gas error
        }
        throw err;
    }
};

