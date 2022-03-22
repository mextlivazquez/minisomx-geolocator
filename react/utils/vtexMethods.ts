const vtexAppKey = 'vtexappkey-minisomx-JASTFM'
const vtexAppToken =
  'AOFISFLGBSZBLOYDQOMTDFRPOBEIJSTYYEXIKCKOBZPNBUKXHSNIACNUXQUQBDWIYBDGQPSOEXSEPDOTRGBQFKYWRDLUIUNYCHPARDHRAZECKIFTCAYVBFCNCGPNEYFJ'
const cedisStoreCode = 'minisomxt0203'

// headers por defecto para peticiones a la api de vtex
const defaultHeaders: object = {
  Accept: 'application/json',
  'x-vtex-api-appKey': vtexAppKey,
  'Content-Type': 'application/json',
  'x-vtex-api-appToken': vtexAppToken,
}

// informacion de la tienda por default (cedis)
const defaultBestDeliveryStore: any = {
  storeId: cedisStoreCode,
  storeName:
    'Mensajería - Entrega a Domicilio. La mayoría de nuestros pedidos llegan entre 24 y 72 hrs',
}

/*
// producto para hacer la simulacion de carrito de google
function getProductSimulationData(zipCode: string, sku?: string) {
  return {
    items: [
      {
        id: sku || '4841', // Sku con inventario infinito y disponibilidad en todas las tiendas
        seller: '1',
        quantity: '1',
      },
    ],
    country: 'MEX',
    postalCode: zipCode,
  }
}

// crea una simulacion al agregar un producto de prueba al carrito
async function makeSimulationStore(zipCode: string, sku?: string) {
  const productData = getProductSimulationData(zipCode, sku)
  const request = await fetch('/api/checkout/pub/orderforms/simulation', {
    method: 'POST',
    headers: { ...defaultHeaders },
    body: JSON.stringify(productData),
  })

  const response = await request.json()
  return response
}

// obtengo la mejor tienda desde vtex
async function getBestDeliveryStore(vtexSessionResponse: any) {
  // valido para encontrar el warehouseId de la tienda relacionada al codigo postal
  if (
    vtexSessionResponse &&
    vtexSessionResponse.logisticsInfo &&
    (vtexSessionResponse.logisticsInfo || []).length
  ) {
    const logisticsInfo = vtexSessionResponse.logisticsInfo[0]
    const deliverySlas = (logisticsInfo.slas || []).filter(
      ({ deliveryChannel }: any) => deliveryChannel === 'delivery'
    )
    if ((deliverySlas || []).length) {
      const sla = deliverySlas[0]

      // si el canal de entrega es diferente a delivery y existen deliveryIds
      // obtengo el id del almacen de la tienda
      if (sla.deliveryIds && (sla.deliveryIds || []).length) {
        const deliveryId = sla.deliveryIds[0]
        // obtengo el id del almacen para la tienda
        return {
          storeId: `minisomx${deliveryId.warehouseId}`.toLowerCase(),
          storeName: sla.name,
        }
      }
    }
  }

  return defaultBestDeliveryStore
}
*/

// guardo los valores de la mejor tienda en la sesion del usuario
async function saveDataStore(storeId: string) {
  const request = await fetch('/api/sessions', {
    headers: { ...defaultHeaders },
    method: 'POST',
    body: JSON.stringify({
      public: {
        country: { value: 'MEX' },
        regionId: { value: btoa(`SW#${storeId}`) },
      },
    }),
  })

  const response = await request.json()
  return response
}

// obtengo el nombre del seller
async function saveStoreInfo(storeId: string) {
  const request = await fetch(`/api/catalog_system/pvt/seller/${storeId}`, {
    headers: { ...defaultHeaders },
  })
  const response = await request.json()

  // guardo en el localstorage el id y nombre de la tienda
  localStorage.storeid = response.SellerId

  // guardo el nombre de la tienda o Cedis
  localStorage.storename = response.Name

  return response
}

// guardo la información en el la sesion de usuario
export default async function saveUserStoreInfo(/* zipCode: any */) {
  // guardo el cedis por defecto cuando no existe el codigo postal y lo limito a un codigo postal mayor 99999
  // if (!zipCode || zipCode === '5000' || +zipCode >= 99999) {
  await saveDataStore(cedisStoreCode)
  await saveStoreInfo(cedisStoreCode)
  return defaultBestDeliveryStore
  // }

  /*
  // simulo el carrito agregando por defecto un sku con inventario infinito
  const simulation = await makeSimulationStore(zipCode)

  // obtengo la mejor tienda asociada a la simulacion
  let bestDeliveryStore = await getBestDeliveryStore(simulation)

  // si el id de la tienda es el mismo que el cedis, intento con otro sku y
  // el mismo codigo postal
  if (bestDeliveryStore.storeId === cedisStoreCode) {
    const newSimulation = await makeSimulationStore(zipCode, '4214')
    bestDeliveryStore = await getBestDeliveryStore(newSimulation)
  }

  // guardo la informacion de la tienda en la sesion de compra (orderform)
  await saveDataStore(bestDeliveryStore.storeId)

  // guardo la informacion de la tienda en el localStorage
  await saveStoreInfo(bestDeliveryStore.storeId)

  return bestDeliveryStore
  */
}
