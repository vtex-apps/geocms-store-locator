import React, { useContext } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreContext } from './contexts/StoreContext'

const CSS_HANDLES = [
  'contactsContainer',
  'contactsContact',
  'contactsLabel',
] as const

const StoreContacts: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const store = useContext(StoreContext)

  if (!store) {
    return null
  }

  return (
    <div className={`${handles.contactsContainer} ma5`}>
      <div className={`${handles.contactsContact}`}>
        {store.contacts.mainPhone}
      </div>
      <div className={`${handles.contactsLabel} b t-small`}>
        {
          <FormattedMessage id="store/geocms-store-locator.storeContacts.phoneLabel" />
        }
      </div>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeContacts.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeContacts.description',
  },
})

StoreContacts.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default StoreContacts
