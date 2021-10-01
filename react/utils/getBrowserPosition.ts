export default function getNavigatorCoordinates() {
  return new Promise<Position>((resolve, reject) => {
    // valido si el navegador web tiene la api de geolocalizacion
    if (!navigator.geolocation) {
      return reject({
        code: -1,
        message: 'Geolocation unavailable',
      })
    }

    // obtengo la informacion de posicion del navegador web
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 5000,
    })
  })
}
