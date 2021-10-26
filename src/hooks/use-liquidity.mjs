import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import ABI from '../abi/pool_abi.json'

export function useLiquidity(poolAddress, token, amount) {
    const { library } = useWeb3React()

    const [liquidity, setLiquidity] = useState(null)

    useEffect(async () => {
        // we're not connected
        if (!library) {
            return
        }
        const contract = new ethers.Contract(
            poolAddress,
            ABI,
            library
        )
        const signer = contract.connect(library.getSigner());
        const gasLimit = await signer.estimateGas.add(token, amount)
        setLiquidity({
            add: () => signer.add(token, amount, { gasLimit }),
            remove: () => signer.remove(token, amount, { gasLimit })
        })
    }, [library])

    return liquidity
}
