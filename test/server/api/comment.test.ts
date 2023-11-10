import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetType, DBGetTypeWithParams, DBRunTypeWithCallback } from "../../utils/types";
import { addSession } from "../../../server/types/Session";
jest.mock('../../../server/database');

let parentPostID = 0;
let parentNumComments = 0;
let postComment = "";
let bobsToken = addSession({ username: "bob" });

// need a real post to be able to comment to
const bobsPost = {
    "token": bobsToken,
    "content": "this is my main post",
    "picture": "main_post.jpg"
}

const fakeComment = {
    "invalid": "data",
    "corrupt": "uh oh!"
}

let realComment = {
    "id": "0",
    "content": "bob's reply",
    "token": bobsToken
}

let realCommentBadID = {
    "id": "1337",
    "content": "edited message!",
    "token": bobsToken
}

let realCommentBadToken = {
    "id": "0",
    "content": "edited message!",
    "token": "imtryingtohackbobsrobloxaccount"
}

// this is super jank, but it's a way to test things without running into errors.
const mockGetPosts = jest.fn((stmt, callback) => {
    // keep this empty unless the ID provided matches our post ID
    let row = { count: 0 }
    // @ts-ignore
    callback(null, row);
}) as jest.MockedFunction<DBGetType>;

const mockGet = jest.fn((stmt, params, callback) => {
    // keep this empty unless the ID provided matches our post ID
    let row;
    if (params[0] === parentPostID) {
        row = { some: "content" };
    }
    // @ts-ignore
    callback(null, row);
}) as jest.MockedFunction<DBGetTypeWithParams>;

const mockRun = jest.fn((stmt, params, callback) => {
    // distinguish between run statements: 6 params is creating post, 1 param is updating CommentCount
    if (params.length === 6) {
        postComment = params[2];
    } else {
        ++parentNumComments;
    }
    // @ts-ignore
    callback(null);
}) as jest.MockedFunction<DBRunTypeWithCallback>;

// again, kinda jank. but it works!
const mockGetPostsError = jest.fn((stmt, callback) => {
    // @ts-ignore
    callback(new Error(), null);
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

describe('[API] /comment: database', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();

        // need to reset this for each test
        postComment = "";
        parentNumComments = 0;
    });

    test("'get' error", async () => {
        db.get = mockGetPostsError;
        db.run = mockRun;

        const res = await supertest(app).post("/api/comment").send(realComment);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!");
        expect(postComment).toBe("");
    });

    test("'run' error", async () => {
        db.get = jest.fn().mockImplementationOnce(mockGetPosts).mockImplementation(mockGet);
        db.run = mockRunError;

        const res = await supertest(app).post("/api/comment").send(realComment);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Database error!")
        expect(postComment).toBe("");
    });
});

describe('[API] /comment: request', () => {

    beforeEach(() => {
        db.get = jest.fn();
        db.run = jest.fn();

        // need to reset this for each test
        postComment = "";
        parentNumComments = 0;
    });

    test("Test valid comment", async () => {
        db.get = jest.fn().mockImplementationOnce(mockGetPosts).mockImplementation(mockGet);
        db.run = mockRun;

        await supertest(app).post("/api/post").send(bobsPost);
        const res = await supertest(app).post("/api/comment").send(realComment);

        expect(res.status).toBe(200);
        expect(res.text).toBe("1");
        expect(postComment).toBe(realComment.content);
    });

    test("Test invalid post ID", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/comment").send(realCommentBadID);
        expect(res.status).toBe(400);
        expect(res.text).toBe("Invalid post ID!");
        expect(postComment).toBe("");
    });

    test("Test invalid user token", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/comment").send(realCommentBadToken);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid token provided!");
        expect(postComment).toBeFalsy();
    });

    test("Test invalid request", async () => {
        db.get = mockGet;
        db.run = mockRun;

        const res = await supertest(app).post("/api/comment").send(fakeComment);

        expect(res.status).toBe(500);
        expect(res.text).toBe("Invalid comment request!");
        expect(postComment).toBeFalsy();
    });
});
