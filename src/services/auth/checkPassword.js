import Api from '../api';

const api = new Api({ });

export async function verifyPassword(data) {
    let options = {
        url: `/auth/verify-password`,
      };

    try {
        const response = await api.post(data, options);
        return response.data;
    } catch (error) {
        throw error;
    }
}