import {
  CourseOutlineInput,
  CourseOutline,
  workerGetCourseOutline,
} from "@/api/workerGetCourseOutline";
import { LoaderFill } from "@/components/animations/Loader";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { allCourses, Course } from "@/data/courses";
import { allRoles, Role } from "@/data/roles";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import { Progress } from "@/components/ui/progress";
import { workerGetTTS } from "@/api/workerGetTTS";
import { PresenterAvatarAudioWave } from "@/components/presenter_avatar_audio/presenter_avatar_audio";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquareText, Mic, StopCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  CoursePageInput,
  workerGetCoursePage,
} from "@/api/workerGetCoursePage";
import { useFeedback } from "@/contexts/FeedbackContext";
import { workerGetSTT } from "@/api/workerGetSTT";
import { workerGetCourseScore } from "@/api/workerGetCourseScore";
import { workerPostClientLog } from "@/api/workerPostClientLog";

interface PlaygroundInputs {
  role: Role;
  course: Course;
  duration: number;
}

interface ExtendedCourseOutline extends CourseOutline {
  questionUserAnswer?: string | null;
  questionScore?: number | null;
  questionFeedback?: string | null;
  questionFeedbackVoiceover?: string | null;
  hasSampleEmail?: boolean;
}

interface SlideOutline {
  number: number;
  title: string;
  objective: string;
  duration: number;
}

