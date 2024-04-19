// store/index.js
import { createStore } from 'vuex';

export default createStore({
    state: {
        poiId: null,
        poiId_1_2: null,
        shop_name: null
    },
    mutations: {
        setPoiId(state, newPoiId) {
            state.poiId = newPoiId;
        },
        setPoiId_1_2(state, poiId_1_2) {
            state.poiId_1_2 = poiId_1_2;
        },
        setshop_name(state, shop_name) {
            state.shop_name = shop_name;
        },
    },
});
