import { CLEAR_SERVER_DATA } from '../constants/ActionTypes';

class Action
{
  cleanupServer()
  {
    return {
      type: CLEAR_SERVER_DATA
    };
  }
}

export default Action;