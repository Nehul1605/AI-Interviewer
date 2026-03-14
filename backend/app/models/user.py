from sqlalchemy import String, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base
import enum
from typing import List

class UserRole(str, enum.Enum):
    HR = "hr"
    CANDIDATE = "candidate"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.CANDIDATE)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    interview_sessions: Mapped[List["InterviewSession"]] = relationship("InterviewSession", back_populates="candidate", foreign_keys="[InterviewSession.candidate_id]")
    owned_interviews: Mapped[List["InterviewSession"]] = relationship("InterviewSession", back_populates="hr", foreign_keys="[InterviewSession.hr_id]")
    practice_sessions: Mapped[List["PracticeSession"]] = relationship("PracticeSession", back_populates="candidate")
