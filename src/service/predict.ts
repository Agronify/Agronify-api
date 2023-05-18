export default class PredictService{
    private path : string;
    private type : string;
    private name : string;

    constructor(type: string, name: string, path: string){
        this.type = type;
        this.name = name;
        this.path = path;
    }

    public async predict(){
        switch (this.type) {
            case "disease":
                return await this.disease();
            case "ripeness":
                return await this.ripeness();
            default:
                return null;
        }
    }

    public async disease(){
        return new Promise((resolve, reject) => {
            const time = Math.floor(Math.random() * 2000) + 1000;
            const result = Math.floor(Math.random() * 100) + 1;
            const confidence = Math.floor(Math.random() * 100) + 1;
            setTimeout(() => {
                resolve({
                    path: this.path,
                    result : result > 50 ? "healthy" : "unhealthy",
                    confidence : confidence,
                    disease : result > 50 ? {} : {
                        name : "Bacterial Blight",
                        description : "lorem ipsum dolor sit amet consectetur adipi scing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                        treatment: "lorem ipsum dolor sit amet consectetur adipi scing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    },
                })
            }, time);
        })
    }

    public async ripeness(){
        return new Promise((resolve, reject) => {
            const time = Math.floor(Math.random() * 2000) + 1000;
            const result = Math.floor(Math.random() * 100) + 1;
            const confidence = Math.floor(Math.random() * 100) + 1;
            setTimeout(() => {
                resolve({
                    path: this.path,
                    result : result < 20 ? "unripe" : result > 80 ? "too ripe" : "ripe",
                    confidence : confidence
                })
            }, time);
        })
    }
}