import supertest from "supertest";
import app from "../../../server/server";
import { db } from "../../../server/database";
import { DBAllType } from "../../utils/types";
import { addSession } from "../../../server/types/Session";

jest.mock("../../../server/database");

const req = supertest(app);

// block console logging so it doesn't get annoying
// also generate session token
let sessionToken: string;
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

    sessionToken = addSession({ username: "bob" });
});

describe("Tests for the /api/getProfilePictures endpoint", () => {

    beforeEach(() => {
        db.all = jest.fn();
    });

    test("200 - normal usage", async () => {
        db.all = jest.fn((stmt, callback) => {
            // fake row
            let rows = [{ Picture: "JaredD-2023.png" }];
            // @ts-ignore
            callback(null, rows);
        }) as jest.MockedFunction<DBAllType>;

        const response = await req
            .get("/api/getProfilePictures").send();

        // only going to check for properties once
        expect(response.status).toBe(200);
        expect(response.body).toEqual(["JaredD-2023.png"]);
    });
    
    test("200 - normal usage, handle null return from `db.all`", async () => {
        db.all = jest.fn((stmt, callback) => {
            // fake row
            let rows: any = [];
            // @ts-ignore
            callback(null, rows);
        }) as jest.MockedFunction<DBAllType>;

        const response = await req
            .get("/api/getProfilePictures").send();

        expect(response.text).toBe("[]"); 
        expect(response.status).toBe(200);
    });
    
    test("500 - database error", async () => {
        db.all = jest.fn((stmt, callback) => {
            // @ts-ignore
            callback(new Error("Error!"), null);
        }) as jest.MockedFunction<DBAllType>;
        
        const response = await req
            .get("/api/getProfilePictures").send();
        
        expect(response.status).toBe(500);
        expect(response.text).toBe("Error: Database error!");
    });

})
