import Toast from 'react-native-toast-message';
import { notifySuccess, notifyError } from './haptics';

export function showSuccess(message: string, title = 'Sucesso') {
  void notifySuccess();
  Toast.show({ type: 'success', text1: title, text2: message, visibilityTime: 3000 });
}

export function showError(message: string, title = 'Erro') {
  void notifyError();
  Toast.show({ type: 'error', text1: title, text2: message, visibilityTime: 4000 });
}

export function showInfo(message: string, title = 'Info') {
  Toast.show({ type: 'info', text1: title, text2: message, visibilityTime: 3000 });
}
