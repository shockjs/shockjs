import { GraphQLInputObjectType, GraphQLString } from 'graphql';

export default new GraphQLInputObjectType({
  name: 'Sort',
  fields: () => ({
    name: {
      type: GraphQLString
    },
    direction: {
      type: GraphQLString
    }
  })
});
