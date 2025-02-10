import axios, {
  AxiosResponse,
  CancelTokenSource,
} from "axios";

// Crie um tipo de erro personalizado (opcional, mas útil)
class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

const apiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URLBACK,
  withCredentials: true, // MUITO IMPORTANTE! Permite que o Axios envie cookies
});

// Removemos o interceptor de requisição.  Não precisamos mais dele.
// apiBack.interceptors.request.use(...);

apiBack.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);

const isCancel = (error: Error) => axios.isCancel(error);

function getCancelTokenSource(): CancelTokenSource {
  return axios.CancelToken.source();
}

export { apiBack, isCancel, getCancelTokenSource, AuthError };
