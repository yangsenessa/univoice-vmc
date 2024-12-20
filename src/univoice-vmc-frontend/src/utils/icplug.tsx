export const plugReady = (): boolean => {
  const w = window as any;
  if (!w.ic || !w.ic.plug) {
    return false;
  }
  return true;
}

// Canister Ids
const nnsCanisterId  = 'qoctq-giaaa-aaaaa-aaaea-cai';
// Whitelist
const whitelist = [
  nnsCanisterId,
];
// Host
const host = "https://mainnet.dfinity.network";

export const reConnectPlug = async (): Promise<string> => {
  if (!plugReady()) return '';
  const plug = (window as any).ic.plug;
  // 断开旧的连接
  try{
    // if (plug.principalId) {
    plug.disconnect()
    // }
  } catch (e) {
    console.log('disconnect ic plug exception!', e);
  }
  try {
    const publicKey = await plug.requestConnect({
      // whitelist,
      // host,
      timeout: 50000
    });
    return plug.principalId ? plug.principalId : '';
  } catch (e) {
    console.log('connect ic plug exception!', e);
    return '';
  }
}

// const getPrincipal = async (): Promise<string> => {
//   if (!plugReady()) return '';
//   const plug = (window as any).ic.plug;
//   // const isConnected = await plug.isConnected(); // 会弹出连接窗
//   return plug.principalId ? plug.principalId : '';
// }

export default reConnectPlug;