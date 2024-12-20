
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