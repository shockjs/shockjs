import pick from 'lodash/object/pick';
import QueryBuilder from '../../shared/classes/QueryBuilder';

class Base
{
  constructor(attributes)
  {
    this.attributes = attributes;
  }

  primaryKey()
  {
    return 'id';
  }

  isNewRecord()
  {
    return typeof this.attributes[this.primaryKey()] === 'undefined';
  }

  save(validate = true, attributes = false)
  {
    return new Promise((resolve, reject) => {
      if (validate) {
        this.validate()
          .then(() => {
            return this._save(attributes);
          })
          .then((json) => {
            resolve(json);
          })
          .catch((error) => {
            reject(error);
          });
      }
      else {
        return this._save(attributes);
      }
    });
  }

  _save(attributes)
  {
    const updateAttributes = attributes ? pick(this.attributes, attributes) : this.attributes;

    if (this.isNewRecord()) {
      return (new QueryBuilder(this._endpoint)
        .addParams(updateAttributes)
        .create());
    } else {
      return (new QueryBuilder(this._endpoint + this.attributes[this.primaryKey()])
        .addParams(updateAttributes)
        .update());
    }
  }
}

export default Base;