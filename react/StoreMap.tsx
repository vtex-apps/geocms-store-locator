/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useQuery } from 'react-apollo'

import { StoreContext } from './contexts/StoreContext'
import Map from './components/Map'
import GOOGLE_KEYS from './graphql/GetGoogleMapsKey.gql'

const CSS_HANDLES = ['mapContainer'] as const

interface StoreMapProps {
  width: string
  height: string
  icon?: string
  iconWidth?: number
  iconHeight?: number
}

const StoreMap: StorefrontFunctionComponent<StoreMapProps> = ({
  width,
  height,
  icon,
  iconWidth,
  iconHeight,
}) => {
  const { data: googleMapsKeys } = useQuery(GOOGLE_KEYS, {
    ssr: false,
  })

  const { handles } = useCssHandles(CSS_HANDLES)
  const store = useContext(StoreContext)

  if (!store || !googleMapsKeys?.logistics?.googleMapsKey) {
    return null
  }

  return (
    <Map
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKeys.logistics.googleMapsKey}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={
        <div
          className={`${handles.mapContainer} ma5`}
          style={{ height, width }}
        />
      }
      mapElement={<div style={{ height: `100%` }} />}
      icon={icon}
      iconWidth={iconWidth}
      iconHeight={iconHeight}
      center={store.location}
    />
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeMap.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeMap.description',
  },
  widthTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeMapWidth.title',
  },
  widthDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeMapWidth.description',
  },
  heightTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeMapHeight.title',
  },
  heightDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeMapHeight.description',
  },
  iconTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeMapIcon.title',
  },
  iconDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeMapIcon.description',
  },
  iconWidthTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeMapIconWidth.title',
  },
  iconWidthDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeMapIconWidth.description',
  },
  iconHeightTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeMapIconHeight.title',
  },
  iconHeightDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeMapIconHeight.description',
  },
})

StoreMap.defaultProps = {
  height: '150px',
}

StoreMap.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    width: {
      title: messages.widthTitle.id,
      description: messages.widthDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    height: {
      title: messages.heightTitle.id,
      description: messages.heightDescription.id,
      type: 'string',
      isLayout: false,
      default: '150px',
    },
    icon: {
      title: messages.iconTitle.id,
      description: messages.iconDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    iconWidth: {
      title: messages.iconWidthTitle.id,
      description: messages.iconWidthDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    iconHeight: {
      title: messages.iconHeightTitle.id,
      description: messages.iconHeightDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
  },
}

export default StoreMap
