import Checkit from 'checkit';
import pick from 'lodash/object/pick';

class DummyBase {}

export function getBase(ExtendedModel = DummyBase) {
    class Base extends ExtendedModel
    {
        constructor()
        {
            super();
        }

        get rules()
        {
            return {};
        }

        get attributes()
        {
            return [];
        }

        validate(rules = false)
        {
            let checkit = new Checkit(rules ? pick(this.rules, rules) : this.rules);
            return checkit.run(this.attributes);
        }
    }
    return Base;
}