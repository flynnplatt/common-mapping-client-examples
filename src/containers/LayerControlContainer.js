import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as layerActions from '../actions/LayerActions';
import ColorbarContainer from './ColorbarContainer';
import { Button, IconButton } from 'react-toolbox/lib/button';
import Switch from 'react-toolbox/lib/switch';
import Slider from 'rc-slider';
import MiscUtil from '../utils/MiscUtil';
import 'rc-slider/assets/index.css';

export class LayerControlContainer extends Component {
    changeOpacity(value) {
        let opacity = value / 100.00;
        this.props.actions.changeLayerOpacity(this.props.layer, opacity);
    }

    toggleChangingOpacity() {
        if(this.props.layer.get("isChangingOpacity")) {
            this.stopChangingOpacity();
        } else {
            this.startChangingOpacity();
        }
    }

    startChangingOpacity() {
        this.props.actions.startChangingLayerOpacity(this.props.layer);
    }

    stopChangingOpacity() {
        this.props.actions.stopChangingLayerOpacity(this.props.layer);
    }

    toggleChangingPosition() {
        if(this.props.layer.get("isChangingPosition")) {
            this.stopChangingPosition();
        } else {
            this.startChangingPosition();
        }
    }

    startChangingPosition() {
        this.props.actions.startChangingLayerPosition(this.props.layer);
    }

    stopChangingPosition() {
        this.props.actions.stopChangingLayerPosition(this.props.layer);
    }

    changePalette() {
        this.props.actions.changeLayerPalette(this.props.layer, {});
    }

    moveToTop() {
        this.props.actions.moveToTop(this.props.layer);
    }

    render() {
        let switchClasses = MiscUtil.generateStringFromSet({
            "layer-toggle": true,
            "active": this.props.layer.get("isActive")
        });
        let sliderContainerClasses = MiscUtil.generateStringFromSet({
            "opacity-slider-container": true,
            "active": this.props.layer.get("isChangingOpacity")
        });
        let positionContainerClasses = MiscUtil.generateStringFromSet({
            "position-controls-container text-wrap row middle-xs": true,
            "active": this.props.layer.get("isChangingPosition")
        });
        let currOpacity = Math.floor(this.props.layer.get("opacity") * 100);
        return (
            <div className="layer-control pos-rel">
                <div className="row middle-xs">
                    <div className="col-xs-2 text-left">
                        <Switch
                            className={switchClasses}
                            checked={this.props.layer.get("isActive")}
                            onChange={() => this.props.actions.toggleLayer(this.props.layer)}
                        />
                    </div>
                    <span className="col-xs layer-header text-wrap">{this.props.layer.get("title")}</span>
                </div>
                <div className="row middle-xs">
                    <div className="col-xs text-left no-padding">
                        <ColorbarContainer palette={this.props.layer.get("palette")} />
                    </div>
                    <div className="col-xs text-right">
                        <IconButton
                            flat
                            primary={!this.props.layer.get("isChangingPosition")}
                            accent={this.props.layer.get("isChangingPosition")}
                            className="no-padding mini-xs-waysmall"
                            onClick={() => this.toggleChangingPosition()}>
                            <i className="button-icon ms ms-fw ms-layers-overlay"></i>
                        </IconButton>
                        <IconButton
                            flat
                            primary={!this.props.layer.get("isChangingOpacity")}
                            accent={this.props.layer.get("isChangingOpacity")}
                            className="no-padding mini-xs-waysmall"
                            onClick={() => this.toggleChangingOpacity()}>
                            <i className="button-icon ms ms-fw ms-opacity"></i>
                        </IconButton>
                        <IconButton primary icon="info_outline" className="no-padding mini-xs-waysmall"/>
                    </div>
                </div>
                <div className="row middle-xs">
                    <div className="col-xs-12 no-padding">
                        <div className="colorbar-label-container pos-rel">
                            <span className="colorbar-label min">
                                min
                            </span>
                            <span className="colorbar-label mid">
                                mid
                            </span>
                            <span className="colorbar-label max">
                                max
                            </span>
                        </div>
                    </div>
                </div>
                <div className={sliderContainerClasses}>
                    <div className="opacity-label">
                        {currOpacity}%
                    </div>
                    <Slider
                        tipTransitionName=""
                        tipFormatter={null}
                        step={1}
                        className="opacity-slider"
                        value={currOpacity}
                        onChange={(value) => this.changeOpacity(value)}
                        // onAfterChange={() => this.stopChangingOpacity()}
                    />
                </div>
                <div className={positionContainerClasses}>
                    <div className="col-xs-6 no-padding">
                        <Button primary label="Bring to Front" className="mini-xs-waysmall small-text full-width"/>
                    </div>
                    <div className="col-xs-6 no-padding">
                        <Button primary label="Forward" className="mini-xs-waysmall small-text full-width"/>
                    </div>
                    <div className="col-xs-6 no-padding">
                        <Button primary label="Send to Back" className="mini-xs-waysmall small-text full-width"/>
                    </div>
                    <div className="col-xs-6 no-padding">
                        <Button primary label="Backward" className="mini-xs-waysmall small-text full-width"/>
                    </div>
                </div>
                <hr className="divider medium" />
            </div>
        );
    }
}

LayerControlContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(layerActions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(LayerControlContainer);
