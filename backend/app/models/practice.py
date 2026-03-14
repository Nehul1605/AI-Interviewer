from sqlalchemy import String, Integer, ForeignKey, Text, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base
from typing import List
import enum

class PracticeStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class PracticeSession(Base):
    __tablename__ = "practice_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    job_role: Mapped[str] = mapped_column(String)
    resume_url: Mapped[str] = mapped_column(String, nullable=True)
    resume_text: Mapped[str] = mapped_column(Text, nullable=True)
    
    candidate_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    status: Mapped[PracticeStatus] = mapped_column(Enum(PracticeStatus), default=PracticeStatus.PENDING)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    candidate = relationship("User", back_populates="practice_sessions")
    questions = relationship("Question", back_populates="practice_session", cascade="all, delete-orphan")
    resume_data: Mapped[List["ResumeData"]] = relationship("ResumeData", back_populates="practice_session", uselist=False)
    score_report: Mapped["ScoreReport"] = relationship("ScoreReport", back_populates="practice_session", uselist=False)


class ResumeData(Base):
    __tablename__ = "resume_data"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    parsed_json: Mapped[str] = mapped_column(Text) # Storing JSON as string or JSONB depending on DB
    skills: Mapped[str] = mapped_column(Text, nullable=True) # JSON list
    experience: Mapped[str] = mapped_column(Text, nullable=True) # JSON list
    education: Mapped[str] = mapped_column(Text, nullable=True) # JSON list
    
    practice_session_id: Mapped[int] = mapped_column(ForeignKey("practice_sessions.id"))

    # Relationships
    practice_session = relationship("PracticeSession", back_populates="resume_data")
