import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import ABI from '../abi/pool_abi.json'

export function usePool (poolAddress) {
  const { library } = useWeb3React()
  const [poolInfo, setPoolInfo] = useState({
    loading: true
  })

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

    // get fee
    const fee = await contract.fee()

    // enumerate the 5 tokens in the genesis pool for now
    // later on we should make this more robust - there is
    // no way to get the number of tokens in the pool
    // without indexing events
    const tokens = []
    for (let i = 0; i < 5; i++) {
      const tokenAddress = await contract.tokens(i)
      const tokenInfo = await contract.tokenInfo(tokenAddress)
      tokens.push({
        address: tokenAddress,
        accepting: tokenInfo.accepting,
        lowAP: tokenInfo.lowAP,
        highAP: tokenInfo.highAP,
        maxCanAdd: contract.maxCanAdd,
        maxCanRemove: contract.maxCanRemove,
        maxCanSwap: contract.maxCanSwap
      })
    }

    setPoolInfo({
      loading: false,
      fee,
      tokens
    })
  }, [library])

  return poolInfo
}

