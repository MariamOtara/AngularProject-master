import { HttpInterceptorFn } from '@angular/common/http';


export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
 const apiKey = '6cd5ee8c-6f3c-44e7-bfea-34ecbfc31260';
 const token = localStorage.getItem('token');

  if (req.url.startsWith('https://restaurantapi.stepacademy.ge')) {
   const headers: any = {
      'X-API-KEY': apiKey
    };

    
    if (token && token !== 'undefined' && token !== 'null') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const modifiedReq = req.clone({ setHeaders: headers });
    return next(modifiedReq);
  }

  return next(req);
};
