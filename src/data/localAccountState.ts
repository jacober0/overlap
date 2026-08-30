const accountScopedKeys = [
  'overlap-preferences',
  'overlap-stage',
  'overlap-selected',
  'overlap-checked',
  'overlap-custom-items',
  'overlap-cooking',
] as const

export function isAccountSwitch(storedOwnerId: string | null, userId: string) {
  // Only the absence of an owner marks legacy data as claimable. Any persisted
  // value (including a malformed empty string) must be treated as another owner
  // unless it exactly matches the authenticated account.
  return storedOwnerId !== null && storedOwnerId !== userId
}

export function resetLocalAccountData(storage: Pick<Storage, 'removeItem' | 'setItem'>, userId: string) {
  accountScopedKeys.forEach(key => storage.removeItem(key))
  storage.setItem('overlap-profile-owner', userId)
}

export function activateLocalAccountData(
  storage: Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>,
  userId: string,
) {
  const switched = isAccountSwitch(storage.getItem('overlap-profile-owner'), userId)
  if (switched) resetLocalAccountData(storage, userId)
  else storage.setItem('overlap-profile-owner', userId)
  return switched
}
