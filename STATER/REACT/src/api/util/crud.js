import { get, post, put, del, getQueryString } from './utils';

const PREFIX = '/api/offline';

export async function getAllDataApi(resource, query = '', customURL) {
  return get(`${PREFIX}/${resource}${query}`, null, customURL);
}

export async function getDataByIdApi(resource, id, query, customURL) {
  return get(`${PREFIX}/${resource}${id ? `/${id}` : ''}`, null, customURL);
}

export async function deleteDataApi(resource, customURL) {
  return del(`${PREFIX}/${resource}`, null, customURL);
}

export async function deleteDataByIdApi(resource, id, customURL) {
  return del(`${PREFIX}/${resource}${id ? `/${id}` : ''}`, null, customURL);
}

export async function postDataApi(resource, data, customURL) {
  return post(`${PREFIX}/${resource}`, data, customURL);
}

export async function putDataApi(resource, id, data, customURL) {
  return put(`${PREFIX}/${resource}${id ? `/${id}` : ''}`, data, customURL);
}

export async function exportExcelApi(resource, data, customURL) {
  return get(`${PREFIX}/${resource}/exportExcel`, data, customURL);
}

export const uploadPhoto = async request => {
  try {
    const data = new FormData();
    data.append('file', request.file);
    const response = await post(
      '/admin/logo',
      data,
      'https://upload.cashbagmain.com',
    );
    request.onSuccess(response.data);
  } catch (error) {
    request.onError(error);
  }
};

export const exportExcel = (resource, query) => {
  const request = new XMLHttpRequest();
  request.open(
    'GET',
    `${
      process.env.REACT_APP_SERVER_URL
    }api/v1/${resource}/exportExcel?${getQueryString(query)}`,
  );
  request.setRequestHeader(
    'Authorization',
    localStorage.getItem('sessionToken'),
  );
  request.responseType = 'arraybuffer';
  request.onload = () => {
    if (request.status === 200) {
      // Try to find out the filename from the content disposition `filename` value
      const disposition = request.getResponseHeader('Content-Disposition');
      const matches = disposition.substring(
        disposition.indexOf('filename=') + 9,
        disposition.length,
      );
      const filename =
        matches != null && matches !== '' ? matches : `${resource}.xlsx`;
      // The actual download
      const blob = new Blob([request.response], {
        type: request.getResponseHeader('content-type'),
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  request.send();
};
