import Boom from 'boom';
import isArray from 'lodash/lang/isArray';
import pluck from 'lodash/collection/pluck';
import pick from 'lodash/object/pick';
import transform from 'lodash/object/transform';
import ary from 'lodash/function/ary';
import extend from 'lodash/object/extend';

/**
 * Create a group of new endpoints for a bookshelf model.
 *
 * @class
 */
class RestApiClass
{

  /**
   * @param endPoint The endpoint.
   * @param model
   * @param version
   * @param perPageLimit
   * @param perPage
   */
  constructor(endPoint, model, version='v1', perPageLimit=50, perPage=20)
  {

    this.model = model;
    this.endPoint = endPoint;
    this.version = version;
    this.perPageLimit = perPageLimit;
    this.perPage = perPage;

    /**
     * Finds all instances.
     */
    this.findAll = {
      handler: (request, reply) => {
        this.model.count().then(total => {

          // Initialize our mutators.
          let page = parseInt(request.query.page) || 1;
          let limit = parseInt(request.query['per-page']) <= this.perPageLimit ? request.query['per-page'] : this.perPage;
          let fields;
          let sort;
          let relations = [];

          this.model.query((query) => {

            // Attempt to get fields selected by client.
            try {
              fields = JSON.parse(request.query['fields'] || '["*"]');
              query.select(fields);
            } catch (e) {
              console.error(e);
              reply(Boom.badRequest('Invalid json fields parsed to server: ' + request.query['fields']));
              return;
            }

            // Attempt to get sorts selected by client.
            try {
              if (request.query['sort'] !== undefined) {
                sort = JSON.parse(request.query['sort']);
                if (isArray(sort)) {
                  sort.forEach(function ({name, direction="ASC"}) {
                    query.orderBy(name, direction);
                  });
                }
              }
            } catch (e) {
              console.error(e);
              reply(Boom.badRequest('Invalid json sort parsed to server: ' + request.query['sort']));
              return;
            }

            // Attempt to get filters selected by client.
            try {
              query = this.extractFilters(request, query);
            } catch (e) {
              console.error(e);
              reply(Boom.badRequest(e));
              return;
            }

            try {
              relations = this.extractRelations(request);
            } catch (e) {
              console.error(e);
              reply(Boom.badRequest(e));
              return;
            }

            // Add pagination
            query.limit(limit).offset(limit * page - limit);

          })
          .fetchAll(
            {
              withRelated: relations
            }
          )
          .then((data) => {
            // Removes any sensitive data as specified in the model.
            if (this.model.filterAttribute !== undefined) {
              data = data.toJSON().map((row) => {
                return pick(row, Object.keys(row).filter(this.model.filterAttribute));
              });
            }

            reply(data)
              .header('X-Pagination-Per-Page', limit)
              .header('X-Pagination-Total-Count', total)
              .header('X-Pagination-Current-Page', page);
          });
        });
      }
    };

    /**
     * Gets the current row count for the models table.
     */
    this.fetchCount = {
      handler: (request, reply) => {
        this.model
          .query((qb) => {
            this.extractFilters(request, qb)
          })
          .count().then(total => {
          reply(total);
        });
      }
    };

    /**
     * Fetches column names for the table. (mysql only currently)
     */
    this.fetchColumns = {
      handler: function (request, reply) {
        let model = new this.model();
        let tableName = model.tableName;
        if (this.model.knex !== undefined) {
          this.model.knex().raw(`SHOW COLUMNS FROM ${tableName}`)
            .then(total => {
              reply(pluck(total[0], 'Field'));
            });
        } else {
          reply(Boom.notImplemented("This method is unavailable for this model."));
        }

      }.bind(this)
    };

    /**
     * Fetches column names for the table. (mysql only current)
     */
    this.fetchDefaults = {
      handler: function (request, reply) {
        let model = new this.model();
        let tableName = model.tableName;
        if (this.model.knex !== undefined) {
          this.model.knex().raw(`SHOW COLUMNS FROM ${tableName}`)
            .then(total => {
              reply(transform(
                total[0].map((row) => {
                  let data = {};
                  data[row['Field']] = row['Default'];
                  return data;
                }
              ), ary(extend, 2), {}
              ));
            });
        } else {
          reply(Boom.notImplemented("This method is unavailable for this model."));
        }

      }.bind(this)
    };

    /**
     * finds a single instance of the model.
     */
    this.findOne = {
      handler: (request, reply) => {
        var model = this.model.forge({});
        model.query({where: { id: request.params.id }})
          .fetch()
          .then((modelInstance) => {
            let filterAttribute = this.model.filterAttribute ? this.model.filterAttribute : () => { return true; };
            if (modelInstance) {
              reply(pick(modelInstance.attributes, Object.keys(modelInstance.attributes).filter(filterAttribute)));
            } else {
              reply(Boom.badRequest(model.constructor.name + ' #' + request.params.id + ' does not exist.'));
            }
          })
          .catch((err) => {
            reply(Boom.badImplementation(err));
          });
      }
    };

    /**
     * creates a single instance of the model.
     */
    this.createOne = {
      handler: (request, reply) => {
        let payload = request.payload;
        try {
          payload = JSON.parse(payload);
        } catch(e) {
          //Do nothing as request may not be json.
        }
        let model = new this.model(payload);
        model
          .save(null, { method: 'insert' })
          .then((model) => {
            reply(model);
          })
          .catch((err) => {
            reply(Boom.badImplementation(err));
          });
      }
    };

    /**
     * updates a single instance of the model.
     */
    this.updateOne = {
      handler: (request, reply) => {
        let payload = request.payload;

        try {
          payload = JSON.parse(payload) || payload;
        } catch(e) {
          // Do nothing...
        }

        this.model.forge({id: request.params.id})
          .fetch({require: true})
          .then((record) => {
            record.save(payload)
              .then((record) => {
                reply(record);
              })
              .catch((err) => {
                reply(Boom.badRequest(err));
              });
          })
          .catch((err) => {
            reply(Boom.badRequest(err));
          });

      }
    };

    /**
     * deletes a single instance of the model.
     */
    this.deleteOne = {
      handler: (request, reply) => {
        const Model = new this.model();
        const variables = {};
        variables[Model.idAttribute] = request.params.id;
        reply(this.model.forge(variables).destroy());
      }
    };

  }

  extractFilters(request, query)
  {
    var filters = [];
    try {
      filters = JSON.parse(request.query['filters'] || '[]');
      if (isArray(filters)) {
        filters.forEach(({name, operator="=", value, clause='and', negate=false}) => {
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
      throw new Error('Invalid json filters parsed to server: ' + request.query['filters']);
    }
    return query;
  }

  extractRelations(request)
  {
    let relations = [];
    let allowedRelations = [];
    try {
      relations = JSON.parse(request.query['relations'] || '[]');
    } catch(e) {
      console.error(e);
      throw new Error('Invalid json relations parsed to server: ' + request.query['relations']);
    }
    if (isArray(relations)) {
      relations.forEach(({ name }) => {
        if (this.model.allowedRelations &&
          this.model.allowedRelations() &&
          this.model.allowedRelations().indexOf(name) !== -1) {
          allowedRelations.push(name);
        }
      });
    }
    return allowedRelations;
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
        path: path + '/columns',
        method: 'GET',
        config: this.fetchColumns
      },
      {
        path: path + '/defaults',
        method: 'GET',
        config: this.fetchDefaults
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

export default RestApiClass;
