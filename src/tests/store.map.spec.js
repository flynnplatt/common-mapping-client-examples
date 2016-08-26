import * as actionTypes from '../constants/actionTypes';
import * as mapStrings from '../constants/mapStrings';
import * as appStrings from '../constants/appStrings';
import * as mapConfig from '../constants/mapConfig';
import * as mapActions from '../actions/MapActions';
import * as layerActions from '../actions/LayerActions';
import * as initialIngest from './data/expectedOutputs/initialIngest';
import * as activateDeactivateLayers from './data/expectedOutputs/activateDeactivateLayers';
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
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
import moment from 'moment';

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

describe('Store - Map', function() {
    // add the html fixture from the DOM to give maps a place to render during tests
    beforeEach(function() {
        let fixture = '<div id="fixture"><div id="map2D"></div><div id="map3D"></div></div>';
        document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    // remove the html fixture from the DOM
    afterEach(function() {
        document.body.removeChild(document.getElementById('fixture'));
    });

    it('initializes 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map.remove("maps");

        expect(actualNumMaps).to.equal(1);
        expect(actualMap2D).to.not.equal(undefined);
        expect(actualMap3D).to.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('initializes 3D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map.remove("maps");

        expect(actualNumMaps).to.equal(1);
        expect(actualMap2D).to.equal(undefined);
        expect(actualMap3D).to.not.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('initializes 2D and 3D maps', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map.remove("maps");

        expect(actualNumMaps).to.equal(2);
        expect(actualMap2D).to.not.equal(undefined);
        expect(actualMap3D).to.not.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('initializes 3D and 2D maps', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map.remove("maps");

        expect(actualNumMaps).to.equal(2);
        expect(actualMap2D).to.not.equal(undefined);
        expect(actualMap3D).to.not.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable 3D terrain', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setTerrainEnabled(true)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["displaySettings", "enableTerrain"], true);

        expect(actualMap3D.map.terrainProvider._url).to.equal(mapConfig.DEFAULT_TERRAIN_ENDPOINT);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can disable 3D terrain', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setTerrainEnabled(true),
            mapActions.setTerrainEnabled(false)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["displaySettings", "enableTerrain"], false);

        expect(actualMap3D.map.terrainProvider._url).to.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 3D without 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true);

        expect(actualNumMaps).to.equal(1);
        expect(actualMap3D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 3D with 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true);

        expect(actualNumMaps).to.equal(2);
        expect(actualMap3D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 2D without 3D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_2D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false);

        expect(actualNumMaps).to.equal(1);
        expect(actualMap2D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 2D with 3D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_2D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false);

        expect(actualNumMaps).to.equal(2);
        expect(actualMap2D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can reset 3D map orientation', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D),
            mapActions.resetOrientation(0)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true);

        expect(actualNumMaps).to.equal(1);
        expect(actualMap3D.map.camera.heading).to.equal(6.283185307179586);
        expect(actualMap3D.map.camera.roll).to.equal(0);
        expect(actualMap3D.map.camera.pitch).to.equal(-1.5707963267948966);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set 2D map view info', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D),
            mapActions.setMapViewInfo({
                center: [0, 0],
                extent: [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752],
                projection: mapConfig.DEFAULT_PROJECTION,
                zoom: 8
            })
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true)
            .setIn(["view", "center"], [0, 0])
            .setIn(["view", "extent"], [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752])
            .setIn(["view", "projection"], mapConfig.DEFAULT_PROJECTION)
            .setIn(["view", "zoom"], 8);

        expect(actualNumMaps).to.equal(2);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set 3D map view info', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_2D),
            mapActions.setMapViewInfo({
                center: [0, 0],
                extent: [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752]
            })
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["view", "center"], [0, 0])
            .setIn(["view", "extent"], [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752]);

        expect(actualNumMaps).to.equal(2);
        TestUtil.compareFullStates(actual, expected);
    });

    it('sets the map date', function() {
        const store = createStore(rootReducer, initialState);

        const dateFormat = "YYYY-MM-DD";
        const newDate = moment("2003-01-01", dateFormat).toDate();

        const actions = [
            mapActions.setDate(newDate)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.map = expected.map.set("date", newDate);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can zoom out', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.zoomOut()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "zoom"], mapState.getIn(["view", "zoom"]) - 1);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can zoom in', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.zoomIn()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "zoom"], mapState.getIn(["view", "zoom"]) + 1);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can zoom in and out', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.zoomIn(),
            mapActions.zoomOut()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map.remove("maps");

        TestUtil.compareFullStates(actual, expected);
    });

    it('can set scale units with 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.setScaleUnits(mapConfig.SCALE_OPTIONS[1].value)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["displaySettings", "selectedScaleUnits"], mapConfig.SCALE_OPTIONS[1].value);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable drawing a circle on a 2D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_2D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];

        // add drawing on the map
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_CIRCLE);
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING);
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_POLYGON);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(mapStrings.GEOMETRY_CIRCLE)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], mapStrings.GEOMETRY_CIRCLE);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable drawing a line on a 2D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_2D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];

        // add drawing on the map
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_CIRCLE);
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING);
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_POLYGON);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(mapStrings.GEOMETRY_LINE_STRING)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], mapStrings.GEOMETRY_LINE_STRING);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable drawing a polygon on a 2D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_2D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];

        // add drawing on the map
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_CIRCLE);
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING);
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_POLYGON);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(mapStrings.GEOMETRY_POLYGON)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], mapStrings.GEOMETRY_POLYGON);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable drawing a circle on a 3D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap3D = initialState.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        // add drawing on the map
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_CIRCLE);
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING);
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_POLYGON);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(mapStrings.GEOMETRY_CIRCLE)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], mapStrings.GEOMETRY_CIRCLE);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable drawing a line on a 3D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap3D = initialState.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        // add drawing on the map
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_CIRCLE);
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING);
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_POLYGON);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(mapStrings.GEOMETRY_LINE_STRING)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], mapStrings.GEOMETRY_LINE_STRING);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable drawing a polygon on a 3D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap3D = initialState.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        // add drawing on the map
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_CIRCLE);
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING);
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_POLYGON);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(mapStrings.GEOMETRY_POLYGON)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], mapStrings.GEOMETRY_POLYGON);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can disable drawing on a 2D map and clear previous drawing type', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_2D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];

        // add drawing on the map
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_CIRCLE);
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING);
        actualMap2D.addDrawHandler(mapStrings.GEOMETRY_POLYGON);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(mapStrings.GEOMETRY_POLYGON),
            mapActions.disableDrawing()
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["drawing", "isDrawingEnabled"], false)
            .setIn(["drawing", "geometryType"], "");

        TestUtil.compareFullStates(actual, expected);
    });

    it('can disable drawing on a 3D map and clear previous drawing type', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap3D = initialState.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];

        // add drawing on the map
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_CIRCLE);
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_LINE_STRING);
        actualMap3D.addDrawHandler(mapStrings.GEOMETRY_POLYGON);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(mapStrings.GEOMETRY_POLYGON),
            mapActions.disableDrawing()
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true)
            .setIn(["drawing", "isDrawingEnabled"], false)
            .setIn(["drawing", "geometryType"], "");

        TestUtil.compareFullStates(actual, expected);
    });

    it('can injest wmts and json layer configurations as well as palette configurations. Big test.', function(done) {
        // adjust default timeout
        this.timeout(2000);

        // create store with async action support
        const store = createStore(rootReducer, initialState, compose(applyMiddleware(thunkMiddleware)));

        const actions = [
            layerActions.fetchInitialData()
        ];
        actions.forEach(action => store.dispatch(action));

        setTimeout(() => {
            const state = store.getState();
            const actual = {
                map: state.map.remove("maps"),
                view: state.view,
                asyncronous: state.asyncronous,
                help: state.help,
                settings: state.settings,
                share: state.share,
                dateSlider: state.dateSlider,
                analytics: state.analytics,
                layerInfo: state.layerInfo
            };

            const expected = {...initialState };
            expected.map = expected.map
                .remove("maps")
                .set("palettes", mapState.get("palettes").merge(initialIngest.PALETTES))
                .set("layers", mapState.get("layers").merge(initialIngest.LAYERS))
                .removeIn(["layers", "partial"]);
            expected.asyncronous = expected.asyncronous
                .set("loadingInitialData", false)
                .set("initialLoadingAttempted", true)
                .set("loadingLayerSources", false)
                .set("layerLoadingAttempted", true)
                .set("loadingLayerPalettes", false)
                .set("paletteLoadingAttempted", true);

            TestUtil.compareFullStates(actual, expected);
            done();
        }, 1000);
    });

    it('can activate layers', function() {
        // create modified state to account for layer ingest
        const modifiedState = {
            map: mapState
                .set("layers", mapState.get("layers").merge(initialIngest.LAYERS))
                .removeIn(["layers", "partial"]),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        const store = createStore(rootReducer, modifiedState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            layerActions.setLayerActive("facilities_kml", true),
            layerActions.setLayerActive("GHRSST_L4_G1SST_Sea_Surface_Temperature", true)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .set("layers", mapState.get("layers").merge(activateDeactivateLayers.ACTIVE_LAYERS))
            .removeIn(["layers", "partial"]);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can deactivate layers', function() {
        // create modified state to account for layer ingest
        const modifiedState = {...initialState };
        modifiedState.map = modifiedState.map
            .set("layers", mapState.get("layers").merge(initialIngest.LAYERS))
            .removeIn(["layers", "partial"]);

        const store = createStore(rootReducer, modifiedState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            layerActions.setLayerActive("facilities_kml", true),
            layerActions.setLayerActive("GHRSST_L4_G1SST_Sea_Surface_Temperature", true),
            layerActions.setLayerActive("facilities_kml", false),
            layerActions.setLayerActive("GHRSST_L4_G1SST_Sea_Surface_Temperature", false)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .set("layers", mapState.get("layers").merge(activateDeactivateLayers.DEACTIVE_LAYERS))
            .removeIn(["layers", "partial"]);

        TestUtil.compareFullStates(actual, expected);
    });
});
