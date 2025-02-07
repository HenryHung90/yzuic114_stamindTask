interface ISettingAlertLogAndLoading {
  setAlertLog: (title: string, msg: string) => void;
  handleAlertClose: () => void;
  setLoadingOpen: (open: boolean) => void;
}

export type {ISettingAlertLogAndLoading}