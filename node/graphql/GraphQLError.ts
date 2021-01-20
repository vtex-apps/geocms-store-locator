export class GraphQLError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, public errorCode: number, public details?: any) {
    super(message)
  }
}
