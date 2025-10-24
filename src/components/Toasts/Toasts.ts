import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export const successToast = (msg: string) =>
  toast(msg || 'Sucesso', {
    theme: 'colored',
    type: 'success',
    transition: 'slide',
    dangerouslyHTMLString: true
  });

export const errorToast = (msg: string) =>
  toast(msg || 'Erro', {
    theme: 'colored',
    type: 'error',
    transition: 'slide',
    dangerouslyHTMLString: true
  });
