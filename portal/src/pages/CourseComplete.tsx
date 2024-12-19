import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { Role } from "@/data/roles";
import { Course } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Leaderboard } from "./Leaderboard";
import { useEffect, useState } from "react";
import { CourseOutline } from "@/api/workerGetCourseOutline";
import { workerPostClientLog } from "@/api/workerPostClientLog";

interface CourseCompleteProps {
  role: Role;
  course: Course;
  courseContent: ExtendedCourseOutline[];
  totalDuration: number;
}

interface ExtendedCourseOutline extends CourseOutline {
  questionUserAnswer?: string | null;
  questionScore?: number | null;
  questionFeedback?: string | null;
  questionFeedbackVoiceover?: string | null;
}


export function CourseComplete() {
  const location = useLocation();
  const { role, course, courseContent, totalDuration } = location.state as CourseCompleteProps;
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  if (!role || !course || !courseContent || !totalDuration) {
    return null;
  }

  const averageScore = courseContent.length > 0
    ? Math.round(courseContent.reduce((acc, curr) => acc + (curr.questionScore || 0), 0) / courseContent.length)
    : 0;

  if (showLeaderboard) {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'course_complete_leaderboard_page_load',
      event_data: {
        timestamp: new Date().toISOString(),
        role: role.name,
        course: course.title,
        averageScore,
        questionsAnswered: courseContent.length,
        totalDuration
      }
    }).catch(console.error);
    return <Leaderboard />;
  }

  useEffect(() => {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'course_complete_page_load',
      event_data: {
        timestamp: new Date().toISOString(),
        role: role.name,
        course: course.title,
        averageScore,
        questionsAnswered: courseContent.length,
        totalDuration
      }
    }).catch(console.error);
  }, []);


  return (
    <PageContainer>
      <PageHeader title="Course Completed!" />
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-2">Congratulations, {role.name}!</h2>
            <p className="text-gray-600">You've completed the course:</p>
            <p className="text-xl font-semibold text-gray-800 mt-2">{course.title}</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-blue-700">{averageScore}/5</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Questions Answered</p>
              <p className="text-2xl font-bold text-blue-700">{courseContent.length}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Time Spent</p>
              <p className="text-2xl font-bold text-blue-700">{totalDuration} min</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Score Breakdown</h3>
            <div className="space-y-2">
              {courseContent.map((content, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Question {content.slide}</span>
                  <span className="font-semibold text-blue-700">{content.questionScore}/5</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={() => navigate('/role')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
            >
              Back to Courses
            </Button>
            <Button
              onClick={() => setShowLeaderboard(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
            >
              Show Leaderboard
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
