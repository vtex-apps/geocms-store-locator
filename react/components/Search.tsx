/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, Dispatch, useState } from 'react'
import { withScriptjs } from 'react-google-maps'
import StandaloneSearchBox from 'react-google-maps/lib/components/places/StandaloneSearchBox'
import { InputSearch } from 'vtex.styleguide'

interface SearchProps {
  googleMapURL: string
  loadingElement: any
  query: number[] | undefined
  setQuery: Dispatch<React.SetStateAction<number[] | undefined>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Search = ({ query, setQuery }: SearchProps) => {
  const [search, setSearch] = useState<string>('')
  const [searchBox, setSearchBox] = useState<StandaloneSearchBox | null>(null)

  return (
    <StandaloneSearchBox
      ref={(ref) => setSearchBox(ref)}
      onPlacesChanged={() => {
        const place = searchBox?.getPlaces()[0]

        setSearch(place.formatted_address)
        const lon = place.geometry.location.lng()
        const lat = place.geometry.location.lat()

        if (query && lon === query[0] && lat === query[1]) {
          return
        }

        setQuery([lon, lat])
      }}
    >
      <InputSearch
        placeholder="Enter Location or Address"
        value={search}
        size="large"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
      />
    </StandaloneSearchBox>
  )
}

// @ts-ignore
export default withScriptjs<SearchProps>(Search)
