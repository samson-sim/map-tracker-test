import { ObjectStatus } from "../stores/ObjectStore";
import { ChipProps } from "@mui/material";

const STATUS_CONFIG: Record<
  ObjectStatus,
  {
    label: string;
    chipColor: ChipProps["color"];
    iconColor: "success" | "warning" | "error";
    borderColor: string;
    backgroundColor: string;
  }
> = {
  active: {
    label: "активний",
    chipColor: "success",
    iconColor: "success",
    borderColor: "success.main",
    backgroundColor: "success.dark",
  },
  lost: {
    label: "втрачений",
    chipColor: "warning",
    iconColor: "warning",
    borderColor: "warning.main",
    backgroundColor: "warning.dark",
  },
  removed: {
    label: "вилучений",
    chipColor: "error",
    iconColor: "error",
    borderColor: "error.main",
    backgroundColor: "error.dark",
  },
};

export const getStatusConfig = (status: ObjectStatus) =>
  STATUS_CONFIG[status] ?? STATUS_CONFIG.lost;
