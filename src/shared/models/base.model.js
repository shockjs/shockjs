import Checkit from '../utils/checkit';
import pick from 'lodash/object/pick';

class DummyBase {}

export function getBase(ExtendedModel = DummyBase) {
  class Base extends ExtendedModel
  {
    constructor(attributes, endpoint = null)
    {
      super(attributes);
      this._rules = {};
      this._endpoint = endpoint;
    }

    get rules()
    {
      return this._rules;
    }

    set rules(rules)
    {
      this._rules = rules;
    }

    validate(rules = false)
    {
      const checkIt = new Checkit(rules ? pick(this.rules, rules) : this.rules);
      return checkIt.run(this.attributes);
    }

  }
  return Base;
}
