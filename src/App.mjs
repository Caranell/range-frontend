import React, { useCallback } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { useWeb3React, Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { injected } from './connectors'

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 960px;
  margin: 0 auto;
`

function Connect () {
  const { active, account, activate } = useWeb3React()
  const connect = useCallback(async () => {
    await injected.activate()
    const isAuthorized = await injected.isAuthorized()
    if (isAuthorized) {
      activate(injected, undefined, false)
    }
  }, [activate])

  if (active) {
    return <div>Connected as {account}</div>
  } else {
    return <button onClick={connect}>Connect</button>
  }
}

function Header () {
  return <HeaderContainer>
    <h1>Range</h1>
    <Connect />
  </HeaderContainer>
}

function App () {
  return (
    <>
      <Header />
      welcome frens
    </>
  )
}

function getLibrary (provider) {
  return new ethers.providers.Web3Provider(provider)
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <App />
  </Web3ReactProvider>,
  document.getElementById('root')
)
