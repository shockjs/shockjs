import { GraphQLInputObjectType, GraphQLString } from 'graphql';

export default new GraphQLInputObjectType({
  name: 'Filter',
  fields: () => ({
    name: {
      type: GraphQLString
    },
    operator: {
      type: GraphQLString
    },
    value: {
      type: GraphQLString
    }
  })
});
