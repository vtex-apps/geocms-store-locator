/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = [
  'storeListAddressList',
  'storeListAddressListFirstItem',
  'storeListAddressListItem',
  'storeListStoreLinkContainer',
  'storeListStoreLink',
  'storeListAddressContainer',
  'storeListAddress',
  'storeListLinks',
  'storeListLinkContainer',
  'storeListPhoneLink',
  'storeListDirectionsLink',
  'storeListEmptyState',
] as const

interface ListingProps {
  items: Store[]
  onChangeCenter: any
}

const Listing: StorefrontFunctionComponent<ListingProps> = ({
  items,
  onChangeCenter,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const handleChangeCenter = (item: Store, zoom: number) => {
    const { latitude, longitude } = item.location

    onChangeCenter(longitude, latitude, zoom)
  }

  return (
    <div
      style={{ minWidth: '270px' }}
      className={`${handles.storeListAddressList} vh-75-m h-100-s overflow-y-scroll-m overflow-visible-s flex flex-column-m flex-nowrap-m order-1-m order-2-s flex-row-s flex-wrap-s t-small`}
    >
      {items.length ? (
        items.map((item, i: number) => {
          return (
            <div
              key={`key_${i}`}
              className={`mb0 ph3 pv5 ${
                !i ? handles.storeListAddressListFirstItem : ''
              } ${handles.storeListAddressListItem} ${
                !i ? 'bt' : ''
              } bb bl br b--light-gray hover-bg-near-white w-100-s`}
              onClick={() => {
                handleChangeCenter(item, 12)
              }}
            >
              <div className="mr3">
                <div className={`${handles.storeListStoreLinkContainer} mb3`}>
                  <Link
                    className={`${handles.storeListStoreLink} b no-underline underline-hover`}
                    page="store.storedetail"
                    params={{
                      store_id: item.pageId,
                    }}
                  >
                    {item.name}
                  </Link>
                </div>

                <div className={`${handles.storeListAddressContainer}`}>
                  <div className={`${handles.storeListAddress}`}>
                    {item.address.street ? `${item.address.street}` : ''}
                    <br />

                    {`${item.address.city ? `${item.address.city},` : ''} ${
                      item.address.state ? `${item.address.state} ` : ''
                    } ${
                      item.address.postalCode
                        ? `${item.address.postalCode}`
                        : ''
                    }`}
                  </div>
                </div>
                <div className={`${handles.storeListLinks} flex mt3`}>
                  <div
                    className={`${handles.storeListLinkContainer} pr4 br b--gray`}
                  >
                    <a
                      className={`${handles.storeListPhoneLink} no-underline underline-hover`}
                      href={`tel:${item.contacts.mainPhone}`}
                    >
                      {item.contacts.mainPhone}
                    </a>
                  </div>
                  <div
                    className={`${handles.storeListLinkContainer} pl4 bl b--gray`}
                  >
                    <a
                      href={item.googleMapLink}
                      className={`${handles.storeListDirectionsLink} b no-underline underline-hover`}
                    >
                      <FormattedMessage id="store/geocms-store-locator.listing.directions" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className={`${handles.storeListEmptyState} pt7 tc b w-100`}>
          <FormattedMessage id="store/geocms-store-locator.listing.empty" />
        </div>
      )}
    </div>
  )
}

export default Listing
