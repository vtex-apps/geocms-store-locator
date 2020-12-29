export class GraphQLError extends Error {
  constructor(message: string, public errorCode: number, public details?: any) {
    super(message)
  }
}
