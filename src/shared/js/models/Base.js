import Checkit from 'checkit';
import pick from 'lodash/object/pick';

class DummyBase {}

export function getBase(ExtendedModel = DummyBase) {
    class Base extends ExtendedModel
    {
        constructor()
        {
            super();
            this._attributes = {};
            this._rules = {};
        }

        get rules()
        {
            return this._rules;
        }

        set rules(rules)
        {
            this._rules = rules;
        }

        get attributes()
        {
            return this._attributes;
        }

        set attributes(attributes)
        {
            this._attributes = attributes;
        }

        validate(rules = false)
        {
            let checkit = new Checkit(rules ? pick(this.rules, rules) : this.rules);
            return checkit.run(this.attributes);
        }
    }
    return Base;
}