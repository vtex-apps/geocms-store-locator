/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreContext } from './contexts/StoreContext'

const CSS_HANDLES = ['logoContainer'] as const

interface StoreLogoProps {
  width: string
  height: string
}

const StoreLogo: StorefrontFunctionComponent<StoreLogoProps> = ({
  width,
  height,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const store = useContext(StoreContext)

  if (!store) {
    return null
  }

  return (
    <div style={{ height, width }} className={handles.logoContainer}>
      <img src={store.logo.url} alt="Store Logo" />
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeLogo.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeLogo.description',
  },
  widthTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeLogoWidth.title',
  },
  widthDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeLogoWidth.description',
  },
  heightTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeLogoHeight.title',
  },
  heightDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeLogoHeight.description',
  },
})

StoreLogo.defaultProps = {
  width: '300px',
  height: '300px',
}

StoreLogo.schema = {
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
      default: '',
    },
  },
}

export default StoreLogo
