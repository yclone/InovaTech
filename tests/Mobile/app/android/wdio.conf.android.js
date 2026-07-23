require('dotenv').config();
const path = require('path');

exports.config = {
  // ====================
  // Runner Configuration
  // ====================
  runner: 'local',
  port: process.env.APPIUM_PORT || 4723,
  path: '/',

  // ==================
  // Specify Test Files
  // ==================
  specs: ['./specs/**/*.spec.js'],
  exclude: [],

  // ============
  // Capabilities
  // ============
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'Android',
      'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '16.0',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'emulator-5554',
      'appium:automationName': 'UiAutomator2',
      'appium:app': path.resolve(__dirname, '../../APK/app-debug.apk'),
      'appium:appPackage': process.env.APP_PACKAGE || 'com.example.inovatechmob',
      'appium:appActivity': process.env.APP_ACTIVITY || '.MainActivity',
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
      'appium:settings[waitForIdleTimeout]': 100,
    },
  ],

  // ===================
  // Test Configurations
  // ===================
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'html-nice',
      {
        outputDir: './reports/html-reports/',
        filename: 'report.html',
        reportTitle: 'InovaTech Mobile Test Report',
        linkScreenshots: true,
        showInBrowser: false,
        collapseTests: false,
        useOnAfterCommandForScreenshot: false,
      },
    ],
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  // =====
  // Hooks
  // =====
  onPrepare: function (config, capabilities) {
    console.log('📱 Preparing Appium tests...');
  },

  beforeSession: function (config, capabilities, specs) {
    console.log('🚀 Starting test session...');
  },

  before: function (capabilities, specs) {
    const chai = require('chai');
    global.expect = chai.expect;
    global.assert = chai.assert;
    global.should = chai.should();
  },

  beforeTest: function (test, context) {
    console.log(`\n▶️  Starting test: ${test.title}`);
  },

  afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
      await driver.takeScreenshot();
    }
  },

  after: function (result, capabilities, specs) {
    console.log('✅ Test session completed');
  },

  onComplete: function (exitCode, config, capabilities, results) {
    console.log('📊 All tests completed!');
  },

  // =================
  // Service Providers
  // =================
  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          address: process.env.APPIUM_HOST || '127.0.0.1',
          port: parseInt(process.env.APPIUM_PORT) || 4723,
          relaxedSecurity: true,
          log: './logs/appium.log',
        },
        logPath: './logs/',
      },
    ],
  ],
};
