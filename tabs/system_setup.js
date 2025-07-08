'use strict';

const { GUI } = require('./../js/gui');
const TABS = window.TABS || (window.TABS = {});

TABS.system_setup = {};

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
    $('.tab-system-setup .subtab-content').hide();
    $('#subtab-' + subtab).show();
    if (subtab === 'mixer') {
        loadSubtab(
            'mixer',
            'tabs/mixer.html',
            'tabs/mixer.js',
            'src/css/tabs/mixer.css',
            '#subtab-mixer'
        );
    } else if (subtab === 'outputs') {
        loadSubtab(
            'outputs',
            'tabs/outputs.html',
            'tabs/outputs.js',
            null,
            '#subtab-outputs'
        );
    }
    currentSubtab = subtab;
}

TABS.system_setup.initialize = function(callback) {
    GUI.load('tabs/system_setup.html', function() {
        $('.tab-system-setup .subtab').on('click', function() {
            $('.tab-system-setup .subtab').removeClass('active');
            $(this).addClass('active');
            const subtab = $(this).data('subtab');
            showSubtab(subtab);
        });

        const firstSubtab = $('.tab-system-setup .subtab.active').data('subtab');
        showSubtab(firstSubtab);

        if (callback) callback();
    });
};

TABS.system_setup.cleanup = function(callback) {
    if (currentSubtab && window.TABS[currentSubtab] && typeof window.TABS[currentSubtab].cleanup === 'function') {
        window.TABS[currentSubtab].cleanup();
    }
    if (callback) callback();
};