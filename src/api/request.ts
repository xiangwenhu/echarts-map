import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig, } from 'axios'
import { ElMessage } from 'element-plus'
const baseURL: any = import.meta.env.VITE_BASE_URL


const INVALID_TOKEN_CODE_LIST = [401];

const service: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 15000
})
// console.log('import.meta.env', import.meta.env, baseURL);
// 请求前的统一处理
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // JWT鉴权处理
    return config
  },
  (error: AxiosError) => {
    console.log("service", error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    return Promise.resolve(res);
  },
  (error: AxiosError) => {
    const badMessage: any = error.message || error
    const code = parseInt(badMessage.toString().replace('Error: Request failed with status code ', ''))
    showError({ code, message: badMessage })
    return Promise.reject(error)
  }
)

// 错误处理
function showError(res: any) {

  ElMessage({
    message: res.msg || res.message || res.errMsg || '服务异常',
    type: 'error',
    duration: 3 * 1000
  })


}

export const post = <D = any, R = any>(config: AxiosRequestConfig<D> = {}): Promise<R> => {
  return service({
    method: "POST",
    ...config,
  })
}

export const get = <D = any, R = any>(config: AxiosRequestConfig<D> = {}): Promise<R> => {
  return service({
    method: "GET",
    ...config,
  })
}

export default service