import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
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
import userService from "../../services/user-service";
import {
  selectReportModal,
  setReportModal,
} from "../../redux/features/report-modal-slice";
import { USER_UPDATE_POINT } from "../../utils/constant";

interface ReportFormValues {
  reason: string;
}

const ReportModal = () => {
  const { reportModal } = useSelector(selectReportModal);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isSubmit, setIsSubmit] = useState(false);

  const handleClose = () =>
    dispatch(
      setReportModal({
        reportModalOpen: false,
        postId: "",
        otherUserId: "",
        isReported: false,
      })
    );

  const reportForm = useFormik<ReportFormValues>({
    initialValues: {
      reason: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required(t("post.Reason is required")),
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
            otherUserId: reportModal.otherUserId,
            isReported: true,
          })
        );
        await userService.updatePoints({
          user_id: reportModal.otherUserId,
          point: USER_UPDATE_POINT.report,
        });

        toast.success(t("post.You have reported successfully"));
      }

      if (error) toast.error(t("post.Something went wrong"));
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
        className="dark:bg-gray-800"
      >
        <DialogHeader className="flex items-center justify-between dark:text-gray-300">
          {t("post.Report")}
          <IconButton
            variant="text"
            color="red"
            onClick={handleClose}
            className="rounded-full"
          >
            <XMarkIcon className="w-8 h-8" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="border-t dark:border-gray-700">
          <form onSubmit={reportForm.handleSubmit}>
            <Textarea
              className="dark:text-gray-300"
              label={t("post.Reason")}
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
              className="mt-4 normal-case"
              type="submit"
              variant="filled"
              fullWidth
              disabled={isSubmit}
            >
              {isSubmit ? (
                <Spinner className="h-4 w-4 m-auto" />
              ) : (
                t("post.Submit")
              )}
            </Button>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default ReportModal;
