import { parseServerData } from '../utils/IsoBridge';

let defaultState = {

};

export default function(state = defaultState, action) {
  switch (action.type) {
  default:
    return parseServerData('Admin', state);
  }
}

