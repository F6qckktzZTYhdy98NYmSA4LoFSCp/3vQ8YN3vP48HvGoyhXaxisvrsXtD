import { useNavigate } from "react-router-dom";
import { HomeIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { workerPostClientLog } from "@/api/workerPostClientLog";

export function BackToHome() {
  const navigate = useNavigate();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      workerPostClientLog({
        event_type: 'modal_open',
        event_name: 'back_to_home_modal_opened',
        event_data: {
          timestamp: new Date().toISOString(),
        }
      }).catch(console.error);
    }
  };

  const handleBackToHome = () => {
    workerPostClientLog({
      event_type: 'button_click',
      event_name: 'back_to_home_acknowledged',
      event_data: {
        timestamp: new Date().toISOString(),
      }
    }).catch(console.error);
    navigate('/');
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <AlertDialog onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <button 
            className="back-to-home p-2 rounded-full bg-blue-400 hover:bg-blue-600 transition-colors"
            title="Back to home"
          >
            <span className="sr-only">Back to Home</span>
            <HomeIcon className="w-5 h-5 text-white" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white/[0.97]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to proceed back to Home? Your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-blue-800 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-green-800 text-white" onClick={handleBackToHome}>Proceed</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
