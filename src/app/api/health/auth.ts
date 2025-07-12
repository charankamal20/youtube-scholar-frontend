import { getKeyStatus } from "@/lib/token";

export default function handler(req: any, res: any) {
  const status = getKeyStatus();
  res.status(200).json(status);
}
