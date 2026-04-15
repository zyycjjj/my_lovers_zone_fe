import Link from "next/link";
import { HelpIcon } from "./login-icons";

export function LoginHelpLink() {
  return (
    <div className="text-center">
      <Link
        className="inline-flex items-center gap-2 text-[14px] font-medium text-[#52525a] hover:text-[#18181b]"
        href="/trial"
      >
        <HelpIcon />
        遇到问题？查看帮助
      </Link>
    </div>
  );
}

