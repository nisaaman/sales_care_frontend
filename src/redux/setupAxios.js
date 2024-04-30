import { showError } from "../app/pages/Alert";
import * as auth from "../app/modules/Auth/_redux/authRedux";

export default function setupAxios(axios, store) {
  // const splashScreen = document.getElementById("splash-screen");

  axios.interceptors.request.use(
    config => {
      // splashScreen.classList.remove("hidden");
      store.dispatch({type: auth.actionTypes.SetLoader, payload: {loaderOpen: true}})
      const {
        auth: { authToken }
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    },
    err => {
      // splashScreen.classList.remove("hidden");
      store.dispatch({type: auth.actionTypes.SetLoader, payload: {loaderOpen: true}})
      Promise.reject(err)
    }
  );

  axios.interceptors.response.use((response) => {
    // splashScreen.classList.add("hidden");
    store.dispatch({type: auth.actionTypes.SetLoader, payload: {loaderOpen: false}})
    if(response.status === 401) {
        showError('You are not authorized');
    }
    return response;
  }, 
  (error) => {
    // splashScreen.classList.add("hidden");
    store.dispatch({type: auth.actionTypes.SetLoader, payload: {loaderOpen: false}})

    if(error.url){
      if(error.url.includes('/login')){
        return;
      }      
    }  

    if(error.message.includes('401') && error.config.headers.Authorization != undefined){
      showError('Session expired! Please login.');
    }else if(error.name === 'Error' && error.config.headers.Authorization != undefined){
      showError(error.message);
    }else if(error.message == undefined){
      showError('Unknown Error!');
    }
    
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
  });
}
