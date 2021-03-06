/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = require('react');
var ReactDOM = require('react-dom');
var MetadataModal = require('../Save.jsx');
var expect = require('expect');

describe('This test for dashboard save form', () => {


    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    // test DEFAULTS
    it('creates the component with defaults, show=false', () => {
        const metadataModalItem = ReactDOM.render(<MetadataModal show={false}/>, document.getElementById("container"));
        expect(metadataModalItem).toExist();

        const metadataModalItemDom = ReactDOM.findDOMNode(metadataModalItem);
        expect(metadataModalItemDom).toNotExist();

        const getModals = function() {
            return document.getElementsByTagName("body")[0].getElementsByClassName('modal-dialog');
        };
        expect(getModals().length).toBe(0);

    });


    it('creates the component with a format error', () => {
        const metadataModalItem = ReactDOM.render(<MetadataModal show errors={["FORMAT"]} useModal id="MetadataModal"/>, document.getElementById("container"));
        expect(metadataModalItem).toExist();

        const getModals = function() {
            return document.getElementsByTagName("body")[0].getElementsByClassName('modal-dialog');
        };

        expect(getModals().length).toBe(1);

        const modalDivList = document.getElementsByClassName("modal-content");
        const closeBtnList = modalDivList.item(0).querySelectorAll('.modal-footer button');

        expect(closeBtnList.length).toBe(2);

        const errorFORMAT = modalDivList.item(0).querySelector('.errorFORMAT');
        expect(errorFORMAT).toExist();
    });

    it('creates the component with a size error', () => {
        const metadataModalItem = ReactDOM.render(<MetadataModal show errors={["SIZE"]} useModal id="MetadataModal"/>, document.getElementById("container"));
        expect(metadataModalItem).toExist();

        const getModals = function() {
            return document.getElementsByTagName("body")[0].getElementsByClassName('modal-dialog');
        };

        expect(getModals().length).toBe(1);

        const modalDivList = document.getElementsByClassName("modal-content");
        const closeBtnList = modalDivList.item(0).querySelectorAll('.modal-footer button');
        expect(closeBtnList.length).toBe(2);

        const errorSIZE = modalDivList.item(0).querySelector('.errorSIZE');
        expect(errorSIZE).toExist();
    });

    it('modal show permissions editor whe user is admin', () => {
        const user = {role: 'ADMIN'};
        const metadataModalItem = ReactDOM.render(<MetadataModal show user={user} useModal id="MetadataModal"/>, document.getElementById("container"));
        expect(metadataModalItem).toExist();

        const getModals = function() {
            return document.getElementsByTagName("body")[0].getElementsByClassName('modal-dialog');
        };

        expect(getModals().length).toBe(1);

        const permissionSection = document.querySelector(".permissions-table");
        expect(permissionSection).toExist();
    });

    it('modal show permissions editor with user is owner', () => {
        const user = {role: 'USER', name: 'geo'};
        const resource = {attributes: {owner: 'geo'}};
        const metadataModalItem = ReactDOM.render(<MetadataModal show user={user} resource={resource} useModal id="MetadataModal"/>, document.getElementById("container"));
        expect(metadataModalItem).toExist();

        const getModals = function() {
            return document.getElementsByTagName("body")[0].getElementsByClassName('modal-dialog');
        };

        expect(getModals().length).toBe(1);

        const permissionSection = document.querySelector(".permissions-table");
        expect(permissionSection).toExist();
    });

    it('modal hide permissions editor when user is neither admin nor owner', () => {
        const user = {role: 'USER', name: 'solution'};
        const resource = {attributes: {owner: 'geo'}};
        const metadataModalItem = ReactDOM.render(<MetadataModal show user={user} resource={resource} useModal id="MetadataModal"/>, document.getElementById("container"));
        expect(metadataModalItem).toExist();

        const getModals = function() {
            return document.getElementsByTagName("body")[0].getElementsByClassName('modal-dialog');
        };

        expect(getModals().length).toBe(1);

        const permissionSection = document.querySelector(".permissions-table");
        expect(permissionSection).toBeNull;
    });
    it('modal shows permissions when the map is new (no owner)', () => {
        const user = { role: 'USER', name: 'solution' };
        const resource = {  };
        const metadataModalItem = ReactDOM.render(<MetadataModal show user={user} resource={resource} useModal id="MetadataModal" />, document.getElementById("container"));
        expect(metadataModalItem).toExist();

        const getModals = () => {
            return document.getElementsByTagName("body")[0].getElementsByClassName('modal-dialog');
        };

        expect(getModals().length).toBe(1);

        const permissionSection = document.querySelector(".permissions-table");
        expect(permissionSection).toExist();
    });

});
