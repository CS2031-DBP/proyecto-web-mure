import Api from '../api';

const api = new Api({});

export async function editProfile(formData) {
    let options = {
        url: '/user/update/me'
    };

    try {
        const res = await api.patchForm(formData, options);
        return res;
    } catch (error) {
        throw error;
    }
}
