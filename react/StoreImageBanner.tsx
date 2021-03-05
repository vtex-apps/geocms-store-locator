import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles, useCustomClasses } from 'vtex.css-handles'
import { SliderLayout } from 'vtex.slider-layout'

import { StoreContext } from './contexts/StoreContext'

const CSS_HANDLES = ['imageBannerContainer', 'imageBannerListItem'] as const
const sliderClasses = {
  slideChildrenContainer: 'ph8 mv8',
}

const StoreImageBanner: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const store = useContext(StoreContext)
  const classes = useCustomClasses(() => sliderClasses)

  if (!store) {
    return null
  }

  const sliderSettings = {
    showNavigationArrows: 'desktopOnly',
    showPaginationDots: 'desktopOnly',
    infinite: true,
    itemsPerPage: { desktop: 1, tablet: 1, phone: 1 },
    autoplay: { timeout: 4000, stopOnHover: false },
    classes,
  }

  return (
    <div className={`${handles.imageBannerContainer} mw8`}>
      <SliderLayout {...sliderSettings}>
        {store.images.map((image, i) => (
          <div className={`${handles.imageBannerListItem} `} key={i}>
            <img src={image.url} alt="Store" />
          </div>
        ))}
      </SliderLayout>
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
