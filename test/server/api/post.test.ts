import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetType, DBRunTypeWithCallback } from "../../utils/types";
jest.mock('../../../server/database');

const fakePost = {
    "evil": "virus"
}

let realPost = {
    "Username": "bob",
    "Content": "some content",
    "Picture": "data",
    "Timestamp": "time posted"
}

// instead of actually reflecting changes in the database, we simply keep track of the
// number of posts made and return that value from that...
let postCount = 0;

// ...so here, we are returning the value
const mockGet = jest.fn((stmt, callback) => {
    // @ts-ignore
    callback(null, {
        count: postCount
    });
}) as jest.MockedFunction<DBGetType>;

// ...and everytime we "make" a post, we simply increment that value
const mockRun = jest.fn((stmt, params, callback) => {
    postCount++;
    // @ts-ignore
    callback(null);
}) as jest.MockedFunction<DBRunTypeWithCallback>;

// block console logging so it doesn't get annoying
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

})

describe('[API] /post', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();
    });

    test("Test first post", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/post").send(realPost);

        expect(res.status).toBe(200);
        expect(res.text).toBe("0");
    });

    // we need a test for the second post to test branching code
    test("Test second post", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/post").send(realPost);

        expect(res.status).toBe(200);
        expect(res.text).toBe("1");
    });

    test("Test invalid post", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/post").send(fakePost);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid post request!");
    });

    test("Handle database errors", async () => {
        // using a different mock function here that intentionally throws an error with the database
        db.run = jest.fn((stmt, params, callback) => {
            // @ts-ignore
            callback(new Error());
        }) as jest.MockedFunction<DBRunTypeWithCallback>;

        const res = await supertest(app).post("/api/post").send(realPost);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!")
    });
});
