const expect = require('chai').expect;
const should = require('chai').should;
const request = require('supertest');
const app = require('../server.js');

describe('undefined routes', () => {
  it('respond with a 404', function(done) {
    request(app)
      .get('/chris-pratt')
      .expect(404, done);
  })

  it('respond with a 404', function(done) {
    request(app)
      .get('/ron-swanson')
      .expect(404, done);
  })

  it('/ - responds with 404', function(done) {
    request(app)
      .get('/')
      .expect(404, done);
  })
});
