import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

import {
  Dialog,
  DialogHeader,
  DialogBody,
  IconButton,
  Textarea,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ErrorMessageForm from "../common/error-message-form";

import reportPostService from "../../services/report-service";
import {
  selectReportModal,
  setReportModal,
} from "../../redux/features/report-modal-slice";

interface ReportFormValues {
  reason: string;
}

const ReportModal = () => {
  const { reportModal } = useSelector(selectReportModal);
  const dispatch = useDispatch();

  const [isSubmit, setIsSubmit] = useState(false);

  const handleClose = () =>
    dispatch(
      setReportModal({ reportModalOpen: false, postId: "", isReported: false })
    );

  const reportForm = useFormik<ReportFormValues>({
    initialValues: {
      reason: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Reason is required"),
    }),
    onSubmit: async (values: ReportFormValues) => {
      setIsSubmit(true);

      const { response, error } = await reportPostService.reportPost({
        ...values,
        post_id: reportModal.postId,
      });

      if (response) {
        reportForm.resetForm();
        dispatch(
          setReportModal({
            reportModalOpen: false,
            postId: reportModal.postId,
            isReported: true,
          })
        );

        toast.success(response.data.message);
      }

      if (error) toast.error(error.message);
      setIsSubmit(false);
    },
  });

  return (
    <>
      <Dialog
        size="md"
        open={reportModal.reportModalOpen}
        handler={() => {}}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="flex items-center justify-between">
          Report
          <IconButton
            variant="text"
            color="red"
            onClick={handleClose}
            className="rounded-full"
          >
            <XMarkIcon className="w-8 h-8" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="border-t">
          <form onSubmit={reportForm.handleSubmit}>
            <Textarea
              label="Reason"
              name="reason"
              value={reportForm.values.reason}
              onChange={reportForm.handleChange}
              error={
                reportForm.touched.reason &&
                reportForm.errors.reason !== undefined
              }
            />
            {reportForm.touched.reason && reportForm.errors.reason && (
              <ErrorMessageForm
                message={reportForm.touched.reason && reportForm.errors.reason}
              />
            )}
            <Button
              className="mt-4"
              type="submit"
              variant="gradient"
              fullWidth
              disabled={isSubmit}
            >
              {isSubmit ? <Spinner className="h-4 w-4 m-auto" /> : "Submit"}
            </Button>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default ReportModal;
