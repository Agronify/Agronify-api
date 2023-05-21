import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";

export class GuardService{
    constructor(private h: (request: Request, response: ResponseToolkit) => Promise<any>, private role: string){
        this.h = this.h.bind(this);
        this.handler = this.handler.bind(this);
        this.User = this.User.bind(this);
        this.Admin = this.Admin.bind(this);
    }
    
    public async handler(request: Request, response: ResponseToolkit){
        switch(this.role){
            case "User":
                return this.User(request, response);
            case "Admin":
                return this.Admin(request, response);
            default:
                return response.response({error: "Not implemented"}).code(501);
        }
    }

    public async User(request: Request, response: ResponseToolkit){
        if(!request.auth.isAuthenticated){
            return response.response({error: "Unauthorized"}).code(401);
        }
        return this.h(request, response);
    }

    public async Admin(request: Request, response: ResponseToolkit){
        if(!request.auth.isAuthenticated){
            return response.response({error: "Unauthorized"}).code(401);
        }
        if(!request.auth.credentials.is_admin){
            return response.response({error: "Forbidden"}).code(403);
        }
        return this.h(request, response);
    }
}