export function Playground() {
  const location = useLocation();
  const navigate = useNavigate();
  const inputSelectedRole = location.state?.role as Role;
  const inputSelectedCourse = location.state?.course as Course;
  const inputSelectedDuration = Number(location.state?.duration) || 0;
  const [input, setInput] = useState<PlaygroundInputs | null>(null);
  const [currentSlideNumber, setCurrentSlideNumber] = useState(1);
  var [slideContents, setSlideContents] = useState<ExtendedCourseOutline[]>([]);
  var [currentSlideContent, setCurrentSlideContent] = useState<any | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextEnabled, setNextEnabled] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [audioIsPlaying, setAudioIsPlaying] = useState(false);
  const { toast } = useToast();
  const [slideOutline, setSlideOutline] = useState<SlideOutline[]>([]);
  const { setFeedbackParams } = useFeedback();

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isVoiceAnswer, setIsVoiceAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<{
    score: number;
    feedback: string;
    voiceover: string;
  } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("");
  const [showTranscription, setShowTranscription] = useState(false);
  const [result, setResult] = useState<{
    question: string;
    answer: string;
  } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleTextAnswer = () => {
    setIsAnswering(true);
    setIsVoiceAnswer(false);
  };

  const handleVoiceAnswer = () => {
    setIsAnswering(true);
    setIsVoiceAnswer(true);
  };

  useEffect(() => {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'playground_page_load',
      event_data: {
        timestamp: new Date().toISOString(),
        role: inputSelectedRole.name,
        course: inputSelectedCourse.title,
        duration: inputSelectedDuration
      }
    }).catch(console.error);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      await new Audio('/sounds/bell.mp3').play();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordingStatus("Transcribing...");
        try {
          const transcription = await workerGetSTT({ audioBlob });
          setUserAnswer(transcription);
          setRecordingStatus("");
          setShowTranscription(true);
        } catch (error) {
          console.error("Error transcribing:", error);
          setRecordingStatus("Error transcribing audio");
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStatus("Recording...");
    } catch (error) {
      console.error("Error starting recording:", error);
      setRecordingStatus("Error accessing microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmitAnswer = async () => {
    setIsSubmitting(true);
    try {
      const response = await workerGetCourseScore({
        question: result?.question || "",
        answer: result?.answer || "",
        userAnswer: userAnswer,
      });
      setScore(response);
      setShowResults(true);

      const audioScore = await workerGetTTS({
        voiceover: response.voiceover
      });
      setAudioUrl(audioScore);
    } catch (error) {
      console.error("Error scoring answer:", error);
    }
    setIsSubmitting(false);
  };

  const handleAccept = () => {
    const currentContent: ExtendedCourseOutline = {
      ...currentSlideContent!,
      questionUserAnswer: userAnswer,
      questionScore: score?.score || 0,
      questionFeedback: score?.feedback || "",
      questionFeedbackVoiceover: score?.voiceover || "",
    };

    setSlideContents((prev) => {
      const updatedContents = [...prev, currentContent];
      
      if (currentContent && currentContent.progress >= 100) {
        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          navigate("/course-complete", {
            state: {
              role: inputSelectedRole,
              course: inputSelectedCourse,
              courseContent: updatedContents, // Use the updated contents
              totalDuration: inputSelectedDuration,
            },
          });
        }, 0);
        return updatedContents;
      }
      
      setNextEnabled(false);
      setShowQuestionModal(false);
      setIsAnswering(false);
      setIsVoiceAnswer(false);
      setUserAnswer("");
      setScore(null);
      setShowResults(false);
      setShowTranscription(false);
      setCurrentSlideNumber(currentSlideNumber + 1);
      
      return updatedContents;
    });
  };

  useEffect(() => {
    if (input === null) {
      try {
        if (
          !inputSelectedRole ||
          !inputSelectedRole.name ||
          !inputSelectedCourse ||
          !inputSelectedCourse.slug ||
          !inputSelectedDuration
        ) {
          return;
        }
        const inputs = {
          role: allRoles.find(
            (role) => role.id === inputSelectedRole.id
          ) as Role,
          course: allCourses.find(
            (course) => course.slug === inputSelectedCourse.slug
          ) as Course,
          duration: inputSelectedDuration,
        } as PlaygroundInputs;
        // ("Inputs Filled:", inputs);
        setInput(inputs);
      } catch (error) {
        if (error instanceof z.ZodError) {
          setError(error.issues[0].message);
          return;
        }
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    }
  }, [input, inputSelectedRole, inputSelectedCourse, inputSelectedDuration]);

  useEffect(() => {
    async function fetchCourseOutline() {
      if (currentSlideNumber === 1 && input !== null) {
        try {
          setIsLoading(true);
          const inputSelections = {
            roleSlug: input.role.id,
            courseSlug: input.course.slug,
            duration: input.duration,
          } as CourseOutlineInput;
          const content = await workerGetCourseOutline(inputSelections);
          setCurrentSlideContent(content);
          setSlideOutline(content.slides);
          setResult(content);
          const rawAudioUrl = await workerGetTTS({
            voiceover: content.voiceover,
          });
          setAudioUrl(rawAudioUrl);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setIsLoading(false);
        }
      } else if (currentSlideNumber > 1 && input !== null) {
        try {
          setIsLoading(true);
          const inputSelections = {
            roleSlug: input.role.id,
            courseSlug: input.course.slug,
            duration: input.duration,
            page: currentSlideNumber,
            courseContent: JSON.stringify(slideContents, null, 2),
            slides: JSON.stringify(slideOutline, null, 2),
          } as CoursePageInput;
          // ("Input Selections:", inputSelections);
          const content = await workerGetCoursePage(inputSelections);
          setCurrentSlideContent(content);
          setResult(content);
          const rawAudioUrl = await workerGetTTS({
            voiceover: content.voiceover,
          });
          setAudioUrl(rawAudioUrl);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchCourseOutline();
  }, [currentSlideNumber, input]);

  
  useEffect(() => {
    const params = {
      currentPage: "playground" + currentSlideNumber,
      courseSlug: input?.course.slug,
      roleSlug: input?.role.id,
      duration: input?.duration,
    };
    setFeedbackParams(params);
  }, [currentSlideNumber, input]);

  useEffect(() => {
    async function handleQuestionVoiceover() {
      if (showQuestionModal && currentSlideContent?.questionVoiceover) {
        try {
          const audioUrl = await workerGetTTS(
            currentSlideContent.questionVoiceover
          );
          setAudioUrl(audioUrl);
        } catch (error) {
          console.error("Failed to generate speech:", error);
          toast({
            title: "Error",
            description: "Failed to generate speech for the question",
            variant: "destructive",
          });
        }
      }
    }
    handleQuestionVoiceover();
  }, [showQuestionModal, currentSlideNumber]);

  if (
    !inputSelectedRole ||
    !inputSelectedRole.name ||
    !inputSelectedCourse ||
    !inputSelectedCourse.slug ||
    !inputSelectedDuration
  ) {
    return <Navigate to="/role" />;
  }

  if (isLoading) {
    const loadingMessages = [
      "🚀 Refining the course just for you",
      "🔍 Analyzing your role to craft a tailored experience",
      "⚙️ Customizing your learning journey—almost there",
      "🔬 Optimizing content to match your expertise",
      "🔬 Preparing dynamic questions based on your role and preferences",
      "🚀 Loading your personalized training session—hang tight",
      "🔬 Adapting the course to maximize your learning potential",
      "🚀 Setting the stage for your success",
      "🔬 Finalizing your customized cybersecurity insights",
      "🎯 Creating a role-specific challenge—get ready",
      "🔍 Searching for the best resources just for you",
      "⚙️ Fine-tuning your personalized training experience",
      "📚 Organizing role-specific content—please wait",
      "✨ Customizing your learning path for success",
      "🚀 Launching your tailored session—hang tight",
      "🧩 Piecing together insights for your unique journey",
      "🔒 Securing the best knowledge for your role",
      "🎯 Targeting key concepts to match your expertise",
      "🌐 Adapting global insights for your local challenges",
      "⏳ Almost there—preparing the final touches",
      "🛠️ Crafting a role-focused experience just for you",
      "💡 Illuminating the key insights you need—stay tuned",
      "🌟 Enhancing your learning environment—almost done",
      "🕵️‍♂️ Investigating trends to shape your session",
      "🎓 Preparing knowledge tailored to your expertise",
      "💻 Configuring advanced features for your journey",
      "📡 Connecting to the latest industry insights—please wait",
      "🌀 Spinning up a dynamic learning experience for you",
      "🌈 Designing a vibrant pathway to your success",
    ];
    const randomMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    return (
      <PageContainer>
        <LoaderFill message={randomMessage} />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div>Error: {error}</div>
      </PageContainer>
    );
  }

  if (!currentSlideContent) {
    return <div>Slide content not found</div>;
  }

  return (
    <PageContainer>
      <div className="fixed top-3 right-36 flex items-center gap-2 z-30">
        <PresenterAvatarAudioWave isPlaying={audioIsPlaying} size={12} />
        <audio
          controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
          autoPlay
          controls
          onEnded={() => {
            setNextEnabled(true);
            setAudioIsPlaying(false);
            setAudioUrl(undefined);
          }}
          onPause={() => {
            setAudioIsPlaying(false);
          }}
          onPlay={() => {
            setAudioIsPlaying(true);
          }}
          onPlaying={() => {
            setAudioIsPlaying(true);
          }}
          onError={() => {
            toast({
              title: "Error",
              className: "bg-red-500 text-white",
              description:
                "Your browser does not support the audio element. Please use a compatible browser.",
              duration: 0,
            });
          }}
          src={audioUrl}
        />
      </div>
      <button
        disabled={!nextEnabled}
        onClick={() => {
          setShowQuestionModal(true);
        }}
        className="fixed top-3 right-3 px-8 py-3 bg-blue-500 text-white rounded-lg text-base font-medium
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:bg-blue-600 transition-colors mr-4 z-30"
      >
        Next
      </button>
      <PageHeader
        title={currentSlideContent.title}
        subtitle={currentSlideContent.subtitle}
      />

      <div>
        <ReactMarkdown
          children={currentSlideContent.content}
          className="prose min-w-full max-w-full overflow-y-auto max-h-[700px]"
        />
      </div>

      <div className="mb-4 fixed bottom-0 w-[calc(100%-3rem)] z-30">
        <p className="text-sm text-gray-600 mt-1 text-right">
          {currentSlideContent
            ? `${Math.round(currentSlideContent.progress)}% Complete`
            : "0% Complete"}
        </p>
        <Progress
          value={currentSlideContent ? currentSlideContent.progress : 0}
          max={100}
          className="w-full h-3 bg-gray-200"
        />
      </div>

      <Dialog open={showQuestionModal} onOpenChange={setShowQuestionModal}>
        <DialogContent className="bg-white min-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Question</DialogTitle>
            <DialogDescription className="mt-8">
              {result && (
                <ReactMarkdown
                  children={result.question}
                  className="prose min-w-full max-w-full mt-4 overflow-y-auto max-h-[300px]"
                />
              )}
            </DialogDescription>
          </DialogHeader>
          {!isAnswering ? (
            <div className="flex justify-center gap-4 mt-4">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                onClick={handleTextAnswer}
              >
                <MessageSquareText className="w-4 h-4 mr-2" />
                Answer by text
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                onClick={handleVoiceAnswer}
              >
                <Mic className="w-4 h-4 mr-2" />
                Answer by voice
              </Button>
            </div>
          ) : !showResults ? (
            <div className="mt-4 space-y-4">
              {isVoiceAnswer && (
                <div className="flex flex-col items-center gap-4">
                  <Button
                    className={`${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white px-6 py-2`}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? (
                      <>
                        <StopCircle className="w-4 h-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  {recordingStatus && (
                    <p className="text-sm text-gray-600">{recordingStatus}</p>
                  )}
                </div>
              )}
              {(!isVoiceAnswer || (isVoiceAnswer && showTranscription)) && (
                <Textarea
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full"
                  rows={4}
                  required
                />
              )}
              <div className="flex justify-center">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim() || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Answer"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Your Score:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {score?.score}/5
                  </span>
                </div>
                <div>
                  <div className="font-medium">Your Answer:</div>
                  <div className="text-gray-700 mt-1">{userAnswer}</div>
                </div>
                <div>
                  <div className="font-medium">Correct Answer:</div>
                  <div className="text-gray-700 mt-1">{result?.answer}</div>
                </div>
                <div>
                  <div className="font-medium">Feedback:</div>
                  <div className="text-gray-700 mt-1">{score?.feedback}</div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
                  onClick={handleAccept}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
