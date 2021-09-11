export interface StoreSelectorProps {
  mainButtonWelcomeText: string
  mainButtonSelectedStoreText: string
  storeModalTitle: string
  storeModalFooterDisclaimer: string
  intl: any
  isMobile: boolean,
  StoreSelector: StoreSelector
 
}

export interface StoreSelector{
  txtDefautButton: string,
  txtBackButton: string
}