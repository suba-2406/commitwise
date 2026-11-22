import io
import csv
from fastapi import FastAPI, Request, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import SavedProfile, AnalyticsSnapshot
from schemas import (
    UserProfileResponse,
    RepositoryItem,
    RepositoryCommitsResponse,
    StatisticsResponse,
    LanguagesResponse,
    SavedProfileOut
)
from github import (
    GitHubAPIError,
    get_github_profile,
    get_github_repositories,
    get_repository_commits,
    get_repository_statistics,
    get_github_activity,
    get_github_languages,
    get_github_insights,
    compare_profiles,
)

# Initialize database tables on application start
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CommitWise API",
    description="Backend API for CommitWise – GitHub Activity & Repository Intelligence Dashboard",
    version="1.0.0"
)

# ---------------------------------------------------------------------------
# CORS Configuration: Allows React frontend to communicate smoothly
# ---------------------------------------------------------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Global Exception Handler
# ---------------------------------------------------------------------------
@app.exception_handler(GitHubAPIError)
async def github_api_error_handler(request: Request, exc: GitHubAPIError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


# ---------------------------------------------------------------------------
# 1. Health check endpoint
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
def home():
    return {
        "message": "Welcome to CommitWise API!",
        "status": "Backend is running",
        "version": "1.0.0"
    }


# ---------------------------------------------------------------------------
# 2. GitHub profile endpoint
# ---------------------------------------------------------------------------
@app.get("/github/{username}", response_model=UserProfileResponse, tags=["GitHub"])
def github_profile(username: str):
    profile = get_github_profile(username)

    return {
        "username": profile.get("login"),
        "name": profile.get("name"),
        "bio": profile.get("bio"),
        "avatar_url": profile.get("avatar_url"),
        "followers": profile.get("followers", 0),
        "following": profile.get("following", 0),
        "public_repositories": profile.get("public_repos", 0),
        "public_gists": profile.get("public_gists", 0),
        "location": profile.get("location"),
        "company": profile.get("company"),
        "blog": profile.get("blog"),
        "twitter_username": profile.get("twitter_username"),
        "created_at": profile.get("created_at"),
        "profile_url": profile.get("html_url")
    }


# ---------------------------------------------------------------------------
# 3. GitHub repositories endpoint
# ---------------------------------------------------------------------------
@app.get("/github/{username}/repositories", response_model=list[RepositoryItem], tags=["GitHub"])
def github_repositories(username: str, limit: int = Query(100, ge=1, le=100)):
    repositories = get_github_repositories(username, limit=limit)

    return [
        {
            "name": repo.get("name"),
            "full_name": repo.get("full_name"),
            "description": repo.get("description"),
            "language": repo.get("language"),
            "stars": repo.get("stargazers_count", 0),
            "forks": repo.get("forks_count", 0),
            "open_issues": repo.get("open_issues_count", 0),
            "updated_at": repo.get("updated_at"),
            "created_at": repo.get("created_at"),
            "url": repo.get("html_url"),
            "is_fork": repo.get("fork", False)
        }
        for repo in repositories
    ]


# ---------------------------------------------------------------------------
# 4. Repository commits endpoint
# ---------------------------------------------------------------------------
@app.get("/github/{username}/{repository}/commits", response_model=RepositoryCommitsResponse, tags=["GitHub"])
def repository_commits(username: str, repository: str, limit: int = Query(100, ge=1, le=100)):
    commits = get_repository_commits(username, repository, limit=limit)

    return {
        "username": username,
        "repository": repository,
        "total_commits_fetched": len(commits),
        "commits": [
            {
                "commit_id": item.get("sha"),
                "message": item.get("commit", {}).get("message") if item.get("commit") else None,
                "author": (
                    item.get("commit", {}).get("author", {}).get("name")
                    if item.get("commit") and item.get("commit", {}).get("author")
                    else None
                ),
                "author_avatar": (
                    item.get("author", {}).get("avatar_url")
                    if item.get("author")
                    else None
                ),
                "date": (
                    item.get("commit", {}).get("author", {}).get("date")
                    if item.get("commit") and item.get("commit", {}).get("author")
                    else None
                ),
                "url": item.get("html_url")
            }
            for item in commits
        ]
    }


# ---------------------------------------------------------------------------
# 5. Repository statistics endpoint
# ---------------------------------------------------------------------------
@app.get("/github/{username}/statistics", response_model=StatisticsResponse, tags=["GitHub"])
def repository_statistics(username: str):
    return get_repository_statistics(username)


# ---------------------------------------------------------------------------
# 6. Public activity endpoint
# ---------------------------------------------------------------------------
@app.get("/github/{username}/activity", tags=["GitHub"])
def github_activity(username: str, limit: int = Query(50, ge=1, le=100)):
    return get_github_activity(username, limit=limit)


# ---------------------------------------------------------------------------
# 7. Languages distribution endpoint
# ---------------------------------------------------------------------------
@app.get("/github/{username}/languages", response_model=LanguagesResponse, tags=["GitHub"])
def github_languages(username: str):
    return get_github_languages(username)


# ---------------------------------------------------------------------------
# 8. Developer insights & repository health endpoint
# ---------------------------------------------------------------------------
@app.get("/github/{username}/insights", tags=["GitHub"])
def github_insights(username: str):
    return get_github_insights(username)


# ---------------------------------------------------------------------------
# 9. Profile comparison endpoint
# ---------------------------------------------------------------------------
@app.get("/compare/{username1}/{username2}", tags=["Comparison"])
def compare_two_profiles(username1: str, username2: str):
    return compare_profiles(username1, username2)


# ---------------------------------------------------------------------------
# 10. CSV Report Export endpoint
# ---------------------------------------------------------------------------
@app.get("/github/{username}/export/csv", tags=["Reports"])
def export_repositories_csv(username: str):
    repositories = get_github_repositories(username)
    profile = get_github_profile(username)

    output = io.StringIO()
    writer = csv.writer(output)

    # Header section
    writer.writerow(["CommitWise Developer Report", f"User: {username}"])
    writer.writerow(["Name", profile.get("name") or "N/A"])
    writer.writerow(["Public Repositories", profile.get("public_repos", 0)])
    writer.writerow(["Followers", profile.get("followers", 0)])
    writer.writerow([])

    # Table header
    writer.writerow(["Repository Name", "Language", "Stars", "Forks", "Open Issues", "Updated At", "URL"])

    for r in repositories:
        writer.writerow([
            r.get("name"),
            r.get("language") or "N/A",
            r.get("stargazers_count", 0),
            r.get("forks_count", 0),
            r.get("open_issues_count", 0),
            r.get("updated_at"),
            r.get("html_url")
        ])

    csv_data = output.getvalue()
    output.close()

    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=commitwise_{username}_report.csv"}
    )


