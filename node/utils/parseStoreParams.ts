import slugify from 'slugify'

export const parseStoreParams = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}
