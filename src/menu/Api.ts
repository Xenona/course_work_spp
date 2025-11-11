export type BoardInMenu = {
  uuid: string
  setting: string,
  private: boolean,
  name: string
}

export type User = {
  user_id: string
  name: string
  email: string
  password: string
}

export type ApiResult = {
  success: boolean;
  message: string;
};

export type Settings = {
  settings_id: string,
  theme: boolean,
  private: boolean,
  description: string
}
