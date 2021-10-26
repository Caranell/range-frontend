import { useEffect, useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import ABI from '../abi/pool_abi.json'

export function useSwap() {
  const { library } = useWeb3React();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (!library) {
      return;
    }
    setContract(new ethers.Contract(
      poolAddress,
      ABI,
      library
    ));
  }, [library])

  const swapTokens = useCallback(async (tokenFrom, amount, tokenTo) => {
    if (!contract) { 
      return;
    }

    if (!tokenFrom || !amount || !tokenTo) {
      return;
    }

    const maxCanSwap = await contract.maxCanSwap(tokenFrom, tokenTo);
    if (maxCanSwap < amount) {
      return;
    }

    const signer = contract.connect(library.getSigner());
    return signer.swap(tokenFrom, amount, tokenTo);
  }, [contract])

  return { swapTokens };
}

