import {fetch} from './../../../shared/js/utils/isomorphic';
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import queryString from 'querystring';
import map from 'lodash/collection/map';

import Filter from './Filter';
import Sort from './Sort';
import User from './User';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      users: {
        args: {
          filters: {
            type: new GraphQLList(Filter),
            description: 'A json string of filters.'
          },
          sort: {
            type: new GraphQLList(Sort),
            description: 'A json string of sorts.'
          },
          page: {
            type: GraphQLInt,
            description: 'The current page of results to show.'
          },
          perPage: {
            type: GraphQLInt,
            description: 'The amount of results to show per page.'
          }
        },
        type: new GraphQLList(User),
        resolve(source, { filters=[], sort=[], perPage=20, page=1 }, root, ast) {

          // This path is subject to change...
          let fields = map(root.fieldASTs[0].selectionSet.selections,({name}) => { return name.value });

          var params = {
            "page": page,
            "per-page": perPage,
            "fields": JSON.stringify(fields),
            "filters": JSON.stringify(filters),
            "sort": JSON.stringify(sort)
          };

          let url = '/api/v1/users?' + queryString.stringify(params);

          return fetch(url).then(req => req.json());

        }
      }
    }
  })
});
