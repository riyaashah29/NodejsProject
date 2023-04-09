const expect = require('chai').expect;
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/is-auth');
const sinon = require('sinon')

describe('Auth middleware', function(){

    it('should throw an error if no authorization header is present', function(){
        const req = {
            get: function(headerName){
                return null; //this means it does not return a value for out authorization call 
            }
        };
        expect(authMiddleware.bind(this,req, {}, () => {})).to.throw('Not authenticated!');
    })
    
    // Authorization : 'Bearer ' + token 6 mate aapde const token = authHeader.split(' ')[1]; krie 6ie pan jo ek j string hoy to error aapvi mate
    
    it('should throw an error if the authorization header is only one string', function(){
        // own dummy req object
        const req = {
            get: function(headerName){
                return 'xyz'; //this means it return only one string 
            }
        };
        expect(authMiddleware.bind(this,req, {}, () => {})).to.throw();
    })

    it('should throw an error if the token cannot be varified', function(){
        const req = {
            get: function(headerName){
                return 'Bearer xyz';
            }
        };
        expect(authMiddleware.bind(this,req, {}, () => {})).to.throw();
    })

    it('should yield a userId after decoding the token', function(){
        const req = {
            get: function(headerName){
                // error mdse bcz aapde token su hse ketli moti string hse te khbr na hoy and ahiy aapdi string token malformed error aapse
                return 'Bearer shhdhgsdjvs'; 
            }
        };
        // req.userId = decodedToken.userId; bcz aapde is-auth ma req.userId ma pass kryu 6 mate

        sinon.stub(jwt, 'verify');
        jwt.verify.returns({userId: 'abc'})
        // we are overwriting actual jwt.verify()
        // jwt.verify = function(){
        //     return { userId : 'abc'}
        // }
        authMiddleware(req, {}, () => {})
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore()
    })
    // but jo req.userId ma store na krtu hoy to uper no test krvo jaruri bne ena mate we have to find a way to shutting down jwt.verify method aapde valid 6 k nai token e janvu 6 verify nai krvu but here we want it to succeed for a random token bcz we then want to test something totally different
})
