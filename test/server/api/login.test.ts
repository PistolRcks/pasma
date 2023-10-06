import request from "supertest";
import { app } from "../../../server/main"

const req =

describe("Tests for the /api/login endpoint", () => {
    // Create dummy user 
    // TODO: eventually, this will be in beforeEach
    beforeAll(() => {
        
    });

    beforeEach(() => {
        // TODO: Integration testing with the actual database file
    });

    test("200 - Normal Login", () => {
        
    });

    test("400 - Request malformed", () => {

    });
    
    test("401 - Username doesn't exist", () => {

    });
    
    test("401 - Password isn't valid", () => {

    });
});
