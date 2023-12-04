import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBGetType } from "../../utils/types";

jest.mock("../../../server/database");

const req = supertest(app);

// block console logging so it doesn't get annoying
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
});

describe("Tests for the /api/getProfilePicture endpoint", () => {

    beforeEach(() => {
        db.get = jest.fn();
    });

    test("200 - normal usage", async () => {
        db.get = jest.fn((stmt, callback) => {
            // fake row
            let row = { Username: "bob", ProfilePicture: "test_profile.png" };
            // @ts-ignore
            callback(null, row);
        }) as jest.MockedFunction<DBGetType>;

        const response = await req
            .get("/api/getProfilePicture/bob");

        // only going to check for properties once
        expect(response.text).toBe("test_profile.png");
        expect(response.status).toBe(200);
    });
    
    test("400 - User does not exist", async () => {
        db.get = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(null, null);
        }) as jest.MockedFunction<DBGetType>;

        const response = await req
            .get("/api/getProfilePicture/test");

        expect(response.text).toBe("User does not exist"); 
        expect(response.status).toBe(400);
    });
    
    /*
    test("500 - database error", async () => {
        db.all = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(new Error("Error!"), null);
        }) as jest.MockedFunction<DBAllType>;
        
        const response = await req
            .post("/api/getProfilePictures");
        
        expect(response.status).toBe(500);
        expect(response.text).toBe("Error: Database error!");
    });
    */

})
