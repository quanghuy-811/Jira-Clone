import { Pen, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { userService } from "@/lib/services/userService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormEditUser = ({ user }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: user.userId,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      passWord: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string().required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Phone number must be a number")
        .min(10, "Phone number must be at least 10 digits")
        .required("Phone number is required"),
      passWord: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("passWord"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        const response = await userService.editUser(values);
        router.refresh();
        onClose();
        toast.success("update user Success");
      } catch (error) {
        toast.warning("update user faild");
      }
    },
  });

  const onClose = () => {
    formik.resetForm();
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="ghost" size="icon">
        <Pen size={16} color="#519cec" strokeWidth={2} />
      </Button>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent
            aria-describedby={null}
            className="h-[450px] sm:h-auto overflow-y-auto sm:overflow-auto"
          >
            <DialogTitle className="sr-only">Edit user</DialogTitle>
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xl">Edit User</h1>
              <Button onClick={onClose} variant="ghost" size="icon">
                <X />
              </Button>
            </div>
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              <div className="grid grid-col-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label>ID</Label>
                  <Input name="id" value={formik.values.id} disabled />
                </div>
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.phoneNumber}
                  </p>
                )}
              </div>
              <div>
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-col-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Password </Label>
                  <Input
                    type="password"
                    name="passWord"
                    value={formik.values.passWord}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.passWord && formik.errors.passWord && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.passWord}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Password confirmation</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>
              </div>
              <DialogFooter className={"pt-2"}>
                <Button
                  className="btn hover:text-red-600"
                  onClick={onClose}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button className="btn" color="primary" type="submit">
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FormEditUser;
