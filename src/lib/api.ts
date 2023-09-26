import Axios from 'axios';
import {mapKey} from '@env';

const axios = Axios.create({
  // baseURL: 'https://innovatedbusinessmarketing.com/Green/api',
  baseURL: 'https://audiome.ca/app/api',

  headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
});

const authorizedHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: '',
};

const SignupWithPhone = async payload => {
  const request = '/phonenumber';
  return axios
    .post(request, payload)
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};

const registerUser = async (payload: any) => {
  try {
    const request = '/register';
    const response = await axios.post(request, payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    const {data, status} = response;
    return status === 200 || status === 201 ? data : null;
  } catch (error) {
    throw error;
  }
};

const VerifyCode = async payload => {
  const request = '/verify';
  return axios
    .post(request, payload)
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};

const HomePosts = async (payload: string) => {
  const request = `/home`;
  authorizedHeaders.Authorization = `Bearer ${payload}`;
  return axios
    .get(request, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};
const popularTours = async (payload: {id: number; token: string}) => {
  const request = `/tour/${payload.id}`;
  console.log('payload', payload);
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .get(request, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};

const searchTours = async (payload: {token: string}) => {
  const request = `/tour-search`;
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .get(request, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};

const getPlaces = async (payload: {token: string}) => {
  const request = `/places/${payload.Id}`;
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .get(request, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};

const myToursList = async (payload: {token: string}) => {
  const request = `/purchased-tour-list`;
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .get(request, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};

const getCitiesList = async () => {
  const request = `/cities`;

  return axios
    .get(request, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};

const loginUser = async (payload: any) => {
  try {
    const request = '/login';
    const response = await axios.post(request, payload);
    const {data, status} = response;
    return status === 200 || status === 201 ? data : null;
  } catch (error) {
    throw error;
  }
};

const LoginWithPhone = payload => {
  const request = '/login';
  return axios
    .post(request, payload)
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {});
};

const userLogout = async (payload: string) => {
  const url = '/logout';
  authorizedHeaders.Authorization = `Bearer ${payload}`;
  try {
    const response = await axios.get(url, {
      headers: authorizedHeaders,
    });
    const {data, status} = response;
    return status === 200 || status === 201 ? data : null;
  } catch (error) {
    throw error;
  }
};

const getTwitterUser = async (payload: string) => {
  const url = `https://api.twitter.com/1.1/users/show.json?user_id=${payload}`;
  authorizedHeaders.Authorization =
    'Bearer AAAAAAAAAAAAAAAAAAAAAKZ5WgEAAAAAdryjlyP%2BQKlAxvAzS0kZp4EdcYs%3DyAaQuviDBxyhKCPMsngBztScMKxd3sIdhJpjFAfJpYrut6Ewtg';
  try {
    const response = await axios.get(url, {
      headers: authorizedHeaders,
    });
    const {data, status} = response;
    return status === 200 || status === 201 ? data : null;
  } catch (error) {
    throw error;
  }
};

const LikePost = payload => {
  const request = '/post/like';
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .post(request, payload.data, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};
const deleteAccount = payload => {
  console.log('payload of delete', payload);
  const request = '/delete-account';
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .post(request, payload, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};
const downloadTour = payload => {
  console.log('payload of download', payload);
  const request = '/download-tour';
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .post(request, payload, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};
const checkTour = payload => {
  console.log('payload of download', payload);
  const request = '/get-download-tour';
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .post(request, payload, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};
const PostSearchByCity = async (payload: {city: string; Auth: string}) => {
  const request = `/searchData/${payload.city}`;
  authorizedHeaders.Authorization = `Bearer ${payload.Auth}`;
  return axios
    .get(request, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};

const UpdateLatLong = async (payload: {data: FormData; token: string}) => {
  const request = '/path';
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .post(request, payload.data, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};

const MapViewSearch = payload => {
  const request = '/categoryData';
  authorizedHeaders.Authorization = `Bearer ${payload.Auth}`;
  return axios
    .post(request, payload, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {});
};

const seeAllToursList = async (payload: {
  key: string;
  token: string;
  cityId: number;
}) => {
  const request = `/list/${payload.key}/${payload.cityId}`;
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .get(request, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};

const searchFilterTours = async (payload: {data: FormData; token: string}) => {
  const request = `/combine`;
  console.log('payload of combine', JSON.stringify(payload));
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .post(request, payload.data, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      // Axios.isAxiosError(e)

      throw e;
    });
};

const editProfile = async (payload: {data: FormData; token: string}) => {
  const request = `/update`;
  authorizedHeaders.Authorization = `Bearer ${payload.token}`;
  return axios
    .post(request, payload.data, {headers: authorizedHeaders})
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};

const myLikedToursList = async (payload: string) => {
  const url = '/tour/likelist';
  authorizedHeaders.Authorization = `Bearer ${payload}`;
  try {
    const response = await axios.get(url, {
      headers: authorizedHeaders,
    });
    const {data, status} = response;
    return status === 200 || status === 201 ? data : null;
  } catch (error) {
    throw error;
  }
};

const getToursList = async () => {
  const request = '/tourlist';
  return axios
    .get(request)
    .then(({data, status}) => {
      return status === 200 || status === 201 ? data : null;
    })
    .catch(e => {
      throw e;
    });
};
const getCityName = async (payload: any) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${payload.lat},${payload.long}&key=${mapKey}`;

  try {
    const response = await Axios.get(url);
    const {data, status} = response;
    return status === 200 || status === 201 ? data : null;
  } catch (error) {
    throw error;
  }
};

const getNearistSpot = async (payload: {token: string; data: FormData}) => {
  // console.log('payload going for modal', JSON.stringify(payload));
  const url = '/nearest-spot';
  try {
    const response = await axios.post(url, payload.data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${payload.token}`,
      },
    });
    const {data, status} = response;
    return status === 200 || status === 201 ? data : null;
  } catch (error) {
    throw error;
  }
};

const createPaymentIntent = async (payload: {
  data: FormData;
  token: string;
}) => {
  const requrest = `/payment`;
  try {
    const response = await axios.post(requrest, payload.data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${payload.token}`,
      },
    });
    const {data, status} = response;
    return status === 200 || status === 201 ? data : null;
  } catch (err) {
    throw err;
  }
};

const confirmPayment = async (payload: {data: FormData; token: string}) => {
  const requrest = `/create-payment`;
  try {
    const response = await axios.post(requrest, payload.data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${payload.token}`,
      },
    });
    const {data, status} = response;
    return status === 200 || status === 201 ? data : null;
  } catch (err) {
    throw err;
  }
};

export {
  registerUser,
  loginUser,
  SignupWithPhone,
  VerifyCode,
  HomePosts,
  LoginWithPhone,
  LikePost,
  PostSearchByCity,
  UpdateLatLong,
  MapViewSearch,
  seeAllToursList,
  searchFilterTours,
  editProfile,
  userLogout,
  myLikedToursList,
  getTwitterUser,
  getCityName,
  getCitiesList,
  popularTours,
  searchTours,
  getNearistSpot,
  createPaymentIntent,
  downloadTour,
  checkTour,
  confirmPayment,
  myToursList,
  getToursList,
  getPlaces,
  deleteAccount,
};
