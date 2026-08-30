const accountScopedKeys = [
  'overlap-preferences',
  'overlap-stage',
  'overlap-selected',
  'overlap-checked',
  'overlap-custom-items',
] as const

export function isAccountSwitch(storedOwnerId: string | null, userId: string) {
  return Boolean(storedOwnerId && storedOwnerId !== userId)
}

export function resetLocalAccountData(storage: Pick<Storage, 'removeItem' | 'setItem'>, userId: string) {
  accountScopedKeys.forEach(key => storage.removeItem(key))
  storage.setItem('overlap-profile-owner', userId)
}
