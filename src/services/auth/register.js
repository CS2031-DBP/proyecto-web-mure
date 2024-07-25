import Api from "../api";

const api = new Api({});

export async function register(user) {
    let options = {
        url: "/auth/signin",
    };

    try {
        const res = await api.post(user, options);
        return res;
    } catch (error) {
        throw error;
    }
}