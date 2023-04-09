const expect = require("chai").expect;
const sinon = require("sinon"); //bcz we will start with stubbing that post, findOne()
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller", function () {
    // beforeEach(function(done) => {})
    // afterEach(function(done) => {})
  before(function (done) {
    mongoose
      .connect(
        "mongodb+srv://riyaashah402:wMB0h5E6y2jErofF@cluster0.sdwkice.mongodb.net/test-messagesNode"
      )
      .then((result) => {
        // testing code
        // create dummy user
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
          _id: "642e927627ae6b26e3648aa1",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });
  // stubbing findOne()
  it("should throw an error with code 500 if accessing the database fails", function (done) {
    // done is a function which is called once this test cases is done by default its done once it execute the code top to bottom - but if you accept this argument, it will actually wait for you to call it and then you can call it in a asynchronous code snippit
    // we are replacing here findOne method with stub that throw an error
    sinon.stub(User, "findOne");
    User.findOne.throws();

    // dummy req obj
    const req = {
      // bcz controller ma req.body.email , req.body.password 6
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };
    // expect(AuthController.login)
    AuthController.login(req, {}, () => {}).then((result) => {
      // status code check krva 500 6 k nai
      // console.log(result);
      expect(result).to.be.an("error"); //error ni jgya e other valuse docs ma joi skay string, obj, null so on
      // bcz statusCode = 500 check krvo 6
      expect(result).to.have.property("statusCode", 500);
      done(); //jo ahi done na lkhie to bdhu synchronously work krtu - but we signal here that we want to wait for this code to executr bcz before it treats this test case as done.
    });

    User.findOne.restore();

    // login function in controller is async so that promise return krvu pde - check promise in login will return any error
    // so aana mate aapde auth controller - login ma 6elle return add kryu so that this will implicitly return the promise we have hidden behind async await there
  });

  it("should send a response with a valid user status for an existing user", function (done) {
    // connect to db
    // mongoose.connect('mongodb+srv://riyaashah402:wMB0h5E6y2jErofF@cluster0.sdwkice.mongodb.net/test-messagesNode')
    //     .then(result => {
    //         // testing code
    //         // create dummy user
    //         const user = new User({
    //             email: 'test@test.com',
    //             password: 'tester',
    //             name: 'Test',
    //             posts: [],
    //             _id: '642e927627ae6b26e3648aa1'
    //         })
    //         return user.save()
    //     })
    // .then(() => {
    // in this now we have a dummy user set up and saved to the db
    const req = { userId: "642e927627ae6b26e3648aa1" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");
      // User.deleteMany({}) //all users are deleted - bcz aana vgr duplicate key ni error aave 6
      // // done();
      // .then(() => {
      //     return mongoose.disconnect()
      // })
      // .then(() => {
      //     done();
      // })
      done();
    });
    // })
    // .catch(err => {
    //     console.log(err)
    // })
  });

  after(function (done) {
    User.deleteMany({}) //all users are deleted - bcz aana vgr duplicate key ni error aave 6
      // done();
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
