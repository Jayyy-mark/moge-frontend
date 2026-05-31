import api from "../helpers/api";
import { helper } from "../helpers/utils";

export const chatApi = {
    async send(data : any):Promise<any>{
        const formData = helper.setChatMessage(data);
        
        const res = await api.post("chat/", formData);
        return res.data;
    },
}