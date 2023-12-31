import { before } from "node:test";
import { initDB } from "../../server/database";
import { isUser, isPost } from "../../server/types/DatabaseTypes";

// fakeUser has the field "fakeName" instead of "Username", meaning isUser should return false.
let fakeUser = {
    fakeName: "bob",
    Password: "securepassword",
    Salt: "123abc",
    UserType: "bad"
}

// realUser has all the necessary fields for a User and should return true from isUser.
let realUser = {
    Username: "bob",
    Password: "securepassword",
    Salt: "123abc",
    UserType: "standard"
}

// fakePost has the field "fakeContent" instead of "Content", meaning isPost should return false.
let fakePost = {
    Username: "bob",
    fakeContent: "some content",
    Picture: "data",
    Timestamp: "time posted"
}

// realPost has all the necessary fields for a Post and should return true from isPost.
let realPost = {
    Username: "bob",
    Content: "some content",
    Picture: "data",
    Timestamp: "time posted"
}

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

})

describe('User checks', () => {
    // making sure our isUser function can identify an incorrect field.
    test("Check fake user", () => {
        expect(isUser(fakeUser)).toBe(false);
    });

    // making sure our isUser function can correctly identify all matching fields.
    test("Check real user", () => {
        expect(isUser(realUser)).toBe(true);
    });
});

describe('Post checks', () => {
    // making sure our isPost function can identify an incorrect field.
    test("Check fake post", () => {
        expect(isPost(fakePost)).toBe(false);
    });

    // making sure our isPost function can correctly identify all matching fields.
    test("Check real post", () => {
        expect(isPost(realPost)).toBe(true);
    });
});

/* list out the tables. make sure we have all the necessary tables, since they should be
   created by initDB() */
describe('Database checks', () => {
    test("Checking database structure", async () => {
        let testDBTables = await initDB(":memory:");

        testDBTables.all("SELECT name FROM sqlite_master WHERE type='table';", [], function (err: Error, rows: any[]) {
            expect(rows).toEqual([{ name: 'ProfilePictures' }, { name: 'StockImages' }, { name: 'PostPhrases' }, { name: 'Users' }, { name: 'Posts' }, { name: 'PostDislikes' }]);
        });
    });
});
