export enum HttpMethod {
    POST='POST',
}
export const ETHEREUM_NETWORK_ID = '1'

const theGraphUrlGenerator = ( protocolName: string, subgraphName: string ): string => {
    return `https://api.thegraph.com/subgraphs/name/${protocolName}/${subgraphName}`
}

export const daohausGraphConfig: { [key: string]: any } = {
    '1': 'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus',
    '100': 'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-xdai',
    '4': 'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-rinkeby',
    '10': 'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-optimism',
}

export const daostackGraphConfig: { [key: string]: any } = {
    '1': 'https://api.thegraph.com/subgraphs/name/daostack/v41_11',
    '100': 'https://api.thegraph.com/subgraphs/name/daostack/v41_11_xdai',
}

export const aaveGraphConfig: { [key: string]: any } = {
    '1': 'https://api.thegraph.com/subgraphs/name/aave/governance-v2',
}

export const gnosisGraphConfig: { [key: string]: any } = {
    '1': 'https://api.thegraph.com/subgraphs/name/gjeanmart/gnosis-safe-mainnet'
}

export const gnosisApiConfig: { [key: string]: any } = {
    '1': 'https://safe-transaction-mainnet.safe.global/api/v1'
}

export const gitcoinGraphConfig: { [ key: string ]: any } = 
{
    // TODO: url probably isn't right
    ETHEREUM_NETWORK_ID: theGraphUrlGenerator('gitcoin', 'governance-v2')
}
