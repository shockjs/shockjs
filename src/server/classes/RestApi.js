import Boom from 'boom';
import isArray from 'lodash/lang/isArray';

/**
 * Create a group of new endpoints for a bookshelf model.
 *
 * @class
 */
class RestApi {

  /**
   * @param endPoint The endpoint.
   * @param modelName
   * @param version
     */
  constructor(endPoint, modelName, version) {

    this.modelName = modelName;
    this.endPoint = endPoint;
    this.version = version || 'v1';
    this.perPageLimit = 50;
    this.perPage = 20;

    this.findAll = {
      handler: function (request, reply) {

        var Model = request.server.plugins['hapi-shelf'].model(this.modelName);
        Model.count().then(total => {
          let page = parseInt(request.query.page) || 1;
          let limit = parseInt(request.query['per-page']) <= this.perPageLimit ? request.query['per-page'] : this.perPage;
          let fields;
          let filters;
          let sort;

          var query = Model.query();

          try {
            fields = JSON.parse(request.query['fields'] || '["*"]');
            query.select(fields);
          } catch(e) {
            console.error(e);
            reply(Boom.badRequest('Invalid json fields parsed to server: ' + request.query['fields']));
            return;
          }

          try {
            if (request.query['sort'] !== undefined) {
              sort = JSON.parse(request.query['sort']);
              if (isArray(sort)) {
                sort.forEach(function ({name, direction="ASC"}) {
                  query.orderBy(name, direction);
                });
              }
            }
          } catch(e) {
            console.error(e);
            reply(Boom.badRequest('Invalid json sort parsed to server: ' + request.query['sort']));
            return;
          }

          try {
            filters = JSON.parse(request.query['filters'] || '[]');
            if (isArray(filters)) {
              filters.forEach(function ({name, operator="=", value, clause='and', negate=false}) {
                if (name && value) {
                  switch (clause) {
                    case "and":
                      negate ? query.andWhereNot(name, operator, value) : query.andWhere(name, operator, value);
                      break;
                    case "or":
                      negate ? query.orWhereNot(name, operator, value) : query.orWhere(name, operator, value);
                      break;
                  }
                } else if (name) {
                  switch (clause) {
                    case "and":
                      query.andWhere(function () {
                        negate ? this.whereNotNull(name) : this.whereNull(name);
                      });
                      break;
                    case "or":
                      query.orWhere(function () {
                        negate ? this.whereNotNull(name) : this.whereNull(name);
                      });
                      break;
                  }
                }
              });
            }
          } catch(e) {
            console.error(e);
            reply(Boom.badRequest('Invalid json filters parsed to server: ' + request.query['filters']));
            return;
          }

          query.limit(limit).offset(limit * page - limit);

          //console.log(query.toSQL());

          reply(query)
            .header('X-Pagination-Per-Page', limit)
            .header('X-Pagination-Total-Count', total)
            .header('X-Pagination-Current-Page', page);

        });
      }.bind(this)
    };

    this.fetchCount = {
      handler: function (request, reply) {
        var Model = request.server.plugins['hapi-shelf'].model(this.modelName);
        Model.count().then(total => {
          reply(total);
        });
      }.bind(this)
    };

    this.findOne = {
      handler: function (request, reply) {
        var Model = request.server.plugins['hapi-shelf'].model(this.modelName);
        var found = Model.forge({id: request.params.id}).fetch();
        found.then(function(data) {
            reply(data ? data :  Boom.badRequest(modelName + ' #' + request.params.id + ' does not exist.'));
          }, this)
          .catch(function(err) {
            reply(Boom.badImplementation(err));
          });
      }.bind(this)
    };

    this.createOne = {
      handler: function (request, reply) {
        var Model = request.server.plugins['hapi-shelf'].model(this.modelName);
        Model.forge(request.payload)
          .save()
          .then(function(model) {
            reply(model);
          })
          .catch(function(err) {
            reply(Boom.badImplementation(err));
          });
      }.bind(this)
    };

    this.updateOne = {
      handler: function (request, reply) {
        var Model = request.server.plugins['hapi-shelf'].model(this.modelName);

        Model.forge({id: request.params.id})
          .fetch({require: true})
          .then(function (record) {
            record.save(request.payload)
              .then(function (record) {
                reply(record);
              })
              .catch(function (err) {
                reply(Boom.badRequest(err));
              });
          })
          .catch(function (err) {
            reply(Boom.badRequest(err));
          });

      }.bind(this)
    };

    this.deleteOne = {
      handler: function (request, reply) {
        var Model = request.server.plugins['hapi-shelf'].model(this.modelName);
        reply(Model.destroy(request.params.id));
      }.bind(this)
    };

  }

  /**
   * Gets all endpoints.
   *
   * @returns {*[]}
     */
  get endPoints()
  {
    var path = '/api/' + this.version + '/' + this.endPoint;
    return [
      {
        path: path,
        method: 'GET',
        config: this.findAll
      },
      {
        path: path + '/{id}',
        method: 'GET',
        config: this.findOne
      },
      {
        path: path + '/count',
        method: 'GET',
        config: this.fetchCount
      },
      {
        path: path,
        method: 'POST',
        config: this.createOne
      },
      {
        path: path + '/{id}',
        method: ['PATCH', 'PUT'],
        config: this.updateOne
      },
      {
        path: path + '/{id}',
        method: 'DELETE',
        config: this.deleteOne
      }
    ];
  }
}

module.exports = RestApi;
