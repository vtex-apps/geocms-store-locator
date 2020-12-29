interface GetStoresResult {
  stores: {
    results: Store[]
  }
  //   getStoreSchema: {
  //     response: string
  //   }
}

interface GetStoreResult {
  store: {
    results: StoreDetail
    structuredData: string
  }
}

interface Store {
  id: string
  name: string
  description: string
  address: Address
  googleMapLink: string
  businessHours: [BusinessHour]
  contacts: Contacts
  location: StoreLocation
}

interface StoreDetail extends Store {
  amenities: Amenity[]
  holidayHours: [HolidayHour]
  manager: string
  logo: Image
  images: Image[]
}

interface Address {
  street: string
  city: string
  region: string
  state: string
  country: string
  postalCode: string
}

interface BusinessHour {
  day: number
  openIntervals: OpenIntervals[]
  isClosed: boolean
}

interface HolidayHour {
  date: string
  openIntervals: OpenIntervals[]
  isClosed: boolean
}

interface OpenIntervals {
  open: string
  close: string
}

interface Contacts {
  mainPhone: string
}

interface Social {
  facebook: string
  twitter: string
  instagram: string
  youtube: string
}

interface Amenity {
  label: string
  value: string
}

interface StoreLocation {
  latitude: number
  longitude: number
}

interface Image {
  url: string
}
