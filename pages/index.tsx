import { providers } from 'ethers'
import Head from 'next/head'
import { useCallback, useReducer } from 'react'
import Web3Modal from 'web3modal'
import { getChainData } from '../lib/utilcon'

const providerOptions = {
}

let web3Modal: Web3Modal
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions, // required
  })
}

type StateType = {
  provider?: any
  web3Provider?: any
  address?: string
  chainId?: number
}

type ActionType =
  | {
      type: 'SET_WEB3_PROVIDER'
      provider?: StateType['provider']
      web3Provider?: StateType['web3Provider']
      address?: StateType['address']
      chainId?: StateType['chainId']
    }
  | {
      type: 'SET_ADDRESS'
      address?: StateType['address']
    }
  | {
      type: 'SET_CHAIN_ID'
      chainId?: StateType['chainId']
    }
  | {
      type: 'RESET_WEB3_PROVIDER'
    }

const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: null as any,
  chainId: null as any,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    default:
      throw new Error()
  }
}

export const Home = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { provider, web3Provider, address, chainId } = state

  const connect = useCallback(async function () {
    const provider = await web3Modal.connect()
    const web3Provider = new providers.Web3Provider(provider)
    const sign = web3Provider.getSigner()
    const address = await sign.getAddress()
    const network = await web3Provider.getNetwork()

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    })
  }, [])

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider()
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect()
      }
      dispatch({
        type: 'RESET_WEB3_PROVIDER',
      })
    },
    [provider]
  )

  const chainData = getChainData(chainId)

  return (
    <div>
      <Head>
        <title>Showcase App</title>
      </Head>

      <main style={{ textAlign: 'center' }}>
        <h1>Wallet Connect Showcase</h1>
        <h3>@trustmeimanengineer</h3>
        {web3Provider ? (
          <button className="conn" type="button" onClick={disconnect}>
            Disconnect from Wallet
          </button>
        ) : (
          <button className="conn" type="button" onClick={connect}>
            Connect to Wallet
          </button>
        )}
        <style jsx>{`
        .conn {
          padding: 1rem 2rem;
          color: white;
          background: gray;
          font-size: 1rem;
        }
      `}</style>
        {address && (
          <div>
            <div>
              <p>{address} ({chainData?.name})</p>
            </div>
          </div>
        )}
      </main>

    </div>
  )
}

export default Home