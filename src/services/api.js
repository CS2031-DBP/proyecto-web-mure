import axios from "axios";

class Api {
    constructor(config) {
        this.basePath = "http://localhost:8080";
    }

    async request(options) {
        let configOptions = {
            ...options,
            baseUrl: this.basePath,
        };

        let path = this.basePath + options.url;

        let headers = {
            "Content-type": "application/json",
        };

        const token = localStorage.getItem("token");
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        let config = {
            ...configOptions,
            headers: headers,
        };

        console.log(config);
        return axios(path, config);
    }

    get(options) {
        let configOptions = {
            ...options,
            method: "get",
        };

        return this.request(configOptions);
    }

    post(data, options) {
        let configOptions = {
            ...options,
            method: "post",
            data: JSON.stringify(data),
        };

        return this.request(configOptions);
    }

    patch(data, options) {
        let configOptions = {
            ...options,
            method: "patch",
            data: JSON.stringify(data),
        };

        return this.request(configOptions);
    }

    put(data, options) {
        let configOptions = {
            ...options,
            method: "put",
            data: JSON.stringify(data),
        };

        return this.request(configOptions);
    }

    delete(options) {
        let configOptions = {
            ...options,
            method: "delete",
        };

        return this.request(configOptions);
    }
}

export default Api;
