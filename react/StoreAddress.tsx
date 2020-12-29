import React, { useContext } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreContext } from './contexts/StoreContext'

const CSS_HANDLES = [
  'addressContainer',
  'addressBlock',
  'addressDirectionsContainer',
  'addressDirectionsLink',
] as const

const StoreAddress: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const store = useContext(StoreContext)

  if (!store) {
    return null
  }

  const { street, city, state, postalCode } = store.address

  return (
    <div className={`${handles.addressContainer} ma5 flex items-center`}>
      <div className={`${handles.addressBlock} t-body`}>
        {street ? `${street} ` : ''}
        <br />
        {city ? `${city}` : ''}
        {state ? `, ${state}` : ''}
        {postalCode ? `, ${postalCode}` : ''}
      </div>
      <div
        className={`${handles.addressDirectionsContainer} mh7 flex items-center justify-center`}
      >
        <a
          className={`${handles.addressDirectionsLink}`}
          href={store.googleMapLink}
        >
          <FormattedMessage id="store/geocms-store-locator.storeAddress.linkText" />
        </a>
      </div>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeAddress.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeAddress.description',
  },
})

StoreAddress.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default StoreAddress
