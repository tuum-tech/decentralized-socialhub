import * as createAccountSocial from '../fetchapi-tests';
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('User Creation based on Social', () => {
  it('Should request to create user with LinkedIn', done => {
    const getStub = sinon
      .stub(createAccountSocial, 'requestLinkedinLogin')
      .resolves({ meta: { message: 'OK' } });

    createAccountSocial
      .requestLinkedinLogin()
      .then((res: any) => {
        expect(res.meta.message).to.be.eq('OK');

        done();
      })
      .catch(done);
  });

  it('Should request to create user with Google', done => {
    const getStub = sinon
      .stub(createAccountSocial, 'requestGoogleLogin')
      .resolves({ meta: { message: 'OK' } });

    createAccountSocial
      .requestGoogleLogin()
      .then((res: any) => {
        expect(res.meta.message).to.be.eq('OK');

        done();
      })
      .catch(done);
  });

  it('Should request to create user with Facebook', done => {
    const getStub = sinon
      .stub(createAccountSocial, 'requestFacebookLogin')
      .resolves({ meta: { message: 'OK' } });

    createAccountSocial
      .requestFacebookLogin()
      .then((res: any) => {
        expect(res.meta.message).to.be.eq('OK');

        done();
      })
      .catch(done);
  });
});
