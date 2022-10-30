function getLocalStorageKey(localStorageId: string, localStorageValueKey) {
  return `${localStorageId}_${localStorageValueKey}`;
}

export default getLocalStorageKey;
