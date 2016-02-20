import { getKnex } from '../config/config';

export default function(BookshelfModel) {
  class Base extends BookshelfModel
  {
    constructor(attributes)
    {
      super(attributes);
      this.prefix = 'tbl_';
    }

    get tableName()
    {
      return this.prefix + this.constructor.name.toLowerCase();
    }

    static knex()
    {
      return getKnex();
    }
  }
  return Base;
}
