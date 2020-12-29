import React, { useContext } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreContext } from './contexts/StoreContext'

const CSS_HANDLES = [
  'amenitiesContainer',
  'amenitiesLabel',
  'amenitiesList',
  'amenitiesItem',
] as const

const StoreAmenities: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const store = useContext(StoreContext)

  if (!store) {
    return null
  }

  return (
    <div className={`${handles.amenitiesContainer} ma5`}>
      <div className={`${handles.amenitiesLabel} b t-heading-6`}>
        <FormattedMessage id="store/geocms-store-locator.storeAmenities.label" />
      </div>
      <div>
        <ul className={`${handles.amenitiesList}`}>
          {store.amenities.map(
            (amenity, i) =>
              amenity.value && (
                <li key={i} className={handles.amenitiesItem}>
                  {amenity.label}
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeAmenities.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeAmenities.description',
  },
})

StoreAmenities.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default StoreAmenities
