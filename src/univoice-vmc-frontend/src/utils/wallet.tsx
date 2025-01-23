import { useAcountStore } from '@/stores/user'
import { queryBalance as queryPlugBalance, getPlugPrincipal, call_get_transactions as plug_call_get_transactions, call_tokens_of as plug_call_tokens_of } from '@/utils/icplug'
import { WALLET_TYPE, TransferResponse, ERROR_MSG } from '@/utils/uv_const'

export const queryBalance = async (wallet_type: string='') => {
  const walletType = wallet_type || useAcountStore.getState().getWalletType()
  if (WALLET_TYPE.PLUG === walletType) {
    return queryPlugBalance()
  }
  return Promise.reject(ERROR_MSG.UNKNOWN_WALLET_TYPE)
}

export const getPrincipal = async (): Promise<string> => {
  const walletType = useAcountStore.getState().getWalletType()
  if (!walletType) {
    return Promise.reject(ERROR_MSG.WALLET_NOT_CONNECTED)
  }
  if (WALLET_TYPE.PLUG === walletType) {
    return getPlugPrincipal()
  }
  return Promise.reject(ERROR_MSG.UNKNOWN_WALLET_TYPE)
}

// 未使用
// 检查当前用户是否连接
export const currentUserConnected = async () => {
  const userPrincipal = useAcountStore.getState().getPrincipal()
  if (!userPrincipal) {
    console.log('currentUserConnected: false, no user pid')
    return Promise.resolve(false)
  }
  const walletType = useAcountStore.getState().getWalletType()
  if (WALLET_TYPE.PLUG === walletType) {
    const eq = await getPlugPrincipal().then((principal) => {
      const comparePid = userPrincipal === principal
      if (!comparePid) {
        console.log('currentUserConnected: ', comparePid)
        console.log('user pid: ', userPrincipal)
        console.log('wallet pid: ', principal)
      }
      return comparePid
    })
    return Promise.resolve(eq)
  } else {
    return Promise.reject(ERROR_MSG.UNKNOWN_WALLET_TYPE)
  }
}

export const checkLoginByWallet = async (): Promise<boolean> => {
  const userPrincipal = useAcountStore.getState().getPrincipal()
  const walletType = useAcountStore.getState().getWalletType()
  if (!walletType) {
    if (userPrincipal) {
      useAcountStore.getState().clearAccount()
    }
    return Promise.resolve(false)
  }
  let principal;
  if (WALLET_TYPE.PLUG === walletType) {
    principal = await getPlugPrincipal()
  } else {
    if (userPrincipal) {
      useAcountStore.getState().clearAccount()
    }
    return Promise.resolve(false)
  }
  if (!principal) {
    if (userPrincipal) {
      useAcountStore.getState().clearAccount()
    }
    return Promise.resolve(false)
  }
  const equal = principal === userPrincipal
  if (!equal) {
    console.log('checkLoginByWallet eq: ', equal)
    console.log('user pid: ', userPrincipal)
    console.log('wallet pid: ', principal)
    useAcountStore.getState().setUserByWallet(WALLET_TYPE.PLUG, principal)
  }
  return Promise.resolve(true)
}

export const call_get_transactions = async (pre:number, take:number): Promise<TransferResponse[]> => {
  const walletType = useAcountStore.getState().getWalletType()
  if (!walletType) {
    return Promise.reject(ERROR_MSG.WALLET_NOT_CONNECTED)
  }
  if (WALLET_TYPE.PLUG === walletType) {
    return plug_call_get_transactions(pre, take)
  } else {
    return Promise.reject(ERROR_MSG.UNKNOWN_WALLET_TYPE)
  }
}

export const call_tokens_of = async () : Promise<Array<bigint>> => {
  const walletType = useAcountStore.getState().getWalletType()
  if (!walletType) {
    return Promise.reject(ERROR_MSG.WALLET_NOT_CONNECTED)
  }
  if (WALLET_TYPE.PLUG === walletType) {
    return plug_call_tokens_of()
  } else {
    return Promise.reject(ERROR_MSG.UNKNOWN_WALLET_TYPE)
  }
}