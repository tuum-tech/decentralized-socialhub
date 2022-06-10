export interface ActivityResponse {
  _status: string;
  get_activity: GetActivity;
}

export interface GetActivity {
  items?: ActivityItem[] | null;
}
