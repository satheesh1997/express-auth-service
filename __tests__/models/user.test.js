const testDb = require('../db');
const User = require('../../src/models/user');

beforeAll(async () => await testDb.connect());
afterEach(async () => await testDb.clearDatabase());
afterAll(async () => await testDb.closeDatabase());

const userData = {
    firstName: 'Continous',
    lastName: 'Integration',
    email: 'ci@tervu.in',
    password: 'testingpassword'
}
const createUser = (cb) => User.create(userData, cb);

/**
 * User methods test suite.
 */
describe('methods', () => {
    it('.updateLastLogin() is updating lastLogin', done => {
        createUser((err, cUser) => {
            // initially lastLogin will be undefined
            try {
                expect(cUser.lastLogin).toBe(undefined);
            } catch (error) {
                done(error);
            }

            // check if lastLogin changes from undefined after updating
            cUser.updateLastLogin((err, user) => {
                try {
                    expect(user.lastLogin).not.toBe(null);
                    const lastLogin = user.lastLogin;

                    // again do a update to check if its really updating
                    user.updateLastLogin((err, kuser) => {
                        try {
                            expect(kuser.lastLogin).not.toBe(lastLogin);
                            done();
                        } catch (error) {
                            done(error);
                        }
                    });
                } catch (error) {
                    done(error);
                }
            });
        });
    });
    it('.setPassword() is updating the password', done => {
        const userData = {
            firstName: "Continous",
            lastName: "Integration",
            email: 'ci@tervu.in',
        }

        // not using createUser as i need to create without setting password initially
        User.create(userData, (err, cUser) => {
            try {
                expect(cUser.password).toBe(undefined);
                cUser.setPassword('iamtestingthis', (err, user) => {
                    try {
                        expect(user.password).not.toBe(undefined);
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
            } catch (error) {
                done(error);
            }
        });
    });
    it('.toJson() is returning the user data except password', done => {
        createUser((err, user) => {
            let uData = user.toJson();
            try {
                expect(uData.email).toEqual(userData.email);
                expect(uData.password).toBe(undefined);
                done();
            } catch (error) {
                done(error);
            }
        })
    })
});

/**
 * User schema test suite.
 */
describe('schema', () => {
    it('saving user should throw validation error if the email is not valid', done => {
        const userData = {
            firstName: 'Continous',
            lastName: 'Integration',
            email: 'citervu.in',
            password: 'test1234567'
        }

        // not using createUser as i need to create with invalid email
        User.create(userData, (err, cUser) => {
            try {
                expect(err).not.toBe(undefined);
                expect(cUser).toBe(undefined);
                expect(err._message).toEqual('User validation failed');
                done();
            } catch (error) {
                done(error);
            }
        });
    });
    it('saving user should throw validation error if the password is not valid', done => {
        const userData = {
            firstName: 'Continous',
            lastName: 'Integration',
            email: 'citervu.in',
            password: 'test'
        }

        // not using createUser as i need to create with invalid password
        User.create(userData, (err, cUser) => {
            try {
                expect(err).not.toBe(null);
                expect(cUser).toBe(undefined);
                expect(err._message).toEqual('User validation failed');
                done();
            } catch (error) {
                done(error);
            }
        });
    });
    it('saving user without password should not throw error', done => {
        const userData = {
            firstName: 'Continous',
            lastName: 'Integration',
            email: 'ci@tervu.in'
        }

        // not using createUser as i need to create with no password
        User.create(userData, (err, cUser) => {
            try {
                expect(err).toBe(null);
                done();
            } catch (error) {
                done(error);
            }
        });
    });
});

/**
 * User statics test suite.
 */
describe('statics', () => {
    it('.create() is creating a user', done => {
        User.create(userData, (err, user) => {
            try {
                expect(user).not.toBe(null);
                done();
            } catch (error) {
                done(error);
            }
        });
    });
    it('.findByEmail() is giving the correct user', done => {
        createUser((err, cUser) => {
            User.findByEmail(cUser.email, (err, user) => {
                try{
                    expect(user).not.toBe(null);
                    expect(cUser._id).toEqual(user._id);
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });
    });
});