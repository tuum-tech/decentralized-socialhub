import * as createAccountEmail from 'src/components/Auth/fetchapi';
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('User Creation based on Email', () => {
  it('Should request to create user', done => {
    const getStub = sinon
      .stub(createAccountEmail, 'requestCreateEmailUser')
      .resolves({ meta: { message: 'OK' } });

    createAccountEmail
      .requestCreateEmailUser(
        'name',
        'email@gmail.com',
        'temporary_email@gmail.com'
      )
      .then((res: any) => {
        expect(res.meta.message).to.be.eq('OK');
        expect(getStub).to.have.been.calledWith(
          'name',
          'email@gmail.com',
          'temporary_email@gmail.com'
        );
        done();
      })
      .catch(done);
  });

  it('Should request to verify code', done => {
    const getStub = sinon
      .stub(createAccountEmail, 'requestVerifyCode')
      .resolves({ return_code: 'CONFIRMED' });

    createAccountEmail
      .requestVerifyCode('ABC123', 'email@gmail.com', '')
      .then((res: any) => {
        expect(res.return_code).to.be.eq('CONFIRMED');
        expect(getStub).to.have.been.calledWith(
          'ABC123',
          'email@gmail.com',
          ''
        );
        done();
      })
      .catch(done);
  });

  it('Should request update email', done => {
    const getStub = sinon
      .stub(createAccountEmail, 'requestUpdateEmail')
      .resolves({ status: 'success' });

    createAccountEmail
      .requestUpdateEmail('temporary_email@gmail.com', 'email@gmail.com', '')
      .then((res: any) => {
        expect(res.status).to.be.eq('success');
        expect(getStub).to.have.been.calledWith(
          'temporary_email@gmail.com',
          'email@gmail.com',
          ''
        );
        done();
      })
      .catch(done);
  });
});
