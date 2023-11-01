import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetType, DBRunTypeWithCallback } from "../../utils/types";
import { addSession } from "../../../server/types/Session";
jest.mock('../../../server/database');

let alexsToken = addSession({ username: "alex_jones45" });

const fakePost = {
    "doyou": "remember",
    "thetwentyfirstnight": "ofseptember"
}

let realPost = {
    "token": alexsToken,
    "content": "blah blah blah",
    "picture": "johnsepicphoto.jpg"
}

let realPostBadToken = {
    "token": "floodingpasmawithposts",
    "content": "mwahahahaha, im so evil!",
    "picture": "reallybadimage.png"
}

// instead of actually reflecti ng changes in the database, we simply keep track of the
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

// the functions below purposefully spit out errors for testing purposes
const mockGetError = jest.fn((stmt, callback) => {
    // @ts-ignore
    callback(new Error());
}) as jest.MockedFunction<DBGetType>;

const mockRunError = jest.fn((stmt, params, callback) => {
    // @ts-ignore
    callback(new Error());
}) as jest.MockedFunction<DBRunTypeWithCallback>;

// block console logging so it doesn't get annoying
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

})

describe('[API] /post: database', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();
    });

    test("'get' error", async () => {
        db.get = mockGetError;
        db.run = mockRun;

        const res = await supertest(app).post("/api/post").send(realPost);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!")
    });

    test("'run' error", async () => {
        db.get = mockGet;
        db.run = mockRunError;

        const res = await supertest(app).post("/api/post").send(realPost);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!")
    });
});

describe('[API] /post: request', () => {

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

    test("Test valid post with invalid token", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/post").send(realPostBadToken);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid token provided!");
    });
});
