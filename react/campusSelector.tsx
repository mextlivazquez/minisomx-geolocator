import React, { useState, useEffect } from 'react'
import { StoreSelectorProps } from './typings/global'
import { Modal } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import './components/global.css'
import { canUseDOM } from "vtex.render-runtime"
import axios from 'axios'

const CSS_HANDLES = [
  "wraper",
  "titleModalRegions",
  "regionItem",
  "regionItems",
  "regionItemSubs",
  "backButton",
  "buttonHandle",
  "imageFranchise",
  "imageFranchiseWrapper",
  "inputCpFranchise",
  "submitFranchise",
  "franchiseContentWrapper",
  "reponseWrapper",
  "titleFranchise",
  "subTitleFranchise",
  "spanFranchise",
  "highlightSpan",
  "txtEnvio",
  "envioss",
  "envioss2",
  "express"
] as const
//asign store in localStore save the name the name of variable is cediStore
function useLocalStorage(key: string, initialValue: string) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return (
        item ? JSON.parse(item) : initialValue
      )
    } catch (error) {
      return initialValue
    }
  })
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: (arg: any) => any) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
    }
  }
  return [storedValue, setValue]
}
const StoreSelector: StorefrontFunctionComponent<StoreSelectorProps> = ({ StoreSelector }) => { 
useEffect(() => {
  async function fetchData() {
    const { data } = await axios({
      url: '/api/sessions?items=store.channel,profile.email,checkout.regionId',
      method: 'GET',
    })
    const { namespaces: { checkout} } = data
    try {
      if(cediStore && !checkout){
                let requests = []​​​​​
              requests.push(
                await axios({      
                  url: '/api/sessions',
                  method: 'POST',
                  data: {
                    public: {
                      country: {
                        value: 'MEX',
                      },
                      regionId: {
                        value: btoa(`SW#${'minisomxt0203'}`),
                      },
                    },
                  },
                })
              )
              setTimeout(()=>{return window.location.reload()},1000);
              setSelectedCampus("Cedis");
              return;
              }
      if(!checkout){
       geoCode();
        return;
      }  
    } catch (error) {
      if (!checkout){  
      } //handleOpenModal(true)
    }
  }
  fetchData()
})

  const [cediStore ,setStoreCedi] = useState(false);
  const [CP, setCP] = useState('')
  const [isModalOpen, handleOpenModal] = useState(false)
  const [txtSubmit, handleTxtSubmit] = useState("Buscar")

  const [txtEnvio, handleTxtEnvio] = useState("")
  const [txtResponse, handleTxtResponse] = useState("")
  const [txtStore/*, handleTxtStore*/] = useState(StoreSelector.txtDefautButton);
  //const [selectedCampus, setSelectedCampus] = useState("");
  const handles = useCssHandles(CSS_HANDLES) 
  const [selectedCampus, setSelectedCampus] = useLocalStorage(
    'selectedStore',
    ''
  );

  const filterDelivery = (json: any) => {
    let slaResult = json.find((sla: any) => sla.deliveryChannel === "delivery")
    if(typeof slaResult == "undefined"){
      slaResult = "t0203"
      return slaResult
    }else{
      return (slaResult.deliveryIds[0].warehouseId).toLowerCase();
    }
  }
  
  const geoCode = async () => { 
     if ("geolocation" in navigator){ 
             navigator.geolocation.getCurrentPosition(mostrarCoordenada,errores,{timeout:10000});     
             async function mostrarCoordenada (position:any){ 
             var latitude = position.coords.latitude;
             var longitude =position.coords.longitude;
              
         const responseCode = await axios({
              url:`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA0_FeNed3BFh7WWQaTSBRoP3UvzS1R_pA`,
              method: 'GET',
              headers:{
                "Content-Type": "application/json",
                "Accept": "application/json"
              }
            });
            getSimulation(responseCode.data.results[0].address_components[6].long_name);
            }

            function errores(err:any) {
              if (err.code == err.TIMEOUT) 
                  console.log("Se ha superado el tiempo de espera");
              if (err.code == err.PERMISSION_DENIED)     
                  console.log("El usuario no permitió informar su posición");
                  handleOpenModal(true);
              if (err.code == err.POSITION_UNAVAILABLE)                 
                  console.log("El dispositivo no pudo recuperar la posición actual");
              }
        }
     else{
           handleOpenModal(true);
        }
  }
  
  const uniqueSimulation = async (postalCode: string) => {
   console.log("uniqueSimulation ---step3" ,)
    const response = await axios({
      url: '/api/checkout/pub/orderforms/simulation',
      method: 'POST',
      headers:{
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      data: {
        "items":[{
          "id":"4214", //id test sku with infinite inventory
          "quantity":"1",
          "seller":"1"
        }],
        "country": "MEX",
        "postalCode":postalCode
      }
    })
    console.log(response.data.logisticsInfo[0].slas, "uniqueSimulation")
    return filterDelivery(response.data.logisticsInfo[0].slas)

  }

  const getSeller = async (sellerId:string) => {
    return axios({
      url: `/api/catalog_system/pvt/seller/${sellerId}`,
      method: 'GET',
      headers:{
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-vtex-api-appKey": "vtexappkey-minisomx-JASTFM",
        "x-vtex-api-appToken": "AOFISFLGBSZBLOYDQOMTDFRPOBEIJSTYYEXIKCKOBZPNBUKXHSNIACNUXQUQBDWIYBDGQPSOEXSEPDOTRGBQFKYWRDLUIUNYCHPARDHRAZECKIFTCAYVBFCNCGPNEYFJ"
      }
    })
  }

  const sendAll = async (sellerId:any) =>{
    var idStore = sellerId;
    let requests1 = []​​​​​
      requests1.push(
        axios({      
          url: '/api/sessions',
          method: 'POST',
          data: {
            public: {
              country: {
                value: 'MEX',
              },
              regionId: {
                value: btoa(`SW#${idStore}`),
              },
            },
          },
        })
      )
    let nameSeller = await getSeller(sellerId)
    setSelectedCampus(nameSeller.data.Name);

   // handleClick(sellerId, postalCode)
   setTimeout(()=>{return window.location.reload()},1000)
  }

  const getSimulation = async (postalCode: string) =>{
    console.log("getSimulation, step 4")
    handleTxtSubmit("Buscando...")
    if(postalCode != ""){
      const response = await axios({
        url: '/api/checkout/pub/orderforms/simulation',
        method: 'POST',
        headers:{
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        data: {
          "items":[{
            "id":"4841", //id test sku with infinite inventory
            "quantity":"1",
            "seller":"1"
          }],
          "country": "MEX",
          "postalCode":postalCode
        }
      })
  if(response.data.logisticsInfo[0].slas.length == 1){
        var bestDeliveryShipping = "minisomx"+response.data.logisticsInfo[0].slas[0].deliveryIds[0].warehouseId.toLowerCase()
      }else{
        bestDeliveryShipping = "minisomx"+filterDelivery(response.data.logisticsInfo[0].slas)        
      }
      if(bestDeliveryShipping == "minisomxt0203"){ 
        console.log("si es cedis vuelve a hacer una caomparacion con el cp");
          let intento = `minisomx${await uniqueSimulation(postalCode)}`
            if(intento != bestDeliveryShipping){
              bestDeliveryShipping = intento
            }
         }

      sendAll(bestDeliveryShipping)
      handleTxtSubmit("Encontrado!")
      handleOpenModal(false);
      handleTxtResponse("¡Te mostraremos una mejor selección de productos con base en las tiendas que tengas cerca!")

      if(response.data.logisticsInfo[0].slas.find((sla: any) => sla.name === "Express - Las entregas inician a las 11:00 am. Si realizas tu compra después de las 16:30 hrs te entregaremos al día siguiente.")){
        handleTxtEnvio("Tu código postal aplica para envío express. Concluye tu pago antes de las 3 de la tarde y espera tu pedido el día de hoy!")
      }

    }else{
      alert("¡Informe el código postal antes!")
    }
  }

  return (

    <React.Fragment>
      <div className={`${handles.wraper} ${'flex items-center'}`}>
        <button className={`vtex-button flex ${handles.buttonHandle}`} onClick={()=>{handleOpenModal(true)}}>
          {selectedCampus || txtStore}
        </button>

        {canUseDOM && <Modal
          centered
          isOpen={isModalOpen}
          onClose={(e: any) => {
            e.preventDefault()
            e.stopPropagation()
            handleOpenModal(false)
            setStoreCedi(true)
          }}
          showCloseIcon={true}
          class="miniso-modal"
          >
          <div className="vtex-modal-content flex flex-center">
            <div className={`${handles.franchiseContentWrapper} column-sm`}>
              <span className={`${handles.titleFranchise} ${handles.spanFranchise}`}> INGRESA TU CÓDIGO POSTAL </span>
              <span className={`${handles.subTitleFranchise} ${handles.spanFranchise}`}>para ofrecerte un mejor servicio <b  className={`${handles.highlightSpan}`}>económica y rápida</b> de entrega.</span>
              <input 
                onChange={event => setCP(event.target.value)} 
                className={`${handles.inputCpFranchise} inputcode`} 
                placeholder="Tu código postal a 5 dígitos" 
                type="text" 
                maxLength={5}
              />
              <button className={`${handles.submitFranchise}`} onClick={()=>{getSimulation(CP)}}>{txtSubmit}</button>
              <div className={`${handles.reponseWrapper}`}>
                {txtResponse}
              </div>
            
              <div className={`${handles.txtEnvio}`}>{txtEnvio}</div>
            </div>
          </div>
      </Modal>}
      </div>

    </React.Fragment>
  )
}

//This is the schema form that will render the editable props on SiteEditor
StoreSelector.defaultProps = {
  StoreSelector: {
    txtDefautButton: "Selecciona tu Tienda",
    txtBackButton: "Regresar"
  }
}

StoreSelector.schema = {
  title: 'editor.store-locator.title',
  deion: 'editor.store-locator.deion',
  type: 'object',
  properties: {
    StoreSelector:{
      type: "object",
      properties:{
        txtDefautButton: {
          type: "String",
          title: "Texto default",
          default: StoreSelector.defaultProps.StoreSelector?.txtDefautButton
        },
        txtBack:{
          type: "String",
          title: "Regresar",
          default: StoreSelector.defaultProps.StoreSelector?.txtBackButton
        }
      }
    }
  }
}

export default StoreSelector