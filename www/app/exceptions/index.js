export class NotImplementedException extends Error {
    constructor(args) {
        super();
        this.message = 'Not Implemented';
    }
}