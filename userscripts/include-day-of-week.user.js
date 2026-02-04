// ==UserScript==
// @name         Add day of week to dates in myTurn
// @namespace    https://github.com/laurenipsum/TTL
// @version      0.2
// @description  Add the day of the week to dates matching mm/dd/yyyy format in myTurn
// @author       ipsum (with Claude.ai, again, alas)
// @match        https://*.myturn.com/library/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    function addDayOfWeekToDates() {
        const datePattern = /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g;
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        while (walker.nextNode()) {
            if (walker.currentNode.nodeValue.match(datePattern)) {
                textNodes.push(walker.currentNode);
            }
        }

        textNodes.forEach(node => {
            node.nodeValue = node.nodeValue.replace(datePattern, (match) => {
                const date = new Date(match);
                const dayName = dayNames[date.getDay()];
                return `${dayName} ${match}`;
            });
        });
    }

    setTimeout(addDayOfWeekToDates, 1000); // Wait 1 second

})();
