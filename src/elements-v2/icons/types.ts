export const ionIconTypes = [
  'open-outline',
  'chevron-forward-circle-outline',
  'chevron-up-outline',
  'chevron-down-outline',
  'arrow-back-outline'
] as const;
export type IonIconType = typeof ionIconTypes[number];

export const ionIconKeyTypes = [
  'openOutline',
  'chevronForwardCircleOutline',
  'chevronUpOutline',
  'chevronDownOutline',
  'arrowBackOutline'
] as const;
export type IonIconKeyType = typeof ionIconKeyTypes[number];
