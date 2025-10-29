import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export const logSuperAdminAction = async (action: string, user: string = "Super Admin") => {
  try {
    await addDoc(collection(db, "auditLogs"), {
      action,
      user,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to log superadmin action:", err);
  }
};
