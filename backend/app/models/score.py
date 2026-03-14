from sqlalchemy import String, Integer, ForeignKey, Text, Enum, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base
from typing import List, Optional

class ScoreReport(Base):
    __tablename__ = "score_reports"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    total_score: Mapped[float] = mapped_column(Float)
    technical_score: Mapped[float] = mapped_column(Float)
    communication_score: Mapped[float] = mapped_column(Float)
    behavioral_score: Mapped[float] = mapped_column(Float)
    problem_solving_score: Mapped[float] = mapped_column(Float)
    confidence_score: Mapped[float] = mapped_column(Float)
    
    interview_session_id: Mapped[Optional[int]] = mapped_column(ForeignKey("interview_sessions.id"), nullable=True)
    practice_session_id: Mapped[Optional[int]] = mapped_column(ForeignKey("practice_sessions.id"), nullable=True)

    # Relationships
    interview_session = relationship("InterviewSession", back_populates="score_report")
    practice_session = relationship("PracticeSession", back_populates="score_report")
    dimension_scores: Mapped[List["DimensionScore"]] = relationship("DimensionScore", back_populates="report", cascade="all, delete-orphan")


class DimensionScore(Base):
    __tablename__ = "dimension_scores"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    dimension: Mapped[str] = mapped_column(String) # e.g. "React", "System Design"
    score: Mapped[float] = mapped_column(Float)
    feedback: Mapped[str] = mapped_column(Text)
    
    report_id: Mapped[int] = mapped_column(ForeignKey("score_reports.id"))

    # Relationships
    report = relationship("ScoreReport", back_populates="dimension_scores")
