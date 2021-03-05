import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreContext } from './contexts/StoreContext'

const CSS_HANDLES = ['titleText'] as const

const StoreTitle: StorefrontFunctionComponent = () => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const store = useContext(StoreContext)

  if (!store) {
    return null
  }

  return (
    <div className={`${handles.titleText} t-heading-3 ma5`}>{store.name}</div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeTitle.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeTitle.description',
  },
})

StoreTitle.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default StoreTitle
