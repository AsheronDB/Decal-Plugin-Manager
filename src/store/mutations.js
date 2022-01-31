import {
    MERGE_STATE
} from './mutationTypes';

import { stateMerge } from 'vue-object-merge';

export default {
    [MERGE_STATE](state, payload) {
        return stateMerge(state, payload);
    }
};
