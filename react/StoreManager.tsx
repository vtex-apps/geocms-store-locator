import React, { useContext } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreContext } from './contexts/StoreContext'

const CSS_HANDLES = [
  'managerContainer',
  'managerContact',
  'managerLabel',
] as const

const StoreManager: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const store = useContext(StoreContext)

  if (!store) {
    return null
  }

  return (
    <div className={`${handles.managerContainer} ma5`}>
      <div className={`${handles.managerLabel} b t-heading-6`}>
        <FormattedMessage id="store/geocms-store-locator.storeManager.label" />
      </div>
      <div className={`${handles.managerContact}`}>{store.manager}</div>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeManager.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeManager.description',
  },
})

StoreManager.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default StoreManager
