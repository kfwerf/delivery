import {execPath} from "../binaries";

export default class GrpCurlCommand {
    private _template: string = '{execPath} -plaintext -max-time 5 {params}';
    private _params: string = '';
    private _execPath: string = '/grpcurl';

    private constructor(template: string = '{execPath} -plaintext -max-time 5 {params}',
                        params: string = '',
                        execPath: string = '/grpcurl') {
        this._template = template;
        this._params = params;
        this._execPath = execPath;
        return this;
    }

    public static fromTemplate(template: string = '{execPath} -plaintext -max-time 5 {params}'): GrpCurlCommand {
        return new GrpCurlCommand(template);
    }

    public setExecPath(execPath: string = '/grpcurl'): GrpCurlCommand {
        return new GrpCurlCommand(this.getTemplate(), this.getParams(), execPath);
    }

    public setTemplate(template: string = '{execPath} -plaintext -max-time 5 {params}'): GrpCurlCommand {
        return new GrpCurlCommand(template, this.getParams(), this.getExecPath());
    }

    public setParams(params: string = ''): GrpCurlCommand {
        return new GrpCurlCommand(this.getTemplate(), params, this.getExecPath());
    }

    public getExecPath(): string {
        return this._execPath;
    }

    public getParams(): string {
        return this._params;
    }

    public getTemplate(): string {
        return this._template;
    }

    public toString(): string {
        return this._template
            .replace(/{execPath}/gi, this._execPath)
            .replace(/{params}/gi, this._params);
    }
}


export const bodyParams = (body: string, url: string, method: string) => `-d '${body}' ${url} ${method}`;
export const emptyParams = (url: string, method: string) => `${url} ${method}`;

export const defaultCommand = GrpCurlCommand
    .fromTemplate('{execPath} -plaintext -max-time 5 {params}')
    .setExecPath(execPath);