'use strict';

const { GUI } = require('./../js/gui');
const TABS = window.TABS || (window.TABS = {});

TABS.io_monitor = {};

function loadSubtab(tabName, htmlFile, jsFile, cssFile, containerId, callback) {
    if ($(containerId).data('loaded')) {
        $(containerId).show();
        if (callback) callback();
        return;
    }
    $(containerId).empty();

    if (cssFile && !$('link[data-subtab-css="' + cssFile + '"]').length) {
        $('<link>')
            .appendTo('head')
            .attr({
                type: 'text/css',
                rel: 'stylesheet',
                href: cssFile,
                'data-subtab-css': cssFile
            });
    }

    $(containerId).load(htmlFile, function() {
        $.getScript(jsFile, function() {
            if (window.TABS && window.TABS[tabName] && typeof window.TABS[tabName].initialize === 'function') {
                window.TABS[tabName].initialize(callback || function(){});
            }
            $(containerId).data('loaded', true);
        });
    });
}

let currentSubtab = null;

function showSubtab(subtab) {

    if (currentSubtab && window.TABS[currentSubtab] && typeof window.TABS[currentSubtab].cleanup === 'function') {
        window.TABS[currentSubtab].cleanup();
    }
    $('.tab-io-monitor .subtab-content').hide();
    $('#subtab-' + subtab).show();
    if (subtab === 'receiver') {
        loadSubtab(
            'receiver',
            'tabs/receiver.html',
            'tabs/receiver.js',
            'src/css/tabs/receiver.css',
            '#subtab-receiver'
        );
    } else if (subtab === 'sensors') {
        loadSubtab(
            'sensors',
            'tabs/sensors.html',
            'tabs/sensors.js',
            'src/css/tabs/sensors.css',
            '#subtab-sensors'
        );
    }
    currentSubtab = subtab;
}

TABS.io_monitor.initialize = function(callback) {
    GUI.load('tabs/io_monitor.html', function() {
        $('.tab-io-monitor .subtab').on('click', function() {
            $('.tab-io-monitor .subtab').removeClass('active');
            $(this).addClass('active');
            const subtab = $(this).data('subtab');
            showSubtab(subtab);
        });

        const firstSubtab = $('.tab-io-monitor .subtab.active').data('subtab');
        showSubtab(firstSubtab);

        if (callback) callback();
    });
};

TABS.io_monitor.cleanup = function(callback) {
    if (currentSubtab && window.TABS[currentSubtab] && typeof window.TABS[currentSubtab].cleanup === 'function') {
        window.TABS[currentSubtab].cleanup();
    }
    if (callback) callback();
};