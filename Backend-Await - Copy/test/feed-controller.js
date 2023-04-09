const expect = require("chai").expect;
const sinon = require("sinon"); //bcz we will start with stubbing that post, findOne()
const io = require('../socket')
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

describe("Feed Controller", function () {
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

  it("should add a created post to the posts of the creator", function (done) {

    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post'
      },
      file: {
        path: 'abc'
      },
      userId : '642e927627ae6b26e3648aa1' //real id format joie bcz controller ma db sathe work krva use krie 6ie req.userID
    };
    const res = { status: function() {
        return this; //res.status e response object nai but result of the status method par call thyu 6 mare we return this here so that we return the number reference at the entire object
    } , json: function() {}};

    // sockrt hoy to stub socket
    const stub = sinon.stub(io, 'getIO').callsFake(() => {
        return {
          emit: function() {}
        }
      });
    //   sinon.stub(io, 'getIO');
    // io.getIO.returns({ emit: () => {} });
    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property("posts");
      expect(savedUser.posts).to.have.length(1); //bcz there should be one new post added to it

    //   socket hoy to
    stub.restore();
    // io.getIO.restore();
      done();
    });
  });

  after(function (done) {
    User.deleteMany({}) 
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
