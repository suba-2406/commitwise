from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class UserProfileResponse(BaseModel):
    username: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    followers: int = 0
    following: int = 0
    public_repositories: int = 0
    public_gists: int = 0
    location: Optional[str] = None
    company: Optional[str] = None
    blog: Optional[str] = None
    twitter_username: Optional[str] = None
    created_at: Optional[str] = None
    profile_url: Optional[str] = None
    is_mock: bool = False


class RepositoryItem(BaseModel):
    name: str
    full_name: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    stars: int = 0
    forks: int = 0
    open_issues: int = 0
    updated_at: Optional[str] = None
    created_at: Optional[str] = None
    url: str
    is_fork: bool = False


class CommitItem(BaseModel):
    commit_id: Optional[str] = None
    message: Optional[str] = None
    author: Optional[str] = None
    author_avatar: Optional[str] = None
    date: Optional[str] = None
    url: Optional[str] = None


class RepositoryCommitsResponse(BaseModel):
    username: str
    repository: str
    total_commits_fetched: int
    commits: List[CommitItem]
    is_mock: bool = False


class StatisticsResponse(BaseModel):
    username: str
    total_repositories: int
    total_stars: int
    total_forks: int
    total_open_issues: int
    source_repositories: int
    forked_repositories: int
    most_used_language: Optional[str] = None
    language_distribution: Dict[str, int]
    is_mock: bool = False


class LanguageItem(BaseModel):
    name: str
    repo_count: int
    percentage: float


class LanguagesResponse(BaseModel):
    username: str
    total_repositories: int
    repositories_with_language: int
    unique_languages_count: int
    top_language: Optional[str] = None
    languages: List[LanguageItem]
    is_mock: bool = False


class SavedProfileOut(BaseModel):
    id: int
    username: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    public_repos: int = 0
    followers: int = 0
    total_stars: int = 0
    total_forks: int = 0
    most_used_language: Optional[str] = None
    saved_at: Any

    class Config:
        from_attributes = True
