const assert = require('chai').assert;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

const Configuration = require('../../resources/configuration.js');

const TEST_CONFIG_DIR = './test/resources/config/';
const TEST_OUTCOMES_DIR = './test/resources/outcomes/';
const TEST_STORAGE_DIR = './test/resources/storage/';

describe('ensure that the configuration class works', () => {
    it("should be possible to read a valid file and store the respective configurations", () => {
        return new Configuration('./test/resources/config/bootstrap.json')
        .then( (config) => {
            assert.isNotNull(config);
            assert.equal(TEST_CONFIG_DIR, config.configPath);
            assert.equal(TEST_OUTCOMES_DIR, config.outcomesPath);
            assert.equal(TEST_STORAGE_DIR, config.storagePath);
        })
        .should.be.fulfilled;
    })
})