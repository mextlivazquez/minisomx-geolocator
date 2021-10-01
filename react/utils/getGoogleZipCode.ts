// codigo postal por defecto (CEDIS)
let zipCode = '5000'

export default function getGoogleZipCode(latitude: number, longitude: number) {
  return new Promise((resolve, reject) => {
    // TODO: cambiar appkey de google por variable de entorno
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA0_FeNed3BFh7WWQaTSBRoP3UvzS1R_pA&latlng=${latitude},${longitude}`
    )
      .then(response => {
        console.info('Request to google geolocator api!')
        return response.json()
      })
      .then(data => {
        // encontrar cp en la informacion de google
        const availableAddress =
          data.results.find(
            ({ address_components }: any) =>
              address_components.find(
                ({ types }: any) => types.indexOf('postal_code') > -1
              ) || null
          ) || null

        // guardo el codigo postal que manda google
        if (availableAddress) {
          zipCode = availableAddress.address_components[6].short_name
        }

        // if (!zipCode) {
        //   return reject({
        //     code: -2,
        //     message: 'Unavailable zipcode by google locator api',
        //   })
        // }

        // retorno el cp por defecto para la latitud y longitud
        resolve(zipCode)
      })
      .catch((error: ErrorEvent) => {
        reject({
          code: -3,
          message: error.message,
        })
      })
  })
}
