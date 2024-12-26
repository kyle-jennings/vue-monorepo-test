import {
  DialogProgrammatic as Dialog,
  ModalProgrammatic as Modal,
  SnackbarProgrammatic as Snackbar,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from '^@/lib/programmatics';

const transformCallBacks = (opts: DialogOptions) => {
  const obj = {
    ...opts,
    onConfirm: opts.confirmCallback || opts.onConfirm || null,
    onCancel: opts.cancelCallback || opts.onCancel || null,
  };
  return obj;
};

export function displayDialog(dialogOpts: DialogOptions): void {
  Dialog.confirm(transformCallBacks(dialogOpts));
}

export function displayDialogAlert(dialogOpts: DialogOptions): void {
  Dialog.alert(transformCallBacks(dialogOpts));
}

export function displayDialogConfirm(dialogOpts: DialogOptions): Promise<{result: any}> {
  if (dialogOpts.promisable) {
    return Dialog.confirm(transformCallBacks({
      promisable: true,
      ...transformCallBacks(dialogOpts),
    }));
  }
  return Dialog.confirm(transformCallBacks(dialogOpts));
}

export function displayDialogPrompt(dialogOpts: DialogOptions): void {
  Dialog.prompt(transformCallBacks(dialogOpts));
}

export function displayModal(opts: ModalOptions): void {
  Modal.open(transformCallBacks(opts));
}

export function displaySnackbar(snackbarOpts: SnackbarOptions): any {
  if (!snackbarOpts.position) {
    // eslint-disable-next-line no-param-reassign
    snackbarOpts.position = 'is-bottom';
  }
  Snackbar.open(transformCallBacks(snackbarOpts));
}

export function displaySnackbarSuccess(snackbarOpts: SnackbarOptions): any {
  if (!snackbarOpts.position) {
    // eslint-disable-next-line no-param-reassign
    snackbarOpts.position = 'is-bottom';
  }
  // eslint-disable-next-line no-param-reassign
  snackbarOpts.type = 'is-success';
  return Snackbar.open(snackbarOpts);
}

export function displaySnackbarError(snackbarOpts: SnackbarOptions): any {
  const options = {
    position: 'is-bottom',
    type: 'is-danger',
    duration: 5000,
    ...snackbarOpts,
  };

  return Snackbar.open(options);
}

export default {
  displayDialog,
  displayDialogAlert,
  displayDialogConfirm,
  displayDialogPrompt,
  displayModal,
  displaySnackbar,
  displaySnackbarError,
  displaySnackbarSuccess
};
