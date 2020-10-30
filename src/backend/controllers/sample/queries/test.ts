import { Test } from '../../../../_types/test'

export default (_root: undefined, args: { id: string }): Test => {
  return {
    id: args.id,
    message: `This is a test ${args.id}.`
  }
}
