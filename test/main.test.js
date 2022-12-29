const { expect } = require("chai");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

describe("Library management unit tests", () => {
  /*
   * Test the /GET route
   */
  describe("/GET books and magazines", () => {
    it("it should GET all the books and magazines", (done) => {
      chai
        .request(server)
        .get("/api/v1/library")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(res.body).to.have.property("books");
          expect(res.body).to.have.property("magazines");
          done();
        });
    });
  });
});