# ---------------------------------------------------------------------------
# 11. Saved Profiles / Bookmarks (Database endpoints)
# ---------------------------------------------------------------------------
@app.get("/api/saved-profiles", response_model=list[SavedProfileOut], tags=["Saved Profiles"])
def get_saved_profiles(db: Session = Depends(get_db)):
    return db.query(SavedProfile).order_by(SavedProfile.saved_at.desc()).all()


@app.post("/api/saved-profiles/{username}", response_model=SavedProfileOut, tags=["Saved Profiles"])
def save_profile(username: str, db: Session = Depends(get_db)):
    # Check if already saved
    existing = db.query(SavedProfile).filter(SavedProfile.username.ilike(username)).first()
    if existing:
        return existing

    profile = get_github_profile(username)
    stats = get_repository_statistics(username)

    saved = SavedProfile(
        username=profile.get("login"),
        name=profile.get("name"),
        avatar_url=profile.get("avatar_url"),
        bio=profile.get("bio"),
        public_repos=profile.get("public_repos", 0),
        followers=profile.get("followers", 0),
        total_stars=stats.get("total_stars", 0),
        total_forks=stats.get("total_forks", 0),
        most_used_language=stats.get("most_used_language")
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return saved


@app.delete("/api/saved-profiles/{username}", tags=["Saved Profiles"])
def delete_saved_profile(username: str, db: Session = Depends(get_db)):
    record = db.query(SavedProfile).filter(SavedProfile.username.ilike(username)).first()
    if not record:
        raise HTTPException(status_code=404, detail="Saved profile not found.")
    db.delete(record)
    db.commit()
    return {"message": f"Profile '{username}' deleted from saved profiles."}
