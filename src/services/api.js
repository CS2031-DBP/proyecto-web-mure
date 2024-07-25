import axios from "axios";

class Api {
  constructor(config) {
    this.basePath = "http://localhost:8080";
  }

  async request(options) {
    let configOptions = {
      ...options,
      baseURL: this.basePath,
    };

    let headers = {
      ...configOptions.headers,
    };

    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let config = {
      ...configOptions,
      headers: headers,
    };

    return axios(config);
  }

  get(options) {
    return this.request({ ...options, method: "get" });
  }

  post(data, options) {
    return this.request({ ...options, method: "post", data });
  }

  postForm(data, options) {
    return this.post(data, {
      ...options,
      headers: {},
    });
  }

  patch(data, options) {
    return this.request({
      ...options,
      method: "patch",
      data,
      headers: {},
    });
  }

  patchForm(data, options) {
    return this.patch(data, {
      ...options,
      headers: {},
    });
  }

  put(data, options) {
    return this.request({
      ...options,
      method: "put",
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  delete(options) {
    return this.request({ ...options, method: "delete" });
  }
}

export default Api;
