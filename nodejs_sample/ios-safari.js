"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('./helpers/appium-servers');

var cap = process.env.cap ? process.env.cap : "ios81" ;

describe("mobile browser ", function () {
  this.timeout(300000);
  var driver;

  before(function () {
    var serverConfig = serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require("./helpers/logging").configure(driver);
    var desired = _.clone(require("./helpers/caps")[cap]);
    return driver.init(desired);
  });

  after(function () {
    return driver
      .quit()
      .finally(function () {
      });
  });

  afterEach(function () {
  });


  it("should get the mogo homepage", function () {
    return driver
      .get('https://www.mogo.ca')
      .sleep(1000)
      .saveScreenshot('mogo.homepage_screenshot.png')
      .title().should.eventually.include('Mogo.ca');
  });

});
