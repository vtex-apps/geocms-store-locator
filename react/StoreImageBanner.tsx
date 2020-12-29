import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Slider } from 'vtex.store-components'

import { StoreContext } from './contexts/StoreContext'

const CSS_HANDLES = [
  'customDataTextContainer',
  'customDataTextListContainer',
  'customDataTextListLabel',
  'customDataTextList',
  'customDataTextListItem',
  'customDataImageContainer',
  'customDataImageListContainer',
  'customDataImageListItem',
] as const

const StoreImageBanner: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const store = useContext(StoreContext)

  if (!store) {
    return null
  }

  const sliderSettings = {
    className: 'ph8 mw8 mv8',
    dots: true,
    infinite: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    autoplay: true,
    speed: 500,
  }

  return (
    <div className={`${handles.customDataImageListContainer}`}>
      <Slider sliderSettings={sliderSettings}>
        {store.images.map((image, i) => (
          <div className={`${handles.customDataImageListItem}`} key={i}>
            <img src={image.url} alt="Store" />
          </div>
        ))}
      </Slider>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeImageBanner.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeImageBanner.description',
  },
})

StoreImageBanner.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default StoreImageBanner
