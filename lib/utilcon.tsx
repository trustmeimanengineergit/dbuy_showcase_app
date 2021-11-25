import supportedChains from './chains'
import { IChData } from './types'

export function getChainData(chainId?: number): IChData {
  if (!chainId) {
    return null as any;
  }
  
  const API_KEY = 'f3dd42abafda415aa2059aa483ac94e1'

  const chainData = supportedChains.filter(
    (chain: any) => chain.chain_id === chainId
  )[0]

  if (!chainData) {
    throw new Error('Not Mainnet/Ropsten.')
  }

  if (
    chainData.rpc_url.includes('infura.io') &&
    chainData.rpc_url.includes('%API_KEY%') &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY)

    return {
      ...chainData,
      rpc_url: rpcUrl,
    }
  }

  return chainData
}
