import { parseServerData } from '../../utils/IsoBridge';

let defaultState = {
  renderedServer: false
};

export default function(state = defaultState, action) {
  switch (action.type) {
  default:
    return parseServerData('Dashboard', state);
  }
}