export interface User {
  id: string;
  auth0UserId: string;
  email: string;
  username: string;
  avatar: string;
  lastGithubSyncAt?: Date;
  repositories: Repository[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Repository {
  id?: string;
  name: string;
  avatar: string;
  htmlUrl: string;
  type: string;
  refId: string;
  users?: User[];
  releases?: Release[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Release {
  id?: string;
  tagName: string;
  htmlUrl: string;
  type: string;
  publishedAt: Date;
  repository?: Repository;
  refId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
