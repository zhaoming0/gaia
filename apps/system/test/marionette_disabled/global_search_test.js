'use strict';

var assert = require('assert');
var Rocketbar = require('./lib/rocketbar.js');

var SETTINGS_APP = 'app://settings.gaiamobile.org';
var CALENDAR_APP = 'app://calendar.gaiamobile.org';

marionette('Global search >', function() {
  var client = marionette.client({
    profile: {
      prefs: {
        'devtools.debugger.forbid-certified-apps': false
      }
    },
    desiredCapabilities: { raisesAccessibilityExceptions: false }
  });

  var sys, rocketbar, actions;
  var settings, calendar;
  var halfWidth, halfHeight;

  setup(function() {
    actions = client.loader.getActions();

    sys = client.loader.getAppClass('system');
    sys.waitForFullyLoaded();

    rocketbar = new Rocketbar(client);

    settings = sys.waitForLaunch(SETTINGS_APP);
    calendar = sys.waitForLaunch(CALENDAR_APP);

    // Making sure the opening transition for the calendar app is over.
    client.waitFor(function() {
      return calendar.ariaDisplayed() && !settings.ariaDisplayed();
    });

    var width = client.executeScript(function() {
      return window.innerWidth;
    });
    halfWidth = width / 2;

    var height = client.executeScript(function() {
      return window.innerHeight;
    });
    halfHeight = height / 2;
  });

  test('Triggering the search from the hot corner', function() {
    var top = sys.topPanel;
    actions.tap(top, 10, 0, 10).perform();
    client.waitFor(function() {
      return rocketbar.backdropDisplayed();
    });

    assert(true, 'search was triggered');
  });

  test('Should not trigger during an edge gesture', function() {
    var top = sys.topPanel;

    // Swipe-n-tap
    actions.flick(sys.leftPanel, 0,
                  halfHeight, halfWidth,
                  halfHeight, 100).tap(top, 10, 0, 10).perform();

    client.waitFor(function() {
      return !calendar.ariaDisplayed() && settings.ariaDisplayed();
    });

    // No permission prompt, no focused rocketbar either
    assert(!rocketbar.backdropDisplayed(), 'search was not triggered');
  });

});
