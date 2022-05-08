import { Title, Case } from "./train-case.js";

/***
 * Type Enumeration
 * ---
 *
 * @public
 *
 * @property Directory {string} - Directory type
 * @property Train {string} - Screaming-Train-Case string
 * @property Dash {string} - Train-Case string
 *
 */

enum Type {
    /// Directory type
    Directory = "Directory",
    /// Screaming-Train-Case string
    Train = "Screaming-Train-Case",
    /// Train-Case string
    Dash = "Train-Case"
}

/***
 * Properties Enumeration
 * ---
 *
 * A simple enumeration that aliases the property `Base` to a constant
 * numerical value of `4`, and another `Extended`, which evaluates out to
 * a constant numerical value of `5`.
 *
 * These assignments are fairly arbitrary, and only aim to provide aliasing
 * to numerical values in certain cloud-related usage & context.
 *
 * @property {number} Service
 * @property {number} Identifier
 * @property {number} Parameter
 *
 */

enum Properties {
    /***
     * The number of properties used to describe a default, or base
     * parameter type. Typically, these parameters include references to:
     * - Organization or business unit
     * - Environment
     * - Service
     * - A Resource-related identifier or name
     *
     * @type {Properties.Base}
     *
     */
    Base = 4,
    /***
     * The number of properties used to describe an extended parameter type.
     * Typically, these parameters include references to:
     * - Organization or business unit
     * - Environment
     * - Application
     * - Service
     * - A Resource-related identifier or name
     *
     * @type {Properties.Extended}
     *
     */
    Extended = 5
}

type Selectable = keyof typeof Properties;

/***
 * *A Zero-Dependency Type-Interface via Node.js*
 *
 * Parameters often used during configuration can be a
 * difficult concept to standardize.
 *
 * `@iac-factory/parameter` aims to strictly define
 * a naming and constructor convention to ease efforts associated
 * with configuration, while allowing for an easy inheritance
 * pattern to further extend from; examples of applicable
 * extensions include usages with:
 *
 * - `etcd`
 * - Hashicorp's `vault`
 * - AWS Secure Systems Manager
 * - AWS Secrets Manager
 * - Microsoft Cloud Vault
 * - GCP Credential Management
 *
 * Please keep in mind that the **`*.service`** attribute, while a possible
 * subtype, is more or less arbitrary as to what it's describing. Rather, the
 * `Parameter.service` dot-product should be thought as a *service*,
 * *resource*, or *identifier*.
 *
 */

class Parameter implements Options {
    /***
     * organization - Target Deliverable Maintainer
     *
     * @type {string}
     *
     */

    organization: string;

    /***
     * environment - Network (L2) Seperated Alias
     *
     * @type {string}
     *
     */

    environment: string;

    /***
     * application - Stack, Functional Purpose, or Common-Name
     *
     * @type {string | undefined}
     *
     */

    application?: string | undefined;

    /***
     * service - Descriptive Identifier Key-Word, typically used to describe:
     *     - A Cloud Resource
     *     - A Service
     *
     * @type {string}
     *
     */

    service: string;

    /***
     * identifier - Additional, Optional String
     *
     * @type {string}
     *
     */

    identifier: string;

    /***
     *
     * |             Key             |   Requirement  |                Description                |           Example(s)            |
     * |:---------------------------:|:--------------:|:-----------------------------------------:|:-------------------------------:|
     * |        **Organization**     |   *Required*   |                    ...                    |              `IBM`              |
     * |         **Environment**     |   *Required*   |       Network (L2) Seperated Alias        |    `Development`, `Production`  |
     * |        **Application**      |   *Optional*   | Stack, Functional Purpose, or Common-Name |    `Financial-Audit-Service`    |
     * |          **Service**        |   *Optional*   | Distributed System, Infrastructure, or ID | `Mongo-DB`, `S3`, `Credentials` |
     * |        **Identifier**       |   *Optional*   |        Additional, Optional String        |      `VPC-ID`, `Private-Key`    |
     *
     * @param {Options} options - Constructor parameters type
     *
     */

    constructor( options: Options ) {
        this.organization = options.organization;
        this.environment = options.environment;
        this.application = options?.application;
        this.service = options.service;
        this.identifier = options.identifier;

        if ( !options?.application ) delete this.application;
    }

    /***
     * Format the Parameter Type into a Hashable Object
     *
     * @public
     * @summary Useful for attributing input for other Parameter constructor(s)
     * @constructor
     *
     * @returns {Options}
     *
     */

    public format(): Options {
        return this;
    }

    /***
     * Construct a string, first joining an array for the initialized attributes,
     * according to either a `"Directory"`, `"Train-Case"`, or `"Screaming-Train-Case"`
     * string convention.
     *
     * Note that only the following string-constants are allowed as `type`:
     *
     * - "Directory"
     * - "Screaming-Train-Case"
     * - "Train-Case"
     *
     * `"Directory"` is defaulted.
     *
     * Additionally, using train-case generated strings should be very selectively used; for example, if
     * a user is defining a large abstract representation of constructs, such as an AWS Cloudformation Stack,
     * then can Train-Case be used for the Stack name. When using Train-Case, most functionality is forgone
     * as arbitrary number of dash-separated words cannot be assumed to derive categorical attributes.
     *
     * @constructor
     *
     * @param type {"Directory" | "Screaming-Train-Case" | "Train-Case"}
     *
     * @param prefix {"/" | undefined }
     *
     * @return {String}
     *
     */

