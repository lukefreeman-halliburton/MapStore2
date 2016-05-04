/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Alert, Accordion, Panel, Glyphicon} = require('react-bootstrap');
const ReactSwipe = require('react-swipe');

var MapInfoUtils = require('../../utils/MapInfoUtils');
var FeatureInfoUtils = require('../../utils/FeatureInfoUtils');

const I18N = require('../../components/I18N/I18N');

const GetFeatureInfoViewer = React.createClass({
    propTypes: {
        infoFormat: React.PropTypes.oneOf(
            MapInfoUtils.getAvailableInfoFormatValues()
        ),
        responses: React.PropTypes.array,
        missingRequests: React.PropTypes.number,
        display: React.PropTypes.string,
        getValidator: React.PropTypes.func,
        viewers: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            display: "accordion",
            responses: [],
            missingRequests: 0,
            getValidator: MapInfoUtils.getValidator,
            viewers: {
                [FeatureInfoUtils.INFO_FORMATS.JSON]: require('../../components/data/identify/viewers/JSONViewer'),
                [FeatureInfoUtils.INFO_FORMATS.HTML]: require('../../components/data/identify/viewers/HTMLViewer'),
                [FeatureInfoUtils.INFO_FORMATS.TEXT]: require('../../components/data/identify/viewers/TextViewer')
            }
        };
    },
    shouldComponentUpdate(nextProps) {
        return nextProps.responses !== this.props.responses || nextProps.missingRequests !== this.props.missingRequests;
    },
    /**
     * render empty layers or not valid responses section.
     */
    renderEmptyLayers(validator) {
        const notEmptyResponses = validator.getValidResponses(this.props.responses).length;
        const filteredResponses = validator.getNoValidResponses(this.props.responses);
        if (this.props.missingRequests === 0 && notEmptyResponses === 0) {
            return null;
        }
        if (filteredResponses.length !== 0) {
            const titles = filteredResponses.map((res) => {
                const {layerMetadata} = res;
                return layerMetadata.title;
            });
            return (
                <Alert bsStyle={"info"}>
                    <I18N.Message msgId={"noInfoForLayers"} />
                    <b>{titles.join(', ')}</b>
                </Alert>
            );
        }
        return null;
    },
    /**
     * Render a single layer feature info
     */
    renderInfoPage(response) {
        const Viewer = this.props.viewers[this.props.infoFormat];
        if (Viewer) {
            return <Viewer display={this.props.display} response={response} />;
        }
        return null;
    },
    /**
     * Some info about the event
     */
    renderAdditionalInfo() {
        const validator = this.props.getValidator(this.props.infoFormat);
        if (validator) {
            this.renderEmptyLayers(validator);
        }
    },
    renderLeftButton() {
        return <a style={{"float": "left"}} onClick={() => {this.refs.container.swipe.prev(); }}><Glyphicon glyph="chevron-left" /></a>;
    },
    renderRightButton() {
        return <a style={{"float": "right"}} onClick={() => {this.refs.container.swipe.next(); }}><Glyphicon glyph="chevron-right" /></a>;
    },
    renderPageHeader(res, layerMetadata) {
        return (<span>{this.props.display === "accordion" ? "" : this.renderLeftButton()} <span>{layerMetadata.title}</span> {this.props.display === "accordion" ? "" : this.renderRightButton()}</span>);
    },
    /**
     * render all the feature info pages
     */
    renderPages(responses) {
        if (this.props.missingRequests === 0 && responses.length === 0) {
            return (
                <Alert bsStyle={"danger"}>
                    <h4><I18N.HTML msgId={"noFeatureInfo"}/></h4>
                </Alert>
            );
        }
        return responses.map((res, i) => {
            const {response, layerMetadata} = res;
            var pageHeader = this.renderPageHeader(res, layerMetadata, i);
            return (
                <Panel
                    eventKey={i}
                    key={i}
                    collapsible={this.props.display === "accordion"}
                    header={pageHeader}
                    style={this.props.display === "accordion" ?
                        {maxHeight: "500px", overflow: "auto"} : {maxHeight: "500px", overflow: "auto"}}>
                    {this.renderInfoPage(response)}
                </Panel>
            );
        });
    },
    render() {
        const Container = this.props.display === "accordion" ? Accordion : ReactSwipe;
        const validator = this.props.getValidator(this.props.infoFormat);
        const validResponses = validator.getValidResponses(this.props.responses);
        return (<div>
                <Container ref="container" defaultActiveKey={0} key={"swiper-" + this.props.responses.length + "-" + this.props.missingRequests} shouldUpdate={(nextProps, props) => {return nextProps !== props; }}>
                    {this.renderPages(validResponses)}
                </Container>
                {this.renderAdditionalInfo()}
            </div>
        );
    }
});

module.exports = GetFeatureInfoViewer;
