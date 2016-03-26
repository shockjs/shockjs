import { parseServerData } from '../../utils/iso.bridge';

let defaultState = {

};

export default function(state = defaultState, action) {
  switch (action.type) {
    default:
      return parseServerData('Admin', state);
  }
}

