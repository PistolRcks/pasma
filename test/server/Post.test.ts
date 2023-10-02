import { expect, test } from "bun:test";
import { Post, isPost } from "../../server/database.ts";

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

// making sure our isPost function can identify an incorrect field.
test("Check fake post", () => {
    expect(isPost(fakePost)).toBe(false);
});

// making sure our isPost function can correctly identify all matching fields.
test("Check real post", () => {
    expect(isPost(realPost)).toBe(true);
});
