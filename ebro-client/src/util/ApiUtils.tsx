import {API_BASE_URL} from "../constants";


const request = (options: any) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    // if (localStorage.getItem(ACCESS_TOKEN)) {
    //     headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    // }

    const defaults = {headers};
    // const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

const multipartRequest = (options: any) => {
    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );

};

export function uploadSingleFile(file: any) {
    return multipartRequest({
        url: API_BASE_URL + "/uploadFile",
        method: 'POST',
        body: file
    });
}

export function getAllImages() {
    return request({
        url: API_BASE_URL + "/images",
        method: 'GET'
    })
}

// export function fileProcess(fileProcessRequest: any) {
//     return request({
//         url: API_BASE_URL + "/process",
//         method: 'POST',
//         body: JSON.stringify(fileProcessRequest)
//     });
// }


export function filePixelate(pixelateRequest: any) {
    return request({
        url: API_BASE_URL + "/pixelate",
        method: 'POST',
        body: JSON.stringify(pixelateRequest)
    })

}


















