import React, { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const DialogDeleteTask = ({ deleteTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="ghost" size="icon">
        <Trash />
      </Button>

      {isOpen && (
        <Dialog open={isOpen}>
          <DialogContent className="md:max-w-xl" aria-describedby={null}>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
            </DialogHeader>

            <p>
              You're about to permanently delete this issue, its comments and
              attachments, and all of its data.If you're not sure, you can
              resolve or close this issue instead.
            </p>
            <DialogFooter>
              <Button
                className="btn"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="btn"
                type="submit"
                onClick={deleteTask}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DialogDeleteTask;
