import React, { useState, useEffect } from 'react'
import { StoreSelectorProps } from './typings/global'
import { Modal } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import './components/global.css'
import { canUseDOM } from 'vtex.render-runtime'

// utils
import getBrowserPosition from './utils/getBrowserPosition'
import getGoogleZipCode from './utils/getGoogleZipCode'
import saveUserStoreInfo from './utils/vtexMethods'

const CSS_HANDLES = [
  'wraper',
  'titleModalRegions',
  'regionItem',
  'regionItems',
  'regionItemSubs',
  'backButton',
  'buttonHandle',
  'imageFranchise',
  'imageFranchiseWrapper',
  'inputCpFranchise',
  'submitFranchise',
  'franchiseContentWrapper',
  'reponseWrapper',
  'titleFranchise',
  'subTitleFranchise',
  'spanFranchise',
  'highlightSpan',
  'txtEnvio',
  'envioss',
  'envioss2',
  'express',
] as const

export interface GeolocationPositionError {
  code: number
  message: string
}

// guardo el código postal en el localStorage desde el modal
function handleStoreUserZipCode(userZipCode: string) {
  if (userZipCode) {
    localStorage.zipcode = userZipCode
  }
  return true
}

const StoreSelector: StorefrontFunctionComponent<StoreSelectorProps> = ({
  StoreSelector,
}) => {
  const [txtEnvio /*handleTxtEnvio*/] = useState('')
  const [isModalOpen, handleOpenModal] = useState(false)
  const [txtResponse /*handleTxtResponse*/] = useState('')
  const [txtSubmit, handleTxtSubmit] = useState('Buscar')
  const handles = useCssHandles(CSS_HANDLES)
  const [selectedStoreName, setSelectedStoreName] = useState(
    (canUseDOM && localStorage.storename) || StoreSelector.txtDefautButton
  )

  // manejo la activacion del modal dependiendo las respuestas
  function handleCloseModal(event: Event) {
    event.preventDefault()
    event.stopPropagation()

    // guardo por defecto el cedis mandando el cp como nulo
    saveUserStoreInfo(null)

    // cierro modal
    handleOpenModal(false)
  }

  async function handleSetZipCode(event: any) {
    event.preventDefault()

    // obtengo el codigo postal del modal
    const zipCode: string =
      (((event || {}).target || {}).zipcode || {}).value || null

    // guardo cp en el (localStorage del navegador
    handleStoreUserZipCode(zipCode)
    handleTxtSubmit('Buscando...')

    // guardo los datos de la tienda en la sesion de usuario para el carrito
    await saveUserStoreInfo(zipCode)

    // actulizo el nombre de la tienda en el header
    setSelectedStoreName(localStorage.storename)
    // handleTxtSubmit('Encontrado!')

    // cierro modal
    handleOpenModal(false)

    return true
  }

  useEffect(() => {
    // leer cp guardado en el navegador
    if (!localStorage.zipcode) {
      // obtengo informacion de la posicion del navegador
      getBrowserPosition()
        .then((position: Position) => {
          const latitude: number = position.coords.latitude
          const longitude: number = position.coords.longitude

          // obtengo codigo postal de google geolocator
          getGoogleZipCode(latitude, longitude)
            .then(async (zipCode: any) => {
              // guardo el codigo postal en la sesion del usuario
              handleStoreUserZipCode(zipCode)

              // guardo los datos en la sesion de usuario
              await saveUserStoreInfo(zipCode)

              // actulizo el nombre de la tienda en el header
              setSelectedStoreName(localStorage.storename)
            })
            .catch((error: ErrorEvent) => {
              saveUserStoreInfo('5000')

              // lanzo modal para pedir CP del cliente al ocurrir un error en la
              // API de Google o que no se haya encontrado un cp asociado a
              // la ubicacion (lat, long) del cliente
              // handleOpenModal(true)

              console.error(error)
            })
        })
        .catch((error: GeolocationPositionError) => {
          saveUserStoreInfo('5000')

          // lanzo modal para pedir CP del cliente al ocurrir un error o
          // que el usuario haya denegado compartir la ubicacion
          // handleOpenModal(true)

          console.error(error)
        })
    } else {
      // existe cp, verifico si existe en la sesion de usuario
      saveUserStoreInfo(localStorage.zipcode)
    }
  }, [isModalOpen])

  return (
    <React.Fragment>
      <div className={`${handles.wraper} flex items-center`}>
        <button
          className={`vtex-button flex ${handles.buttonHandle}`}
          onClick={() => handleOpenModal(true)}
        >
          {selectedStoreName}
        </button>
        {canUseDOM && (
          <Modal
            centered
            showCloseIcon
            class="miniso-modal"
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          >
            <div className="vtex-modal-content flex flex-center">
              <div className={`${handles.franchiseContentWrapper} column-sm`}>
                <span
                  className={`${handles.titleFranchise} ${handles.spanFranchise}`}
                >
                  INGRESA TU CÓDIGO POSTAL
                </span>
                <span
                  className={`${handles.subTitleFranchise} ${handles.spanFranchise}`}
                >
                  {'para ofrecerte un mejor servicio '}
                  <b className={`${handles.highlightSpan}`}>
                    económica y rápida
                  </b>
                  {' de entrega.'}
                </span>
                <form onSubmit={handleSetZipCode}>
                  <input
                    // onChange={event => setCP(event.target.value)}
                    className={`${handles.inputCpFranchise} inputcode`}
                    placeholder="Tu código postal a 5 dígitos"
                    type="text"
                    maxLength={5}
                    name="zipcode"
                  />
                  <button className={handles.submitFranchise}>
                    {txtSubmit}
                  </button>
                </form>
                <div className={`${handles.reponseWrapper}`}>{txtResponse}</div>
                <div className={`${handles.txtEnvio}`}>{txtEnvio}</div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </React.Fragment>
  )
}

//This is the schema form that will render the editable props on SiteEditor
StoreSelector.defaultProps = {
  StoreSelector: {
    txtDefautButton: 'Selecciona tu tienda',
    txtBackButton: 'Regresar',
  },
}

StoreSelector.schema = {
  title: 'editor.store-locator.title',
  deion: 'editor.store-locator.deion',
  type: 'object',
  properties: {
    StoreSelector: {
      type: 'object',
      properties: {
        txtDefautButton: {
          type: 'String',
          title: 'Texto default',
          // default: StoreSelector.defaultProps.StoreSelector?.txtDefautButton
        },
        txtBack: {
          type: 'String',
          title: 'Regresar',
          // default: StoreSelector.defaultProps.StoreSelector?.txtBackButton
        },
      },
    },
  },
}

export default StoreSelector
