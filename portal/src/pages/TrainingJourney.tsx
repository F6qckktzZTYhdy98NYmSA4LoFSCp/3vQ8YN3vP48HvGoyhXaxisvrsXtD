import { useLocation, useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { Role } from "../data/roles";
import { allCourses } from "../data/courses";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Check, ChevronRight, CirclePlay } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { workerPostClientLog } from "@/api/workerPostClientLog";

export const TrainingJourney = () => {
  const navigate = useNavigate();

  const location = useLocation();
  var selectedRole = location.state?.role as Role;

  if (!selectedRole || !selectedRole.name) {
    // set selectedRole to third item in allRoles
    // selectedRole = allRoles.find(role => role.title === 'Production Manager') as Role ?? undefined
    navigate("/role");
    return null;
  }
  
  useEffect(() => {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'training_journey_page_load',
      event_data: {
        timestamp: new Date().toISOString(),
      }
    }).catch(console.error);
  }, []);


  const firstNonCompleteCourseIndex = allCourses.findIndex(
    (course) => !course.IsCompleted
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const handleStartCourse = (course: any) => {
    setSelectedCourse(course);
    setIsOpen(true);
  };

  const handleConfirmDuration = () => {
    setIsOpen(false);
    navigate(`/playground`, {
      state: {
        role: {
          id: selectedRole.id,
          name: selectedRole.name,
          title: selectedRole.title,
          department: selectedRole.department,
        },
        course: {
          slug: selectedCourse.slug,
          title: selectedCourse.title,
          description: selectedCourse.description,
          priority: selectedCourse.priority,
          points: selectedCourse.points,
          IsCompleted: selectedCourse.IsCompleted,
          color: selectedCourse.color,
          duration: selectedDuration,
        },
        duration: selectedDuration,
      },
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${selectedRole.name}`}
        className="bg-transparent"
      ></PageHeader>

      <div className="w-full mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Training Journey Map</h2>
        <div className="relative">
          <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <Accordion
            type="single"
            collapsible
            defaultValue={`item-${firstNonCompleteCourseIndex}`}
          >
            {allCourses.map((course, index) => (
              <AccordionItem key={course.slug} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center w-full">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        course.IsCompleted
                          ? "bg-green-500"
                          : index === firstNonCompleteCourseIndex
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {course.IsCompleted ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : index === firstNonCompleteCourseIndex ? (
                        <CirclePlay className="w-6 h-6 text-white" />
                      ) : (
                        <course.icon
                          className={`w-6 h-6 ${
                            course.IsCompleted
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-grow flex items-center justify-between">
                      <div>
                        <h3
                          className={`text-lg font-semibold text-left ${
                            course.IsCompleted
                              ? "text-green-500"
                              : index === firstNonCompleteCourseIndex
                              ? "text-blue-500"
                              : "text-gray-700"
                          }`}
                        >
                          {course.title}
                        </h3>
                        <div className="flex mt-2 space-x-2">
                          {(course.priority === "required" &&
                            !course.IsCompleted && (
                              <Badge variant="destructive">{course.priority.toLocaleUpperCase()}</Badge>
                            )) ||
                            (course.priority === "high" &&
                              !course.IsCompleted && (
                                <Badge variant="default">{course.priority.toLocaleUpperCase()}</Badge>
                              )) ||
                            (course.priority === "medium" &&
                              !course.IsCompleted && (
                                <Badge variant="default">{course.priority.toLocaleUpperCase()}</Badge>
                              )) ||
                            (course.IsCompleted && (
                              <Badge variant="outline">COMPLETED</Badge>
                            ))}
                          {course.points > 0 && (
                            <Badge
                              variant="outline"
                              className={`${course.IsCompleted && "bg-green-500 text-white"}`}
                            >
                              {course.points} points
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-16 pr-4 pt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      {course.description}
                    </p>
                    {index === firstNonCompleteCourseIndex && (
                      <Button
                        className="w-full mx-4 bg-blue-500 text-white hover:bg-blue-600 z-10"
                        onClick={() => handleStartCourse(course)}
                      >
                        Start Course
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Select Course Duration</DialogTitle>
            <DialogDescription>
              Choose how long you would like to spend on this course.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {[5, 10, 15, 30].map((duration) => (
              <button
                key={duration}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedDuration === duration
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setSelectedDuration(duration)}
              >
                <div className="text-lg font-semibold">{duration}</div>
                <div className="text-sm text-gray-500">minutes</div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button
              onClick={handleConfirmDuration}
              className="bg-blue-500 text-white hover:bg-blue-600 w-full"
            >
              Start Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};
