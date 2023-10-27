import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetType, DBExecType } from "../../utils/types";
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

// block console logging so it doesn't get annoying
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

})

describe('[API] /post', () => {

    // instead of actually reflecting changes in the database, we simply keep track of the
    // number of posts made and return that value from that...
    let postCount = 0;

    beforeEach(() => {
        // ...so here, we are returning the value
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(null, { 
                count: postCount
            });
        }) as jest.MockedFunction<DBGetType>;

        // ...and everytime we "make" a post, we simply increment that value
        db.exec = jest.fn((stmt, callback) => {
            // @ts-ignore
            postCount++;
        }) as jest.MockedFunction<DBExecType>;
    });

    test("Test first post", async () => {
        const res = await supertest(app).post("/api/post").send(realPost);
        expect(res.text).toBe("0");
    });

    // we need a test for the second post to test branching code
    test("Test second post", async () => {
        const res = await supertest(app).post("/api/post").send(realPost);
        expect(res.text).toBe("1");
    });

    test("Test invalid post", async () => {
        const res = await supertest(app).post("/api/post").send(fakePost);
        expect(res.status).toBe(500);
    });
});
