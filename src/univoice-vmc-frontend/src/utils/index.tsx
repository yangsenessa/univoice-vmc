
// 读取存储的值
export const readStorage = (key: string): string | undefined => {
  const r = localStorage.getItem(key);
  if (r == null) return undefined;
  return r;
};

// 写入值
export const writeStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

// 写入值
export const removeStorage = (key: string) => {
  localStorage.removeItem(key);
};
// 固定保留8位小数
export const fmtUvBalanceFull = (balance: string | number) => {
  if (typeof balance === 'number') {
    if (balance < 100000000) {
      return (balance / 100000000).toFixed(8)
    } else {
      let x: string = balance.toString();
      let z: number = Math.floor(balance / 100000000);
      return z.toLocaleString('en-US') + '.' + x.substring(x.length - 8);
    }
  } else {
    if (balance.length < 9) {
      return (parseInt(balance) / 100000000).toFixed(8)
    } else {
      let z = parseInt(balance.substring(0, balance.length - 8))
      return z.toLocaleString('en-US') + '.' + balance.substring(balance.length - 8);
    }
  }
}
// 有小数则显示，可不足8位小数
export const fmtUvBalance = (balance: string | number) => {
  console.log("fmtUvBalance parse balance:", balance);
  if (typeof balance === 'number') {
    if (balance < 100000000) {
      return (balance / 100000000)
    } else {
      let z: number = Math.floor(balance / 100000000)
      let r = z.toLocaleString('en-US')
      let xs = (balance - z * 100000000) / 100000000
      let xsStr = xs.toString()
      let dot = xsStr.indexOf('.')
      if (dot > 0) {
        r += xsStr.substring(dot)
      }
      return  r;
    }
  } else {
    if (balance.length < 9) {
      return (parseInt(balance) / 100000000)
    } else {
      let z = parseInt(balance.substring(0, balance.length - 8))
      let r = z.toLocaleString('en-US')
      let xs = parseInt(balance.substring(balance.length - 8)) / 100000000
      let xsStr = xs.toString()
      let dot = xsStr.indexOf('.')
      if (dot > 0) {
        r += xsStr.substring(dot)
      }
      return r;
    }
  }
}
// 每3位一个逗号
export const fmtInt = (data: number) => {
  return data.toLocaleString('en-US');
}