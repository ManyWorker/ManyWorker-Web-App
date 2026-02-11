export class BroadcastRequest {
    asunto: string;
    cuerpo: string;

    constructor(asunto: string = '', cuerpo: string = '') {
        this.asunto = asunto;
        this.cuerpo = cuerpo;
    }
}