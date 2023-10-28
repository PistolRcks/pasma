import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetType, DBGetTypeWithParams, DBRunTypeWithCallback } from "../../utils/types";
jest.mock('../../../server/database');

const fakeReact = {
    "hehe": "hawhaw"
}

let realReact = {
    "id": "0"
}

let realReactBadID = {
    "id": "1234"
}

// instead of actually reflecting changes in the database, we simply keep track of the
// a boolean and ID that is the "post" we are reacting to
let postLiked = false;
let postID = "0";

const mockGet = jest.fn((stmt, params, callback) => {
    // nothing super specific needed here, just can't be empty
    let row = { test: "pass" };
    // however, if the ID isn't valid, change it to something the code can recognize as a fail
    if (params[0] != postID) {
        row = { test: "fail" };
    }
    // @ts-ignore
    callback(null, row);
}) as jest.MockedFunction<DBGetTypeWithParams>;

const mockRun = jest.fn((stmt, params, callback) => {
    postContent = params[0];
    // @ts-ignore
    callback(null);
}) as jest.MockedFunction<DBRunTypeWithCallback>;

// the functions below purposefully spit out errors for testing purposes
const mockGetError = jest.fn((stmt, params, callback) => {
    // @ts-ignore
    callback(new Error(), null);
}) as jest.MockedFunction<DBGetTypeWithParams>;

const mockRunError = jest.fn((stmt, params, callback) => {
    // @ts-ignore
    callback(new Error());
}) as jest.MockedFunction<DBRunTypeWithCallback>;

// block console logging so it doesn't get annoying
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
})

describe('[API] /edit: database', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();

        // need to reset this for each test
        postContent = "uneditted message";
    });

    test("'get' error", async () => {
        db.get = mockGetError;
        db.run = mockRun;

        const res = await supertest(app).post("/api/edit").send(realEdit);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!");
        expect(postContent).toBe("uneditted message");
    });

    test("'run' error", async () => {
        db.get = mockGet;
        db.run = mockRunError;

        const res = await supertest(app).post("/api/edit").send(realEdit);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!")
        expect(postContent).toBe("uneditted message");
    });
});

describe('[API] /post: request', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();

        // need to reset this for each test
        postContent = "uneditted message";
    });

    test("Test valid edit", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/edit").send(realEdit);

        expect(res.status).toBe(200);
        expect(res.text).toBe("");
        expect(postContent).toBe("editted message!");
    });

    test("Test invalid post ID", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/edit").send(realEditBadID);

        expect(res.status).toBe(403);
        expect(res.text).toBe("Invalid post ID!");
        expect(postContent).toBe("uneditted message");
    });

    test("Test invalid request", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/edit").send(fakeEdit);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid edit request!");
        expect(postContent).toBe("uneditted message");
    });
});
