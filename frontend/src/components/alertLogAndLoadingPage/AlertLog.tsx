import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";

interface IAlertProps {
  AlertOpen: boolean
  AlertTitle: string
  AlertMsg: string
  AlertLogClose: Function
}

const AlertLog = (props: IAlertProps) => {
  const {AlertOpen, AlertTitle, AlertMsg, AlertLogClose} = props

  return (
    <Dialog open={AlertOpen} handler={(e) => {AlertLogClose()}} placeholder={undefined}>
      <DialogHeader placeholder={undefined}>
        <Typography variant="h5" color="blue-gray" placeholder={undefined}>
          {AlertTitle}
        </Typography>
      </DialogHeader>
      <DialogBody className="grid place-items-center gap-4" placeholder={undefined}>
        <Typography className="text-center font-normal" placeholder={undefined}>
          {AlertMsg}
        </Typography>
      </DialogBody>
      <DialogFooter className="space-x-2" placeholder={undefined}>
        <Button variant="text" color="blue-gray" onClick={() => AlertLogClose()} placeholder={undefined}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default AlertLog