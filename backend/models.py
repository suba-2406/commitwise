from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base


class SavedProfile(Base):
    __tablename__ = "saved_profiles"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    public_repos = Column(Integer, default=0)
    followers = Column(Integer, default=0)
    total_stars = Column(Integer, default=0)
    total_forks = Column(Integer, default=0)
    most_used_language = Column(String(100), nullable=True)
    saved_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AnalyticsSnapshot(Base):
    __tablename__ = "analytics_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), index=True, nullable=False)
    snapshot_data = Column(Text, nullable=False)  # JSON-encoded string
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

