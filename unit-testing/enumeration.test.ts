import { Properties } from "@iac-factory/parameter";

describe( "String Unit Test", () => {
    const $ = Properties;

    it( "Default", async () => {
        expect( $.Base ).toEqual(4)
    } );

    it( "Identifier", async () => {
        expect( $.Extended ).toEqual(5)
    } );
} );
