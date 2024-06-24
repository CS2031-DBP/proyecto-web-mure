import Api from '../api';

const api = new Api({ });

export function fetchSongs(page, size) {
    let options = {
        url: `/songs/songs/all?page=${page}&size=${size}`,
    };

    return api.get(options)
        .then(res => {
            return res;
        })
        .catch(error => {
            return error;
        });
}
