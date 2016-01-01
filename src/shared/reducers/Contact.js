import { parseServerData } from '../utils/isomorphic';

let defaultState = {

};

export default function(state = defaultState, action) {
  switch (action.type) {
  default:
    return parseServerData('Contact', state);
  }
}
