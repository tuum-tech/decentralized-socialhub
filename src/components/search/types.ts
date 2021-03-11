export interface PeopleItem {
  name: string;
  did: string;
  avatar?: string;
}

export interface PeopleDTO {
  items: PeopleItem[];
}

export interface PageItem {
  name: string;
  did?: string;
  avatar?: string;
}

export interface PageDTO {
  items: PageItem[];
}

export interface FollowingItem {
  did: string;
  // followers?: string;
}

export interface FollowingDTO {
  items: FollowingItem[];
}
