import Swal from "sweetalert2";

const basePopup = {
  background: "#ffffff",
  color: "#0f172a",
  buttonsStyling: false,
  customClass: {
    popup: "rounded-3xl shadow-[0_28px_80px_rgba(15,23,42,0.22)]",
    title: "text-slate-950 text-xl font-black",
    htmlContainer: "text-slate-500 text-sm font-medium",
    confirmButton:
      "rounded-2xl px-5 py-2.5 text-sm font-black text-white theme-gradient theme-gradient-hover shadow-[0_14px_30px_rgba(11,125,35,0.22)]",
    cancelButton:
      "rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-50",
    actions: "gap-3",
  },
};

export const showSuccessPopup = (title, text = "") =>
  Swal.fire({
    ...basePopup,
    icon: "success",
    title,
    text,
    confirmButtonText: "OK",
    timer: 2200,
    timerProgressBar: true,
  });

export const showOrderSuccessPopup = (title, text = "") =>
  Swal.fire({
    ...basePopup,
    icon: "success",
    title,
    text,
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText: "Download Invoice",
    cancelButtonText: "Close",
  });
export const showErrorPopup = (title, text = "") =>
  Swal.fire({
    ...basePopup,
    icon: "error",
    title,
    text,
    confirmButtonText: "Try Again",
  });

export const showInfoPopup = (title, text = "") =>
  Swal.fire({
    ...basePopup,
    icon: "info",
    title,
    text,
    confirmButtonText: "Got It",
  });

export const showWarningPopup = (title, text = "") =>
  Swal.fire({
    ...basePopup,
    icon: "warning",
    title,
    text,
    confirmButtonText: "OK",
  });

export const confirmPopup = async ({
  title,
  text,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  icon = "warning",
}) => {
  const result = await Swal.fire({
    ...basePopup,
    icon,
    title,
    text,
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};

