export interface Event {
    _id: string,
    transactionHash: string,
    name: string,
    symbol: string,
    amount: string,
    from: string,
    to: string,
    eventType: string,
    blockExplorerLink: string,
    createdAt: Date,
    blockNumber: string,
    children?: JSX.Element|JSX.Element[],
}