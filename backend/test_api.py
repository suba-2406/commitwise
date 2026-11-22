from unittest.mock import patch
import sys
import os

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

import main
from github import GitHubAPIError


def test_home_endpoint():
    res = main.home()
    assert res["message"] == "Welcome to CommitWise API!"
    assert res["status"] == "Backend is running"


@patch("main.get_github_profile")
def test_github_profile(mock_profile):
    mock_profile.return_value = {
        "login": "octocat",
        "name": "The Octocat",
        "bio": "GitHub mascot",
        "avatar_url": "https://avatars.githubusercontent.com/u/583231",
        "followers": 9000,
        "following": 10,
        "public_repos": 8,
        "public_gists": 8,
        "location": "San Francisco",
        "company": "GitHub",
        "blog": "https://github.blog",
        "twitter_username": None,
        "created_at": "2011-01-25T18:44:36Z",
        "html_url": "https://github.com/octocat"
    }

    res = main.github_profile("octocat")
    assert res["username"] == "octocat"
    assert res["avatar_url"] == "https://avatars.githubusercontent.com/u/583231"
    assert res["public_repositories"] == 8


@patch("main.get_github_languages")
def test_github_languages(mock_langs):
    mock_langs.return_value = {
        "username": "octocat",
        "total_repositories": 5,
        "repositories_with_language": 4,
        "unique_languages_count": 2,
        "top_language": "Ruby",
        "languages": [
            {"name": "Ruby", "repo_count": 3, "percentage": 75.0},
            {"name": "Python", "repo_count": 1, "percentage": 25.0}
        ]
    }

    res = main.github_languages("octocat")
    assert res["top_language"] == "Ruby"
    assert len(res["languages"]) == 2


@patch("main.get_github_insights")
def test_github_insights(mock_insights):
    mock_insights.return_value = {
        "username": "octocat",
        "health_score": 92,
        "consistency_score": 88,
        "developer_persona": "Community Star",
        "persona_description": "Maintains high-impact open-source projects with strong community adoption.",
        "summary": "octocat has 8 public repositories with a portfolio health score of 92/100.",
        "metrics": {
            "description_coverage_percent": 100.0,
            "license_coverage_percent": 100.0,
            "recent_activity_percent": 80.0,
            "source_ratio_percent": 100.0,
            "total_stars": 5000,
            "unique_languages": 3
        },
        "active_repositories": []
    }

    res = main.github_insights("octocat")
    assert res["health_score"] == 92
    assert res["developer_persona"] == "Community Star"


if __name__ == "__main__":
    test_home_endpoint()
    print("test_home_endpoint passed!")
    test_github_profile()
    print("test_github_profile passed!")
    test_github_languages()
    print("test_github_languages passed!")
    test_github_insights()
    print("test_github_insights passed!")
    print("All backend tests passed successfully!")
