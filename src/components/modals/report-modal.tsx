import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  Dialog,
  DialogHeader,
  DialogBody,
  IconButton,
  Textarea,
  DialogFooter,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import {
  selectReportModal,
  setReportModal,
} from "../../redux/features/report-modal-slice";

const ReportModal = () => {
  const { reportModal } = useSelector(selectReportModal);
  const dispatch = useDispatch();

  const [isSubmit, setIsSubmit] = useState(false);

  const handleClose = () =>
    dispatch(
      setReportModal({ reportModalOpen: false, post_id: "", reason: "" })
    );

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
          <form>
            <Textarea label="Reason" />
            <Button
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
