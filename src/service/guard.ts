import { Request, ResponseToolkit } from "@hapi/hapi";
export class GuardUser{
    private h: (request: Request, response: ResponseToolkit) => any;
    constructor(h: (request: Request, response: ResponseToolkit) => any){
        this.h = h;
    }
    public async handler(request: Request, response: ResponseToolkit){
        if(!request.auth.isAuthenticated){
            return response.response({error: "Unauthorized"}).code(401);
        }
        return this.h(request, response);
    }

    public static async guardAdmin(request: Request, response: ResponseToolkit, handler: (request: Request, response: ResponseToolkit) => any){
        if(!request.auth.isAuthenticated){
            return response.response({error: "Unauthorized"}).code(401);
        }
        if(!request.auth.credentials.is_admin){
            return response.response({error: "Forbidden"}).code(403);
        }
        return handler(request, response);
    }
}

export class GuardAdmin{
    private h: (request: Request, response: ResponseToolkit) => any;
    constructor(h: (request: Request, response: ResponseToolkit) => any){
        this.h = h;
    }
    public async handler(request: Request, response: ResponseToolkit){
        if(!request.auth.isAuthenticated){
            return response.response({error: "Unauthorized"}).code(401);
        }
        if(!request.auth.credentials.is_admin){
            return response.response({error: "Forbidden"}).code(403);
        }
        return this.h(request, response);
    }
}