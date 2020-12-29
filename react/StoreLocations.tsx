import React, { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import GET_STORES from './graphql/GetStores.gql'
import GOOGLE_KEYS from './graphql/GetGoogleMapsKey.gql'
import Pinpoints from './components/Pinpoints'
import Listing from './components/Listing'
import Search from './components/Search'

const CSS_HANDLES = [
  'storeLocatorBlock',
  'storeLocatorSearchContainer',
  'storeLocatorSearchInput',
  'storeLocatorSearchSpinner',
  'storeLocatorContainer',
  'storeLocatorMapContainer',
  'storeLocatorMap',
] as const

interface StoreLocationsProps {
  icon: string
  iconWidth: string
  iconHeight: string
}

const StoreLocations: StorefrontFunctionComponent<StoreLocationsProps> = ({
  icon,
  iconWidth,
  iconHeight,
}) => {
  const { data: googleMapsKeys } = useQuery(GOOGLE_KEYS, {
    ssr: false,
  })

  const [getStores, { data, loading, called }] = useLazyQuery<GetStoresResult>(
    GET_STORES
  )

  const [query, setQuery] = useState<number[] | undefined>(undefined)
  const [zoom, setZoom] = useState<number>(6)
  const [mapCoordinates, setMapCoordinates] = useState<number[] | undefined>(
    undefined
  )

  const handles = useCssHandles(CSS_HANDLES)

  const handleCenter = (lon: number, lat: number, zoomSize: number) => {
    setMapCoordinates([lon, lat])
    setZoom(zoomSize)
  }

  useEffect(() => {
    if (!query) {
      return
    }

    const [longitude, latitude] = query

    getStores({
      variables: {
        longitude,
        latitude,
      },
    })

    if (query.length) {
      handleCenter(longitude, latitude, 12)
    }
  }, [getStores, query])

  if (!loading && !called && !query) {
    if (window?.navigator?.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (position: any) => {
          const { longitude: lon, latitude: lat } = position.coords

          setQuery([lon, lat])
        },
        () => {
          setQuery([])
        }
      )
    } else {
      setQuery([])
    }
  }

  if (!called || !googleMapsKeys?.logistics?.googleMapsKey) {
    return null
  }

  if (!mapCoordinates && data?.stores?.results) {
    if (data.stores.results[0]) {
      const { longitude: lon, latitude: lat } = data.stores.results[0].location

      handleCenter(lon, lat, 6)
    }
  }

  const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKeys.logistics.googleMapsKey}&v=3.exp&libraries=geometry,drawing,places`
  const stores = data?.stores?.results ?? []

  return (
    <div className={`${handles.storeLocatorBlock} mv5`}>
      <div
        className={`${handles.storeLocatorSearchContainer} flex items-center mb5`}
      >
        <div
          className={`${handles.storeLocatorSearchInput}`}
          style={{ width: '400px' }}
        >
          <Search
            googleMapURL={googleMapURL}
            loadingElement={<div style={{ height: `100%` }} />}
            query={query}
            setQuery={setQuery}
          />
        </div>
        <div className={`${handles.storeLocatorSearchSpinner} ml6`}>
          {loading && <Spinner size={20} />}
        </div>
      </div>

      <div
        className={`${handles.storeLocatorContainer} flex flex-row-m flex-nowrap-m flex-column-s flex-wrap-s`}
      >
        <Listing items={stores} onChangeCenter={handleCenter} />
        <div
          className={`${handles.storeLocatorMapContainer} flex-grow-1 order-2-m order-1-s`}
        >
          {mapCoordinates && (
            <Pinpoints
              googleMapURL={googleMapURL}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={
                <div
                  className={handles.storeLocatorMap}
                  style={{ height: `100%` }}
                />
              }
              mapElement={
                <div className="h-100" style={{ minHeight: '400px' }} />
              }
              items={stores}
              onChangeCenter={handleCenter}
              zoom={zoom}
              center={mapCoordinates}
              icon={icon}
              iconWidth={iconWidth}
              iconHeight={iconHeight}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default StoreLocations