    public string( type: Type | string = Type.Directory, prefix?: "/" ): string {
        const keys: string[] = [];

        Object.keys( this ).forEach( ( $ ) => {
            const value = Reflect.get( this, $ );
            if ( value !== undefined ) keys.push( value );
        } );

        const property = keys.join( ( type === "Directory" )
            ? "/" : ( type === "Screaming-Train-Case" )
                ? "-" : "/"
        );

        /***
         * String cast to user-defined convention of one of the following:
         * - Directory = "Directory",
         * - Train = "Screaming-Train-Case",
         * - Dash = "Train-Case"
         *
         * @type {string}
         */
        const cast: string = Case( property, { condense: true } );

        /*** Return a potentially titled string, capitalizing according to type */
        const $ = ( type === "Screaming-Train-Case" ) ? Title( cast )
            : ( type === "Train-Case" ) ? cast
                : property;

        return ( prefix ) ? prefix + $ : $;
    }

    /***
     * Enumeration Evaluation
     * ---
     *
     * @private
     *
     * @returns {Properties}
     *
     */

    public enumerations(): Properties {
        return this.string( Type.Directory ).split( "/" ).length;
    }

    /***
     * String -> Parameter Initializer
     * ---
     *
     * Note that only `Directory` types can be instantiated from any given string,
     * and only a full 5-attribute Parameter type is compatible.
     *
     * The intention behind the following utility, static method is to create a new `Parameter`
     * type via an assumed compatible string.
     *
     * For example, if an AWS SSM Parameter was attributed its name via "organization/environment/application/resource/identifier"
     * naming convention, it can be safely assumed that `Parameter.instantiate` will then create a new serialized Parameter object.
     * Such can be useful when filtering or serializing a long list of configuration parameters. On perhaps a more theoretical
     * level, deriving a file-system-like object from a simple string can be thought of as a B++ Tree:
     *
     *      > The primary value of a B+ tree is in storing data for efficient retrieval in a block-oriented storage
     *      > context — in particular, filesystems. This is primarily because unlike binary search trees, B+ trees have very
     *      > high fanout (number of pointers to child nodes in a node typically on the order of 100 or more), which reduces the
     *      > number of I/O operations required to find an element in the tree.
     *
     * Clouds can include millions of parameters that define infrastructure or application configuration -- using a common convention via
     * a globally unique string facilitates filtering, serialization, interfacing, and human readability.
     *
     * @example
     * /// An "Extended" Parameter Type
     * const parameter = Parameter.instantiate("organization/environment/application/service/identifier");
     *
     * console.log(parameter.organization);
     * console.log(parameter.environment);
     * ...
     *
     * console.log(parameter);
     *
     * >>> // Identifier Parameter {
     * >>> //     organization: 'organization',
     * >>> //     environment: 'environment',
     * >>> //     application: 'application',
     * >>> //     service: 'service',
     * >>> //     identifier: 'identifier'
     * >>> // }
     *
     * @example
     * /// A "Base" (No Application) Parameter Type
     * const parameter = Parameter.instantiate("organization/environment/service/identifier");
     *
     * console.log(parameter.organization);
     * console.log(parameter.environment);
     * ...
     *
     * console.log(parameter);
     *
     * >>> // Identifier Parameter {
     * >>> //     organization: 'organization',
     * >>> //     environment: 'environment',
     * >>> //     service: 'service',
     * >>> //     identifier: 'identifier'
     * >>> // }
     *
     * @param {string} value
     * @param {boolean} debug
     *
     * @return {Parameter}
     *
     */

    public static initialize( value: string, debug: boolean = false ): Parameter {
        const prefix = ( value[0] === "/" ) ? "/" : "";

        if ( prefix ) value = value.slice( 1 );

        const split = value.split( "/" );

        ( debug ) && console.debug( "[Debug]", "Properties" + ":", split );

        const enumerable = () => {
            switch ( split.length ) {
                case Properties.Base:
                    /// Omission of Application
                    return new Parameter( {
                        organization: split[0],
                        environment: split[1],
                        service: split[2],
                        identifier: split[3]
                    } );
                case Properties.Extended:
                    return new Parameter( {
                        organization: split[0],
                        environment: split[1],
                        application: split[2],
                        service: split[3],
                        identifier: split[4]
                    } );
                default:
                    const $ = new Error( "Parameter-Enumeration-Error" );

                    $.name = "Parameter-Enumeration-Error";
                    $.message = "\n";

                    $.message += "Invalid Number of \"/\" Separated Attributes" + "\n";
                    $.message += "  - Service Example: \"Organization/Environment/Service/Identifier\"" + "\n";
                    $.message += "  - Application Example: \"Organization/Environment/Application/Service/Identifier\"" + "\n";

                    throw $;
            }
        };

        const evaluation = enumerable();

        const valid = ( evaluation ) && true || false;

        ( debug ) && console.debug( "[Debug]", "Enumerable" + ":", valid, evaluation );

        return evaluation;
    }
}

interface Options {
    /***
     * organization - Target Deliverable Maintainer
     *
     * @type {string}
     *
     */

    organization: string;

    /***
     * environment - Network (L2) Seperated Alias
     *
     * @type {string}
     *
     */

    environment: string;

    /***
     * application - Stack, Functional Purpose, or Common-Name
     *
     * @type {string | undefined}
     *
     */

    application?: string | undefined;

    /***
     * service - Descriptive Identifier Key-Word, typically used to describe:
     *     - A Cloud Resource
     *     - A Service
     *
     * @type {string}
     *
     */

    service: string;

    /***
     * identifier - Additional, Optional String
     *
     * @type {string}
     *
     */

    identifier: string;
}

export type { Options };

export { Parameter, Type, Properties };

export default { Parameter };
