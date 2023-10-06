import { User, isUser, Post, isPost, initDB } from "../../server/database";

// fakeUser has the field "fakeName" instead of "Username", meaning isUser should return false.
let fakeUser = {
    fakeName: "bob",
    Password: "securepassword",
    Salt: "123abc",
    ProfilePicture: "data"
}

// realUser has all the necessary fields for a User and should return true from isUser.
let realUser = {
    Username: "bob",
    Password: "securepassword",
    Salt: "123abc",
    ProfilePicture: "data"
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

/* list out the tables. make sure we have the Users and Posts tables, since they should be
   created by initDB() */
describe('Database checks', () => {
    test("Checking database structure", done => {
        let testDBTables = initDB(":memory:");
        
        testDBTables.all("SELECT name FROM sqlite_master WHERE type='table';", [], function (err: Error, rows: any[]) {
            expect(rows).toEqual([{name: 'Users'}, {name: 'Posts'}]);
            done();
        });
    });
});
