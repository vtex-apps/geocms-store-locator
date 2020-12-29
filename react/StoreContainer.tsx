import React, { ReactNode } from 'react'
import { useLazyQuery } from 'react-apollo'
import { Helmet } from 'react-helmet'
import { useRuntime } from 'vtex.render-runtime'

import { StoreContext } from './contexts/StoreContext'
import GET_STORE from './graphql/GetStore.gql'

interface StoreContainerProps {
  amenities: string[]
  children: ReactNode
}

const StoreContainer: StorefrontFunctionComponent<StoreContainerProps> = ({
  amenities,
  children,
}) => {
  const { history } = useRuntime()
  const [getStore, { data, called }] = useLazyQuery<GetStoreResult>(GET_STORE)

  if (history && !called) {
    const storeId = history.location.state.navigationRoute.params.store_id

    getStore({
      variables: {
        id: storeId,
        amenities,
      },
    })
  }

  if (!data) {
    return null
  }

  return (
    <>
      <Helmet>
        <title>{data.store.results.name}</title>
        <script type="application/ld+json">{data.store.structuredData}</script>
      </Helmet>
      <StoreContext.Provider value={data.store.results}>
        {children}
      </StoreContext.Provider>
    </>
  )
}

export default StoreContainer
