import {
    MERGE_STATE
} from './mutationTypes';

export default {
    mergeState({ commit }, payload) {
        console.log(payload);
        console.log('Merging state...')
        commit(MERGE_STATE, payload);
    }
}
