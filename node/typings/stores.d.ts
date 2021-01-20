interface GeoCMSResponse {
  total: number
  status: Status
  layers: Layers[]
}

interface Status {
  code: number
  message: string
}

interface Layers {
  objects: [
    {
      data: StoreData
      geom: Geo
    }
  ]
}

interface Geo {
  lng: number
  lat: number
}

interface StoreData {
  SPECIAL_HOURS: SpecialHours[]
  IMG?: Img[]
  MKTG?: Mktg[]
  social: GeoCMSSocial[]
  facebook: Facebook[]
  main: Main
  SEO: Seo[]
  gmb: Gmb[]
}

interface Img {
  Image: string
}

interface SpecialHours {
  Date: string
  open_morning?: string
  close_morning?: string
  open_afternoon?: string
  close_afternoon?: string
}

interface Mktg {
  country: string
  city: string
  Parafarmacia: string
  description: string
  note_insegna: string
  sunday_close: string
  'Agility Park': string
  Store_name: string
  'Pet Wash': string
  thursday_open: string
  'Avancassa (si/no)': string
  Lavanderia: string
  saturday_close: string
  wednesday_close: string
  wednesday_open: string
  sunday_open: string
  Store_code?: string
  state: string
  Store_phone: string
  sunday_morning_close: string
  saturday_open: string
  monday_open: string
  store_latitude: string
  address: string
  'Format (mondi, strisce gialle e nere, pareti nere, animali, gallery)': string
  Parking: string
  Area_manager: string
  friday_open: string
  tuesday_open: string
  tuesday_close: string
  zipcode: string
  thursday_close: string
  sunday_afternoon_open: string
  monday_close: string
  Farmacista: string
  store_longitude: string
  friday_close: string
  suburb: string
  'Tipo mobile cassa (metallo o legno) e numero': string
  'Vetrine espositive': string
  Toelettatura: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface GeoCMSSocial {
  gmb_id: string
}

interface Facebook {
  main_page: string
  facebook_id: string
}

interface Main {
  Phone_Internal: string
  Address_Internal: string
  Name_Internal: string
  Regional: string
  City: string
  EMail: string
  cod_mag: string
  State: string
  Cedi: string
  Region: string
  AreaManager: string
  PostCode: string
  opening_date: string
}

interface Seo {
  page_id: string
}

interface Gmb {
  gmb_location: string
  gmb_name: string
}

export interface StoresGraphQL {
  results: Store[]
}

export interface StoreGraphQL {
  results: StoreDetail | null
  structuredData: string
}

interface Store {
  id: string
  name: string
  description: string
  address: Address
  googleMapLink: string
  businessHours: BusinessHours[]
  contacts: Contact
  location: Location
}

interface StoreDetail extends Store {
  amenities: Amenities[]
  holidayHours: HolidayHours[]
  manager: string
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

interface BusinessHours {
  day: number
  openIntervals: OpenInterval[]
  isClosed: boolean
}

interface HolidayHours {
  date: string
  openIntervals: OpenInterval[]
  isClosed: boolean
}

interface OpenInterval {
  open: string
  close: string
}

interface Contacts {
  mainPhone: string
}

interface Amenities {
  label: string
  value: boolean
}

interface Location {
  latitude: number
  longitude: number
}

interface Image {
  url: string
}

interface SiteMapStoreData {
  id: string
  url: string
}
