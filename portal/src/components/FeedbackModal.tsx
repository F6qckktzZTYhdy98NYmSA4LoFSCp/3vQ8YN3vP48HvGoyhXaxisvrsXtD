import {
  MessageCirclePlus,
  Frown,
  Meh,
  SmileIcon,
  SmilePlus,
  PartyPopper,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FeedbackInputSchema,
  workerPostFeedback,
} from "@/api/workerPostFeedback";
import { useFeedback } from "@/contexts/FeedbackContext";
import { useState, useEffect } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { supabase } from "@/lib/supabase";
import { workerPostClientLog } from "@/api/workerPostClientLog";

export function FeedbackModal() {
  const { params } = useFeedback();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Update form values when params change
  const form = useForm<z.infer<typeof FeedbackInputSchema>>({
    resolver: zodResolver(FeedbackInputSchema),
    defaultValues: {
      courseSlug: params.courseSlug || "",
      roleSlug: params.roleSlug || "",
      duration: params.duration || undefined,
      currentPage: params.currentPage || window.location.pathname,
      feedback: "",
      rating: 0,
      keepMeUpdated: false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!success) { // Don't update if we just had a successful submission
      form.reset({
        courseSlug: params.courseSlug || "",
        roleSlug: params.roleSlug || "",
        duration: params.duration || undefined,
        currentPage: params.currentPage || window.location.pathname,
        feedback: form.getValues("feedback"), // Preserve feedback if any
        rating: form.getValues("rating"), // Preserve rating if any
        keepMeUpdated: form.getValues("keepMeUpdated"), // Preserve keepMeUpdated if any
      });
    }
  }, [params, success, form]);

  // useEffect(() => {
  //   const subscription = form.watch((value, { name, type }) => 
  //     console.log("Form value changed:", { name, type, value, errors: form.formState.errors })
  //   );
  //   return () => subscription.unsubscribe();
  // }, [form]);

  const rating = form.watch("rating");
  const feedback = form.watch("feedback");
  const isSubmitDisabled = !rating || !feedback.trim();

  // console.log("Form state:", { 
  //   isValid: form.formState.isValid,
  //   isDirty: form.formState.isDirty,
  //   errors: form.formState.errors,
  //   isSubmitDisabled 
  // });

  async function onSubmit(values: z.infer<typeof FeedbackInputSchema>) {
    setError(null);
    setSuccess(false);
    // console.log("Submitting feedback with values:", values);

    // Validate required fields
    if (!values.rating || values.rating === 0) {
      setError("Please provide a rating");
      return;
    }
    if (!values.feedback.trim()) {
      setError("Please provide feedback");
      return;
    }

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        setError("You must be logged in to submit feedback");
        return;
      }
      const response = await workerPostFeedback(values);
      // console.log("Feedback submission response:", response);
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message);
      }
      form.reset();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setError(error instanceof Error ? error.message : "Failed to submit feedback");
    }
  }

  const handleClose = () => {
    if (success) {
      form.reset({
        courseSlug: params.courseSlug || "",
        roleSlug: params.roleSlug || "",
        duration: params.duration || undefined,
        currentPage: params.currentPage || window.location.pathname,
        feedback: "",
        rating: 0,
        keepMeUpdated: false,
      });
      setError(null);
      setSuccess(false);
    }
    setOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      workerPostClientLog({
        event_type: 'modal_open',
        event_name: 'feedback_modal_opened',
        event_data: {
          timestamp: new Date().toISOString(),
          ...params
        }
      }).catch(console.error);
    }
  };

  return (
    <div className="fixed top-40 left-4 z-50">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button
            className="post-feedback p-2 rounded-full bg-blue-400 hover:bg-blue-600 transition-colors"
            title="Provide Feedback"
          >
            <span className="sr-only">Provide Feedback</span>
            <MessageCirclePlus className="w-5 h-5 text-white" />
          </button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px] min-w-[500px]"
          aria-describedby="feedback-form-description"
        >
          <DialogHeader>
            <DialogTitle>Please provide your feedback below.</DialogTitle>
            <DialogDescription>
              Share your thoughts and help us improve your experience.
            </DialogDescription>
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
            {success && (
              <div className="bg-green-50 text-green-800 p-3 rounded-md mt-2">
                <p className="text-sm font-medium">Thank you for your feedback!</p>
                <p className="text-xs mt-1">You can now close this dialog.</p>
              </div>
            )}
          </DialogHeader>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                defaultValue={3}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How was your experience?</FormLabel>
                    <FormControl>
                      <div className="flex justify-between items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => field.onChange(rating)}
                            className={`p-2 rounded-full transition-all ${
                              field.value === rating
                                ? "bg-blue-100 scale-125"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {rating === 1 && (
                              <Frown
                                className={`w-8 h-8 ${
                                  field.value === rating
                                    ? "text-red-500"
                                    : "text-gray-400"
                                }`}
                              />
                            )}
                            {rating === 2 && (
                              <Meh
                                className={`w-8 h-8 ${
                                  field.value === rating
                                    ? "text-orange-500"
                                    : "text-gray-400"
                                }`}
                              />
                            )}
                            {rating === 3 && (
                              <SmileIcon
                                className={`w-8 h-8 ${
                                  field.value === rating
                                    ? "text-yellow-500"
                                    : "text-gray-400"
                                }`}
                              />
                            )}
                            {rating === 4 && (
                              <SmilePlus
                                className={`w-8 h-8 ${
                                  field.value === rating
                                    ? "text-green-500"
                                    : "text-gray-400"
                                }`}
                              />
                            )}
                            {rating === 5 && (
                              <PartyPopper
                                className={`w-8 h-8 ${
                                  field.value === rating
                                    ? "text-blue-500"
                                    : "text-gray-400"
                                }`}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription className="text-center mt-2">
                      {field.value === 1 && "Very Poor"}
                      {field.value === 2 && "Poor"}
                      {field.value === 3 && "Average"}
                      {field.value === 4 && "Good"}
                      {field.value === 5 && "Excellent"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feedback"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      What feature did you find most valuable or engaging? Why?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what you think..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keepMeUpdated"
                defaultValue={true}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 px-4 bg-muted/50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        Stay informed?
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Get notified about new features and updates.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* <pre className="mt-4 p-4 bg-gray-100 rounded-md text-sm">
                <div className="font-semibold mb-2">Debug Info:</div>
                <div>Current Page: {form.getValues("currentPage")}</div>
                <div>Course Slug: {form.getValues("courseSlug")}</div>
                <div>Role Slug: {form.getValues("roleSlug")}</div>
                <div>Duration: {form.getValues("duration")}</div>
              </pre> */}

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isSubmitDisabled || success}
                onClick={async (e) => {
                  e.preventDefault();
                  // console.log("Submit button clicked, form values:", form.getValues());
                  try {
                    await onSubmit(form.getValues());
                  } catch (error) {
                    console.error("Error in form submission:", error);
                  }
                }}
              >
                {success ? "Feedback Submitted" : "Submit Feedback"}
              </Button>
              {success && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={handleClose}
                >
                  Close
                </Button>
              )}
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
