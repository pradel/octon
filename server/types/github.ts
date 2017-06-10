export interface GithubRepository {
  id: string;
  name: string;
  url: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
}
