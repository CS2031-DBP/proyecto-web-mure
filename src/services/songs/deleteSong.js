import Api from '../api';

const api = new Api({});

export const deleteSong = (id) => {
    return api.delete({ url: `/songs/${id}` });
};
