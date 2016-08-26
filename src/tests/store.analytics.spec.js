import * as actionTypes from '../constants/actionTypes';
import * as analyticsActions from '../actions/AnalyticsActions';
import { createStore } from 'redux';
import { expect } from 'chai';
import rootReducer from '../reducers';
import { mapState, layerModel, paletteModel } from '../reducers/models/map';
import { asyncState } from '../reducers/models/async';
import { helpState } from '../reducers/models/help';
import { shareState } from '../reducers/models/share';
import { settingsState } from '../reducers/models/settings';
import { dateSliderState } from '../reducers/models/dateSlider';
import { analyticsState } from '../reducers/models/analytics';
import { viewState } from '../reducers/models/view';
import { layerInfoState } from '../reducers/models/layerInfo';
import TestUtil from './TestUtil';

const initialState = {
    map: mapState,
    view: viewState,
    asyncronous: asyncState,
    help: helpState,
    settings: settingsState,
    share: shareState,
    dateSlider: dateSliderState,
    analytics: analyticsState,
    layerInfo: layerInfoState
};

describe('Store - Analytics', function() {
    it('enables user analytics', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            analyticsActions.setAnalyticsEnabled(true)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };
        actual.analytics = actual.analytics.remove("currentBatch");

        const expected = {...initialState };
        expected.analytics = expected.analytics
            .set("isEnabled", true)
            .remove("currentBatch");

        TestUtil.compareFullStates(actual, expected, true);
    });

    it('disables user analytics', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            analyticsActions.setAnalyticsEnabled(true),
            analyticsActions.setAnalyticsEnabled(false)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };
        actual.analytics = actual.analytics.remove("currentBatch");

        const expected = {...initialState };
        expected.analytics = expected.analytics
            .set("isEnabled", false)
            .remove("currentBatch");

        TestUtil.compareFullStates(actual, expected, true);
    });
});
